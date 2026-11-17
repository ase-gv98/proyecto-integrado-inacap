from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator, MaxValueValidator, MinValueValidator
from django.db import models, transaction
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
import re


RUT_REGEX = re.compile(r"^\d{7,8}-[\dKk]$")


def validar_rut(rut):
    """Valida el formato básico del RUT chileno."""
    if not RUT_REGEX.fullmatch(rut):
        raise ValidationError(
            "Ingrese un RUT válido con formato 12345678-9."
        )


def calcular_dias_habiles(fecha, cantidad_dias=15):
    """
    Calcula una fecha sumando días hábiles, excluyendo sábados y domingos.
    Los feriados deben incorporarse posteriormente mediante una tabla o
    configuración administrativa.
    """
    resultado = fecha
    dias_agregados = 0

    while dias_agregados < cantidad_dias:
        resultado += timedelta(days=1)
        if resultado.weekday() < 5:
            dias_agregados += 1

    return resultado


class Usuario(models.Model):
    class Rol(models.TextChoices):
        OIRS_ESTABLECIMIENTO = "OIRS_ESTABLECIMIENTO", "OIRS Establecimiento"
        OIRS_MUNICIPAL = "OIRS_MUNICIPAL", "OIRS Municipal"
        DIRECCION = "DIRECCION", "Dirección"
        ADMINISTRADOR = "ADMINISTRADOR", "Administrador"
        COMUNICACIONES = "COMUNICACIONES", "Comunicaciones"

    id_usuario = models.AutoField(
        primary_key=True,
        verbose_name="ID usuario",
    )
    rut = models.CharField(
        max_length=12,
        unique=True,
        validators=[validar_rut],
        verbose_name="RUT",
    )
    nombre = models.CharField(
        max_length=150,
        verbose_name="Nombre",
    )
    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        verbose_name="Rol",
    )
    email = models.EmailField(
        validators=[EmailValidator()],
        verbose_name="Correo electrónico",
    )
    password = models.CharField(
        max_length=128,
        verbose_name="Contraseña",
        default="",
    )
    id_departamento = models.ForeignKey(
        "Departamento",
        on_delete=models.PROTECT,
        related_name="usuarios",
        db_column="id_departamento",
        verbose_name="Establecimiento",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["nombre"]

    def __str__(self):
        return f"{self.nombre} ({self.rut})"


class Departamento(models.Model):
    id_departamento = models.AutoField(
        primary_key=True,
        verbose_name="ID departamento",
    )
    nombre_depto = models.CharField(
        max_length=150,
        unique=True,
        verbose_name="Nombre del departamento",
    )

    class Meta:
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"
        ordering = ["nombre_depto"]

    def __str__(self):
        return self.nombre_depto


class Solicitud(models.Model):
    class TipoSolicitud(models.TextChoices):
        RECLAMO = "Reclamo", "Reclamo"
        SUGERENCIA = "Sugerencia", "Sugerencia"
        CONSULTA = "Consulta", "Consulta"
        FELICITACION = "Felicitación", "Felicitación"

    id_solicitud = models.AutoField(
        primary_key=True,
        verbose_name="ID solicitud",
    )
    folio = models.CharField(
        max_length=14,
        unique=True,
        editable=False,
        verbose_name="Folio",
    )
    tipo_solicitud = models.CharField(
        max_length=20,
        choices=TipoSolicitud.choices,
        verbose_name="Tipo de solicitud",
    )
    descripcion = models.TextField(
        verbose_name="Descripción",
    )
    correo = models.EmailField(
        blank=True,
        null=True,
        verbose_name="Correo del solicitante",
    )
    telefono = models.CharField(
        max_length=12,
        blank=True,
        null=True,
        verbose_name="Teléfono del solicitante",
    )
    nombre_solicitante = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name="Nombre del solicitante",
    )
    rut_solicitante = models.CharField(
        max_length=12,
        blank=True,
        null=True,
        validators=[validar_rut],
        verbose_name="RUT del solicitante",
    )
    fecha_ingreso = models.DateTimeField(
        default=timezone.now,
        verbose_name="Fecha de ingreso",
    )
    plazo_respuesta = models.DateField(
        editable=False,
        verbose_name="Plazo de respuesta",
    )
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name="solicitudes",
        db_column="id_usuario",
        verbose_name="Usuario",
        blank=True,
        null=True,
    )
    id_departamento = models.ForeignKey(
        Departamento,
        on_delete=models.PROTECT,
        related_name="solicitudes",
        db_column="id_departamento",
        verbose_name="Departamento",
    )

    class Meta:
        verbose_name = "Solicitud"
        verbose_name_plural = "Solicitudes"
        ordering = ["-fecha_ingreso"]
        constraints = [
            models.CheckConstraint(
                condition=~Q(descripcion=""),
                name="solicitud_descripcion_no_vacia",
            ),
            models.CheckConstraint(
                condition=Q(plazo_respuesta__gte=models.F("fecha_ingreso__date")),
                name="solicitud_plazo_posterior_ingreso",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.pk:
            fecha_ingreso = self.fecha_ingreso or timezone.now()
            self.fecha_ingreso = fecha_ingreso

            if not self.plazo_respuesta:
                self.plazo_respuesta = calcular_dias_habiles(
                    fecha_ingreso.date(),
                    cantidad_dias=15,
                )

            if not self.folio:
                with transaction.atomic():
                    anio = fecha_ingreso.year
                    prefijo = f"OIRS-{anio}-"
                    solicitudes = (
                        Solicitud.objects
                        .select_for_update()
                        .filter(folio__startswith=prefijo)
                        .order_by("-folio")
                    )

                    ultimo_folio = solicitudes.values_list(
                        "folio",
                        flat=True,
                    ).first()

                    if ultimo_folio:
                        try:
                            ultimo_numero = int(ultimo_folio.rsplit("-", 1)[1])
                        except (IndexError, ValueError):
                            ultimo_numero = 0
                    else:
                        ultimo_numero = 0

                    siguiente_numero = ultimo_numero + 1
                    self.folio = f"{prefijo}{siguiente_numero:04d}"

            return super().save(*args, **kwargs)

        if not self.plazo_respuesta:
            self.plazo_respuesta = calcular_dias_habiles(
                self.fecha_ingreso.date(),
                cantidad_dias=15,
            )

        return super().save(*args, **kwargs)

    def clean(self):
        super().clean()

        if self.descripcion is not None and not self.descripcion.strip():
            raise ValidationError({
                "descripcion": "La descripción no puede estar vacía."
            })

    def __str__(self):
        return f"{self.folio} - {self.tipo_solicitud}"


class EstadoSolicitud(models.Model):
    class NombreEstado(models.TextChoices):
        INGRESADO = "Ingresado", "Ingresado"
        DERIVADO = "Derivado", "Derivado"
        EN_PROCESO = "En Proceso", "En Proceso"
        RESPONDIDO = "Respondido", "Respondido"
        CERRADO = "Cerrado", "Cerrado"

    id_estado = models.AutoField(
        primary_key=True,
        verbose_name="ID estado",
    )
    nombre_estado = models.CharField(
        max_length=20,
        choices=NombreEstado.choices,
        verbose_name="Nombre del estado",
    )
    fecha_actualizacion = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de actualización",
    )
    id_solicitud = models.ForeignKey(
        Solicitud,
        on_delete=models.CASCADE,
        related_name="estados",
        db_column="id_solicitud",
        verbose_name="Solicitud",
    )

    class Meta:
        verbose_name = "Estado de solicitud"
        verbose_name_plural = "Estados de solicitud"
        ordering = ["-fecha_actualizacion"]

    def __str__(self):
        return f"{self.id_solicitud.folio}: {self.nombre_estado}"


class EncuestaSatisfaccion(models.Model):
    id_encuesta = models.AutoField(
        primary_key=True,
        verbose_name="ID encuesta",
    )
    calificacion = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ],
        verbose_name="Calificación",
    )
    comentarios = models.TextField(
        blank=True,
        verbose_name="Comentarios",
    )
    id_solicitud = models.OneToOneField(
        Solicitud,
        on_delete=models.CASCADE,
        related_name="encuesta",
        db_column="id_solicitud",
        verbose_name="Solicitud",
    )

    class Meta:
        verbose_name = "Encuesta de satisfacción"
        verbose_name_plural = "Encuestas de satisfacción"
        constraints = [
            models.CheckConstraint(
                condition=Q(calificacion__gte=1) & Q(calificacion__lte=5),
                name="encuesta_calificacion_1_5",
            ),
        ]

    def clean(self):
        super().clean()

        if self.calificacion is not None and not 1 <= self.calificacion <= 5:
            raise ValidationError({
                "calificacion": "La calificación debe estar entre 1 y 5."
            })

    def __str__(self):
        return f"Encuesta {self.id_encuesta} - Solicitud {self.id_solicitud.folio}"