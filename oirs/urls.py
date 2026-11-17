from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    DepartamentoViewSet,
    EncuestaSatisfaccionViewSet,
    EstadoSolicitudViewSet,
    OIRSTokenView,
    PublicSolicitudViewSet,
    SolicitudViewSet,
)


router = DefaultRouter()
router.register(
    r"solicitudes-publicas",
    PublicSolicitudViewSet,
    basename="solicitud-publica",
)
router.register(
    r"solicitudes",
    SolicitudViewSet,
    basename="solicitud",
)
router.register(
    r"departamentos",
    DepartamentoViewSet,
    basename="departamento",
)
router.register(
    r"estados",
    EstadoSolicitudViewSet,
    basename="estado-solicitud",
)
router.register(
    r"encuestas",
    EncuestaSatisfaccionViewSet,
    basename="encuesta-satisfaccion",
)

urlpatterns = [
    path("", include(router.urls)),
    path("token/", OIRSTokenView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]