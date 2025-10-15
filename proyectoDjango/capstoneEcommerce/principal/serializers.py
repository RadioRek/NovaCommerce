import re
from rest_framework import serializers
from .models import Producto, TipoUsuario, User


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "nombre",
            "apellido",
            "direccion",
            "telefono",
            "email",
            "password",
            "tipoUsuario",
            "is_active",
        ]
        read_only_fields = ["id", "is_active"]

    # validacion para regla de contraseña nico gei
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("La contraseña debe tener al menos un caracter especial.")

        return value

    def create(self, validated_data):

        password = validated_data.pop("password")

        tipo_usuario = TipoUsuario.objects.get(nombre="Cliente")
        validated_data["tipoUsuario"] = tipo_usuario

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
