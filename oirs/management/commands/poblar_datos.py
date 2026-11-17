from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from oirs.models import Departamento, EstadoSolicitud, Solicitud, Usuario


class Command(BaseCommand):
    help = "Carga departamentos, usuarios y solicitudes de prueba para OIRS"

    def handle(self, *args, **options):
        departamentos_nombres = [
            "Dirección de Salud Municipal",
            "Gestión Clínica y Atención Primaria",
            "Farmacia y Abastecimiento",
            "Urgencias y SAPU",
            "Medicina General y Especialidades",
            "Gestión de Personas y Trato Usuario",
            "CESFAM Dr. Botto",
            "CESFAM Pulmahue",
            "CESFAM Conunhueno",
            "Dirección de Salud Municipal",
        ]

        departamentos = {}
        for nombre in departamentos_nombres:
            departamento, creado = Departamento.objects.get_or_create(
                nombre_depto=nombre,
            )
            departamentos[nombre] = departamento
            accion = "creado" if creado else "ya existía"
            self.stdout.write(
                self.style.SUCCESS(f"Departamento '{nombre}': {accion}.")
            )

        usuarios_datos = [
            {
                "rut": "11111111-1",
                "nombre": "Administrador OIRS",
                "email": "administrador@salud.cl",
                "rol": Usuario.Rol.ADMINISTRADOR,
                "departamento": departamentos[
                    "Dirección de Salud Municipal"
                ],
                "password": "Admin2026!",
            },
            {
                "rut": "22222222-2",
                "nombre": "Funcionario OIRS Municipal",
                "email": "oirs.municipal@salud.cl",
                "rol": Usuario.Rol.OIRS_MUNICIPAL,
                "departamento": departamentos[
                    "Dirección de Salud Municipal"
                ],
                "password": "Municipal2026!",
            },
            {
                "rut": "33333333-3",
                "nombre": "Funcionario CESFAM Pulmahue",
                "email": "oirs.pulmahue@salud.cl",
                "rol": Usuario.Rol.OIRS_ESTABLECIMIENTO,
                "departamento": departamentos["CESFAM Pulmahue"],
                "password": "Pulmahue2026!",
            },
        ]

        usuarios = {}
        for datos in usuarios_datos:
            usuario, creado = Usuario.objects.get_or_create(
                rut=datos["rut"],
                defaults={
                    "email": datos["email"],
                    "nombre": datos["nombre"],
                    "rol": datos["rol"],
                    "password": make_password(datos["password"]),
                    "id_departamento": datos["departamento"],
                },
            )

            if not creado:
                usuario.email = datos["email"]
                usuario.rut = datos["rut"]
                usuario.nombre = datos["nombre"]
                usuario.rol = datos["rol"]
                usuario.password = make_password(datos["password"])
                usuario.id_departamento = datos["departamento"]
                usuario.save()

            usuarios[datos["rol"]] = usuario
            accion = "creado" if creado else "ya existía y fue actualizado"
            self.stdout.write(
                self.style.SUCCESS(
                    f"Usuario '{datos['nombre']}' ({datos['rol']}): "
                    f"{accion}. "
                    f"Contraseña: {datos['password']}"
                )
            )

        solicitudes_datos = [
            {
                "tipo_solicitud": Solicitud.TipoSolicitud.CONSULTA,
                "descripcion": (
                    "Consulta de ejemplo sobre horarios y atención "
                    "disponible en CESFAM Dr. Botto."
                ),
                "correo": "ciudadano.botto@example.cl",
                "telefono": "+56911111111",
                "nombre_solicitante": "Ciudadano Botto",
                "rut_solicitante": "44444444-4",
                "departamento": departamentos["CESFAM Dr. Botto"],
                "usuario": usuarios[Usuario.Rol.ADMINISTRADOR],
            },
            {
                "tipo_solicitud": Solicitud.TipoSolicitud.RECLAMO,
                "descripcion": (
                    "Reclamo de ejemplo relacionado con la atención "
                    "recibida en CESFAM Pulmahue."
                ),
                "correo": "ciudadano.pulmahue@example.cl",
                "telefono": "+56922222222",
                "nombre_solicitante": "Ciudadano Pulmahue",
                "rut_solicitante": "55555555-5",
                "departamento": departamentos["CESFAM Pulmahue"],
                "usuario": usuarios[Usuario.Rol.OIRS_ESTABLECIMIENTO],
            },
            {
                "tipo_solicitud": Solicitud.TipoSolicitud.SUGERENCIA,
                "descripcion": (
                    "Sugerencia de ejemplo para mejorar la derivación "
                    "desde CESFAM Conunhueno."
                ),
                "correo": "ciudadano.conunhueno@example.cl",
                "telefono": "+56933333333",
                "nombre_solicitante": "Ciudadana Conunhueno",
                "rut_solicitante": "66666666-6",
                "departamento": departamentos["CESFAM Conunhueno"],
                "usuario": usuarios[Usuario.Rol.OIRS_MUNICIPAL],
            },
        ]

        for datos in solicitudes_datos:
            solicitud, creada = Solicitud.objects.get_or_create(
                descripcion=datos["descripcion"],
                correo=datos["correo"],
                defaults={
                    "tipo_solicitud": datos["tipo_solicitud"],
                    "telefono": datos["telefono"],
                    "nombre_solicitante": datos["nombre_solicitante"],
                    "rut_solicitante": datos["rut_solicitante"],
                    "id_departamento": datos["departamento"],
                    "id_usuario": datos["usuario"],
                },
            )

            if not creada:
                solicitud.tipo_solicitud = datos["tipo_solicitud"]
                solicitud.telefono = datos["telefono"]
                solicitud.nombre_solicitante = datos["nombre_solicitante"]
                solicitud.rut_solicitante = datos["rut_solicitante"]
                solicitud.id_departamento = datos["departamento"]
                solicitud.id_usuario = datos["usuario"]
                solicitud.save()

            estado, estado_creado = EstadoSolicitud.objects.get_or_create(
                id_solicitud=solicitud,
                nombre_estado=EstadoSolicitud.NombreEstado.INGRESADO,
            )

            accion = "creada" if creada else "ya existía y fue actualizada"
            estado_accion = (
                "estado Ingresado creado"
                if estado_creado
                else "estado Ingresado ya existía"
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f"Solicitud {solicitud.folio}: {accion}; "
                    f"{estado_accion}."
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Carga de datos de prueba OIRS finalizada correctamente."
            )
        )
