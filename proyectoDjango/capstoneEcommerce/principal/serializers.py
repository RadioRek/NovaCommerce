import re
from rest_framework import serializers
from .models import Producto, Categoria, CategoriaProducto, TipoUsuario, User, Carrito, DetalleCarrito, DetalleVenta, Venta, MetodoPago

class ProductoSerializer(serializers.ModelSerializer):
    categorias = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    categorias_actuales = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'precio', 'descripcion', 'stock',
            'img', 'categoriaPrincipal', 'categorias', 'categorias_actuales'
        ]

    def get_categorias_actuales(self, obj):
        return [
            cp.categoria.id
            for cp in obj.categoriaproducto_set.all()
        ]

    def update(self, instance, validated_data):
        categorias = validated_data.pop('categorias', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if categorias is not None:
            instance.categoriaproducto_set.all().delete()
            for cat_id in categorias:
                CategoriaProducto.objects.create(producto=instance, categoria_id=cat_id)
        return instance


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class CategoriaProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)

    class Meta:
        model = CategoriaProducto
        fields = "__all__"


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


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

    # validacion para regla de contraseña
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

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrito
        fields = "__all__"

class DetalleCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCarrito
        fields = "__all__"

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = "__all__"

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = "__all__"