import logging
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken

from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Departamento,
    EncuestaSatisfaccion,
    EstadoSolicitud,
    Solicitud,
    Usuario,
)
from .permissions import PermisoOIRS
from .serializers import (
    DepartamentoSerializer,
    EncuestaSatisfaccionSerializer,
    EstadoSolicitudSerializer,
    PublicSolicitudSerializer,
    SolicitudSerializer,
)


logger = logging.getLogger(__name__)


class OIRSTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Acepta tanto 'correo', 'email' o 'username' desde el frontend
        identificador = (
            request.data.get("correo") or 
            request.data.get("email") or 
            request.data.get("username", "")
        ).strip()
        password = request.data.get("password", "")

        if not identificador or not password:
            return Response(
                {"detail": "Ingrese su usuario/correo y contraseña."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile = None
        try:
            # Busca en tu modelo Usuario por email o por nombre si coincide
            profile = Usuario.objects.select_related("id_departamento").get(Q(email__iexact=identificador) | Q(nombre__iexact=identificador)
            )
        except Usuario.DoesNotExist:
            return Response(
                {"detail": "Credenciales inválidas o usuario no registrado en OIRS."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Valida la contraseña usando el sistema de hashes de Django
        from django.contrib.auth.hashers import check_password
        
        # Si el usuario del modelo Usuario tiene contraseña configurada
        if profile.password and profile.password.startswith("pbkdf2_"):
            valido = check_password(password, profile.password)
        else:
            # Fallback por si la contraseña se creó plana o mediante el sistema de auth de Django
            user_auth = authenticate(username=profile.email, password=password)
            valido = user_auth is not None

        if not valido:
            return Response(
                {"detail": "Correo o contraseña incorrectos."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Sincroniza o crea el usuario de Django auth para generar el token JWT
        django_user, _ = User.objects.get_or_create(
            username=profile.email,
            defaults={"email": profile.email, "first_name": profile.nombre},
        )
        django_user.email = profile.email
        django_user.first_name = profile.nombre
        django_user.save()

        refresh = RefreshToken.for_user(django_user)
        refresh["nombre"] = profile.nombre
        refresh["rol"] = profile.rol
        refresh["id_departamento"] = profile.id_departamento_id

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "usuario": {
                "nombre": profile.nombre,
                "correo": profile.email,
                "rol": profile.rol,
                "id_departamento": profile.id_departamento_id,
            },
        })


class PublicSolicitudViewSet(viewsets.GenericViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = PublicSolicitudSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            establecimiento = data.pop("establecimiento")
            nombre = data.pop("nombre")
            rut = data.pop("rut")

            departamento, _ = Departamento.objects.get_or_create(
                nombre_depto=establecimiento,
            )
            solicitud = serializer.save(
                id_departamento=departamento,
                nombre_solicitante=nombre,
                rut_solicitante=rut,
            )

            EstadoSolicitud.objects.create(
                nombre_estado=EstadoSolicitud.NombreEstado.INGRESADO,
                id_solicitud=solicitud,
            )
            return Response(
                self.get_serializer(solicitud).data,
                status=status.HTTP_201_CREATED,
            )
        except ValidationError:
            raise
        except IntegrityError as exc:
            logger.warning("Error de integridad al registrar solicitud: %s", exc)
            return Response(
                {"detail": "No fue posible registrar la solicitud."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exc:
            logger.exception("Error inesperado al registrar una solicitud")
            return Response(
                {"detail": "Error interno al registrar la solicitud."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"], url_path="estado/(?P<folio>[^/.]+)")
    def consultar_estado(self, request, folio=None):
        try:
            solicitud = get_object_or_404(Solicitud, folio=folio)
            ultimo_estado = solicitud.estados.first()

            return Response({
                "folio": solicitud.folio,
                "tipo_solicitud": solicitud.tipo_solicitud,
                "fecha_ingreso": solicitud.fecha_ingreso,
                "plazo_respuesta": solicitud.plazo_respuesta,
                "estado": (
                    ultimo_estado.nombre_estado
                    if ultimo_estado
                    else EstadoSolicitud.NombreEstado.INGRESADO
                ),
                "fecha_actualizacion": (
                    ultimo_estado.fecha_actualizacion
                    if ultimo_estado
                    else solicitud.fecha_ingreso
                ),
            })
        except ValidationError:
            raise
        except Exception as exc:
            logger.exception("Error al consultar el estado del folio %s", folio)
            return Response(
                {"detail": "Error interno al consultar el estado."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    permission_classes = [PermisoOIRS]

    def get_queryset(self):
        queryset = super().get_queryset()
        role = PermisoOIRS()._get_role(self.request.user)

        if role in {"OIRS_MUNICIPAL", "ADMINISTRADOR"}:
            return queryset

        department_id = PermisoOIRS()._get_department_id(self.request.user)
        if role in {"OIRS_ESTABLECIMIENTO", "DIRECCION"}:
            return queryset.filter(id_departamento_id=department_id)

        if role == "COMUNICACIONES":
            return queryset

        return queryset.none()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError:
            raise
        except IntegrityError as exc:
            logger.warning("Error de integridad al crear solicitud interna: %s", exc)
            return Response(
                {"detail": "No fue posible crear la solicitud."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exc:
            logger.exception("Error inesperado al crear solicitud interna")
            return Response(
                {"detail": "Error interno."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    permission_classes = [PermisoOIRS]

    def get_queryset(self):
        return super().get_queryset().order_by("nombre_depto")


class EstadoSolicitudViewSet(viewsets.ModelViewSet):
    queryset = EstadoSolicitud.objects.select_related("id_solicitud")
    serializer_class = EstadoSolicitudSerializer
    permission_classes = [PermisoOIRS]

    def get_queryset(self):
        queryset = super().get_queryset()
        role = PermisoOIRS()._get_role(self.request.user)
        if role in {"OIRS_MUNICIPAL", "ADMINISTRADOR"}:
            return queryset
        department_id = PermisoOIRS()._get_department_id(self.request.user)
        if role in {"OIRS_ESTABLECIMIENTO", "DIRECCION", "COMUNICACIONES"}:
            return queryset.filter(id_solicitud__id_departamento_id=department_id)
        return queryset.none()


class EncuestaSatisfaccionViewSet(viewsets.ModelViewSet):
    queryset = EncuestaSatisfaccion.objects.select_related("id_solicitud")
    serializer_class = EncuestaSatisfaccionSerializer
    permission_classes = [PermisoOIRS]

    def get_queryset(self):
        queryset = super().get_queryset()
        role = PermisoOIRS()._get_role(self.request.user)
        if role in {"OIRS_MUNICIPAL", "ADMINISTRADOR"}:
            return queryset
        department_id = PermisoOIRS()._get_department_id(self.request.user)
        if role in {"OIRS_ESTABLECIMIENTO", "DIRECCION", "COMUNICACIONES"}:
            return queryset.filter(id_solicitud__id_departamento_id=department_id)
        return queryset.none()