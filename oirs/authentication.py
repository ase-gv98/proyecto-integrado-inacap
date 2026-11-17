from rest_framework_simplejwt.authentication import JWTAuthentication


class OIRSJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        user.rol = validated_token.get("rol")
        user.id_departamento_id = validated_token.get("id_departamento")
        user.auth = validated_token
        return user
