from django.db import migrations, models


DEPARTAMENTOS = [
    "Dirección de Salud Municipal",
    "Gestión Clínica y Atención Primaria",
    "Farmacia y Abastecimiento",
    "Urgencias y SAPU",
    "Medicina General y Especialidades",
    "Gestión de Personas y Trato Usuario",
]


def crear_departamentos(apps, schema_editor):
    Departamento = apps.get_model("oirs", "Departamento")
    for nombre in DEPARTAMENTOS:
        Departamento.objects.get_or_create(nombre_depto=nombre)


def eliminar_departamentos(apps, schema_editor):
    Departamento = apps.get_model("oirs", "Departamento")
    Departamento.objects.filter(nombre_depto__in=DEPARTAMENTOS).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("oirs", "0004_usuario_id_departamento_usuario_password"),
    ]

    operations = [
        migrations.AlterField(
            model_name="estadosolicitud",
            name="nombre_estado",
            field=models.CharField(
                choices=[
                    ("Ingresado", "Ingresado"),
                    ("Derivado", "Derivado"),
                    ("En Proceso", "En Proceso"),
                    ("Respondido", "Respondido"),
                    ("Cerrado", "Cerrado"),
                ],
                max_length=20,
                verbose_name="Nombre del estado",
            ),
        ),
        migrations.RunPython(crear_departamentos, eliminar_departamentos),
    ]
