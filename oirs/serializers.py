import re

from rest_framework import serializers

from .models import Usuario

from .models import (
    Departamento,
    EncuestaSatisfaccion,
    EstadoSolicitud,
    Solicitud,
)


class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ["id_departamento", "nombre_depto"]
        read_only_fields = ["id_departamento"]


class SolicitudSerializer(serializers.ModelSerializer):
    estados = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    encuesta = serializers.PrimaryKeyRelatedField(read_only=True)
    estado_actual = serializers.SerializerMethodField()

    class Meta:
        model = Solicitud
        fields = [
            "id_solicitud",
            "folio",
            "tipo_solicitud",
            "descripcion",
            "correo",
            "telefono",
            "fecha_ingreso",
            "plazo_respuesta",
            "id_usuario",
            "id_departamento",
            "estados",
            "encuesta",
            "estado_actual",
        ]
        read_only_fields = [
            "id_solicitud",
            "folio",
            "fecha_ingreso",
            "plazo_respuesta",
        ]

    def get_estado_actual(self, obj):
        estado = obj.estados.first()
        return estado.nombre_estado if estado else "Ingresado"

    def validate_correo(self, value):
        if value and not re.fullmatch(
            r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+"
            r"@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
            r"(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+",
            value,
        ):
            raise serializers.ValidationError(
                "Ingrese un correo electrónico válido."
            )
        return value

    def validate_telefono(self, value):
        if value and not re.fullmatch(r"\+569\d{8}", value):
            raise serializers.ValidationError(
                "El teléfono debe tener formato chileno: +569 seguido de 8 dígitos."
            )
        return value


class PublicSolicitudSerializer(serializers.ModelSerializer):
    establecimiento = serializers.CharField(write_only=True)
    nombre = serializers.CharField(write_only=True, max_length=150)
    rut = serializers.CharField(write_only=True, max_length=12)

    class Meta:
        model = Solicitud
        fields = [
            "id_solicitud",
            "folio",
            "tipo_solicitud",
            "descripcion",
            "correo",
            "telefono",
            "nombre",
            "rut",
            "establecimiento",
            "plazo_respuesta",
            "fecha_ingreso",
        ]
        read_only_fields = [
            "id_solicitud",
            "folio",
            "plazo_respuesta",
            "fecha_ingreso",
        ]

    def validate_rut(self, value):
        if not re.fullmatch(r"\d{7,8}-[\dKk]", value):
            raise serializers.ValidationError(
                "Ingrese un RUT válido con formato 12345678-9."
            )
        return value

    def validate_telefono(self, value):
        if value and not re.fullmatch(r"\+569\d{8}", value):
            raise serializers.ValidationError(
                "El teléfono debe tener formato chileno: +569 seguido de 8 dígitos."
            )
        return value


class EstadoSolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoSolicitud
        fields = [
            "id_estado",
            "nombre_estado",
            "fecha_actualizacion",
            "id_solicitud",
        ]
        read_only_fields = ["id_estado", "fecha_actualizacion"]


class EncuestaSatisfaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EncuestaSatisfaccion
        fields = [
            "id_encuesta",
            "calificacion",
            "comentarios",
            "id_solicitud",
        ]
        read_only_fields = ["id_encuesta"]