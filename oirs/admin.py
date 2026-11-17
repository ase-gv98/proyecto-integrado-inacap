from django.contrib import admin
from .models import Usuario, Departamento, Solicitud, EstadoSolicitud, EncuestaSatisfaccion

# Registramos los modelos para que aparezcan en el panel de administración
admin.site.register(Usuario)
admin.site.register(Departamento)
admin.site.register(Solicitud)
admin.site.register(EstadoSolicitud)
admin.site.register(EncuestaSatisfaccion)