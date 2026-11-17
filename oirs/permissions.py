from rest_framework.permissions import BasePermission


class PermisoOIRS(BasePermission):
    SAFE_METHODS = ("GET", "HEAD", "OPTIONS")

    def _get_role(self, user):
        if hasattr(user, "rol"):
            return getattr(user, "rol", None)

        for attribute in ("oirs_usuario", "usuario_oirs", "perfil", "profile"):
            profile = getattr(user, attribute, None)
            if profile is not None:
                return getattr(profile, "rol", None)

        if getattr(getattr(user, "auth", None), "payload", None):
            return user.auth.payload.get("rol")
        return None

    def _get_department_id(self, user):
        department_id = getattr(user, "id_departamento_id", None)
        if department_id is not None:
            return department_id

        department = getattr(user, "id_departamento", None)
        if getattr(department, "id_departamento", None) is not None:
            return department.id_departamento

        for attribute in ("oirs_usuario", "usuario_oirs", "perfil", "profile"):
            profile = getattr(user, attribute, None)
            if profile is not None:
                department_id = getattr(profile, "id_departamento_id", None)
                if department_id is not None:
                    return department_id
                department = getattr(profile, "id_departamento", None)
                if getattr(department, "id_departamento", None) is not None:
                    return department.id_departamento

        if getattr(getattr(user, "auth", None), "payload", None):
            return user.auth.payload.get("id_departamento")
        return None

    def _get_request_department_id(self, obj):
        if hasattr(obj, "id_solicitud"):
            solicitud = obj.id_solicitud
            if hasattr(solicitud, "id_departamento_id"):
                return solicitud.id_departamento_id
        if hasattr(obj, "id_departamento_id"):
            return obj.id_departamento_id
        if hasattr(obj, "id_departamento"):
            department = obj.id_departamento
            return getattr(department, "id_departamento", department)
        return None

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = self._get_role(request.user)
        if role not in {
            "OIRS_ESTABLECIMIENTO",
            "OIRS_MUNICIPAL",
            "DIRECCION",
            "ADMINISTRADOR",
            "COMUNICACIONES",
        }:
            return False

        if role == "DIRECCION":
            return request.method in self.SAFE_METHODS

        return True

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        role = self._get_role(request.user)
        if role in {"OIRS_MUNICIPAL", "ADMINISTRADOR"}:
            return True

        if role == "DIRECCION":
            if request.method not in self.SAFE_METHODS:
                return False
            return (
                self._get_department_id(request.user)
                == self._get_request_department_id(obj)
            )

        if role == "OIRS_ESTABLECIMIENTO":
            return (
                self._get_department_id(request.user)
                == self._get_request_department_id(obj)
            )

        if role == "COMUNICACIONES":
            return request.method in self.SAFE_METHODS

        return False