from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"

    # Puedes agregar validaciones personalizadas si es necesario
    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo.")
        return value
    # se usa validate_<NOMBRE DEL CAMPO A VALIDAR>
    # si la validacion falla, la api respondera con un error 400 (bad request)

