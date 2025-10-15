from django.shortcuts import render

# cositas de la API
from rest_framework import viewsets, permissions, status
from .models import Producto, Categoria, CategoriaProducto, User
from .serializers import (
    ProductoSerializer,
    LoginSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response


def home(request):
    return render(request, 'home.html')

def registro(request):
    return render(request, 'registro.html')

def sitioLogin(request):
    return render(request, 'sitioLogin.html')

def tienda(request):
    return render(request, 'tienda.html')

def panelControl(request):  
    return render(request, 'panelControl.html')

def producto(request, producto_id):
    return render(request, 'producto.html', {'producto_id': producto_id})

def carrito(request):
    return render(request, 'carrito.html')

def perfil(request):
    return render(request, 'perfil.html')


# mas cositas de la API
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {'request': self.request}


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return Response({"message": "Login exitoso"}, status=status.HTTP_200_OK)
            return Response(
                {"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
