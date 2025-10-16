from django.shortcuts import render

# cositas de la API
from rest_framework import viewsets, permissions, status
from .models import Producto, Categoria, CategoriaProducto, User
from .serializers import ProductoSerializer, CategoriaSerializer, CategoriaProductoSerializer, UserSerializer, LoginSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response

# testing


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
class IsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.tipoUsuario
            and request.user.tipoUsuario.nombre.lower() == "administrador"
        )


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = Producto.objects.all()
        nombre = self.request.query_params.get('nombre', None)
        idProducto = self.request.query_params.get('id', None)
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if idProducto:
            queryset = queryset.filter(id=idProducto)
        return queryset


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdministrador]


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
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
