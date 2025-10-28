from django.shortcuts import render, redirect
from datetime import datetime

# cositas de la API

from .models import Producto, Categoria, CategoriaProducto, User, Categoria, CategoriaProducto, User, Carrito, DetalleCarrito, DetalleVenta, Venta, MetodoPago
from .serializers import (
    ProductoSerializer,
    LoginSerializer,
    CategoriaSerializer,
    CategoriaProductoSerializer,
    UserSerializer,
    LoginSerializer,
    CarritoSerializer,
    DetalleCarritoSerializer,
    DetalleVentaSerializer,
    VentaSerializer)

from rest_framework import viewsets, permissions, status, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from rest_framework.decorators import action


# para las metricas
from django.db.models import Sum, Count, OuterRef, Subquery
from django.utils.timezone import now
from django.db.models.functions import Coalesce


# testing
import random


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


def metricas(request):
    return render(request, 'metricas.html')


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

    def create(self, request):
        # Verificar que el usuario esté autenticado
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Debes iniciar sesión para agregar productos al carrito'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad', 1)

        # Obtener o crear carrito
        carrito, _ = Carrito.objects.get_or_create(usuario=request.user)

        # Obtener producto
        producto = Producto.objects.get(id=producto_id)

        # Crear o actualizar detalle del carrito
        detalle, created = DetalleCarrito.objects.get_or_create(
            carrito=carrito,
            producto=producto,
            defaults={'cantidad': cantidad}
        )

        if not created:
            detalle.cantidad = detalle.cantidad + int(cantidad)
            detalle.save()

        serializer = DetalleCarritoSerializer(detalle)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

    @action(detail=False, methods=['get'], url_path='metricas')
    def metricas(self, request):
        today = now().date()
        first_day_of_month = today.replace(day=1)

        ventas_mes = Venta.objects.filter(fechaHora__date__gte=first_day_of_month)
        ventas_dia = Venta.objects.filter(fechaHora__date=today)

        total_ventas_mes = ventas_mes.aggregate(total=Coalesce(Sum('totalVenta'), 0))['total']
        cantidad_ventas_mes = ventas_mes.count()

        total_ventas_dia = ventas_dia.aggregate(total=Coalesce(Sum('totalVenta'), 0))['total']
        cantidad_ventas_dia = ventas_dia.count()

        top_productos = (
            DetalleVenta.objects
            .values('producto__nombre')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('-total_vendido')[:10]
        )

        top_categorias = (
            DetalleVenta.objects
            .values('producto__categoriaPrincipal__nombre')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('-total_vendido')[:5]
        )

        top_usuarios = (
            Venta.objects
            .values('usuario__username')
            .annotate(total_compras=Count('id'))
            .order_by('-total_compras')[:10]
        )

        data = {
            'total_ventas_mes': total_ventas_mes,
            'cantidad_ventas_mes': cantidad_ventas_mes,
            'total_ventas_dia': total_ventas_dia,
            'cantidad_ventas_dia': cantidad_ventas_dia,
            'top_productos': list(top_productos),
            'top_categorias': list(top_categorias),
            'top_usuarios': list(top_usuarios),
        }

        return Response(data, status=200)
