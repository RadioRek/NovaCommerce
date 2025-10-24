from django.shortcuts import render, redirect

# cositas de la API

from .models import Producto, Categoria, CategoriaProducto, User, Categoria, CategoriaProducto, User, Carrito, DetalleCarrito
from .serializers import (
    ProductoSerializer, LoginSerializer, CategoriaSerializer, CategoriaProductoSerializer, UserSerializer, LoginSerializer, CarritoSerializer, DetalleCarritoSerializer
)

from rest_framework import viewsets, permissions, status, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

# testing


def home(request):
    return render(request, 'home.html')


def registro(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'registro.html')


def sitioLogin(request):
    if request.user.is_authenticated:
        return redirect('perfil')
    return render(request, 'sitioLogin.html')


def tienda(request):
    return render(request, 'tienda.html')


def panelControl(request):
    return render(request, 'panelControl.html')


def producto(request, producto_id):
    producto = Producto.objects.get(id=producto_id)
    categorias = CategoriaProducto.objects.filter(producto=producto)
    if producto:
        return render(request, 'producto.html', {'producto': producto, 'categorias': categorias})
    else:
        return render(request, 'home.html')

def carrito(request):
    return render(request, 'carrito.html')

def checkout(request):
    return render(request, 'checkout.html')

def perfil(request):

    user = request.user

    context = {
        'user': user,
    }

    if user.is_authenticated:
        return render(request, 'perfil.html', context)
    else:
        return redirect('sitioLogin')


# mas cositas de la API
class IsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.tipoUsuario and request.user.tipoUsuario.nombre.lower() == "administrador"
        )


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser]

    # paginacion para productos
    class ProductoPagination(PageNumberPagination):
        page_size = 8
        page_size_query_param = 'page_size'
        max_page_size = 999999

    pagination_class = ProductoPagination

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = Producto.objects.all()
        nombre = self.request.query_params.get('nombre', None)
        idProducto = self.request.query_params.get('id', None)
        categorias = self.request.query_params.getlist('categorias')  # lista de IDs

        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if idProducto:
            queryset = queryset.filter(id=idProducto)
        if categorias:
            queryset = queryset.filter(categoriaproducto__categoria__id__in=categorias).distinct()

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

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username', None)
        idUsuario = self.request.query_params.get('id', None)

        if username:
            queryset = queryset.filter(username__icontains=username)
        if idUsuario:
            queryset = queryset.filter(id=idUsuario)
        return queryset

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    def get(self, request):
        logout(request)
        return redirect('sitioLogin')


class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer

class DetalleCarritoViewSet(viewsets.ModelViewSet):
    queryset = DetalleCarrito.objects.all()
    serializer_class = DetalleCarritoSerializer
