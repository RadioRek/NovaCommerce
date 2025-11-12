from django.shortcuts import render, redirect

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
    VentaSerializer,
    MetodoPagoSerializer,
)

from rest_framework import viewsets, permissions, status, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from rest_framework.decorators import action


# para las metricas
from datetime import datetime, time
from django.utils import timezone
from django.db.models import Sum
from django.db.models.functions import Coalesce


# testing
def home(request):
    return render(request, 'home.html')


def testEquisde(request):
    return render(request, 'testEquisde.html')


def nosotros(request):
    return render(request, 'nosotros.html')


def registro(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'registro.html')


def confirmacionOrden(request, venta_id):
    venta = Venta.objects.get(id=venta_id)
    detalles_venta = DetalleVenta.objects.filter(venta=venta)
    user = request.user

    if user.is_authenticated:
        if user.tipoUsuario.nombre.lower() == "administrador":
            return render(request, 'confirmacionOrden.html', {'venta': venta, 'detalles_venta': detalles_venta})
        if venta.usuario == user:
            return render(request, 'confirmacionOrden.html', {'venta': venta, 'detalles_venta': detalles_venta})
        else:
            return redirect('home')
    else:
        return redirect('sitioLogin')



def sitioLogin(request):
    if request.user.is_authenticated:
        return redirect('perfil')
    return render(request, 'sitioLogin.html')


def tienda(request):
    return render(request, 'tienda.html')


def panelControl(request):
    user = request.user
    if user.is_authenticated:
        if user.tipoUsuario.nombre.lower() == "administrador":
            return render(request, 'panelControl.html')

    return redirect('home')


def producto(request, producto_id):

    producto = Producto.objects.get(id=producto_id)

    categorias = CategoriaProducto.objects.filter(producto=producto)

    if producto:
        return render(request, 'producto.html', {'producto': producto, 'categorias': categorias})
    else:
        return render(request, 'home.html')


def actualizarProducto(request, producto_id):
    user = request.user
    if user.is_authenticated:
        if user.tipoUsuario.nombre.lower() == "administrador":
            producto = Producto.objects.get(id=producto_id)
            categorias = CategoriaProducto.objects.filter(producto=producto)
            return render(request, 'actualizarP.html', {'producto': producto, 'categorias': categorias})

    return redirect('home')


def actualizarUsuario(request, usuario_id):
    user = request.user
    if user.is_authenticated:
        if user.tipoUsuario.nombre.lower() == "administrador":
            usuario = User.objects.get(id=usuario_id)
            return render(request, 'actualizarUsuario.html', {'usuario': usuario})

    return redirect('home')


def carrito(request):
    return render(request, 'carrito.html')


def checkout(request):
    return render(request, 'checkout.html')


def metricas(request):
    user = request.user
    if user.is_authenticated:
        if user.tipoUsuario.nombre.lower() == "administrador":
            return render(request, 'metricas.html')

    return redirect('home')


def perfil(request):
    user = request.user

    if user.is_authenticated:
        if user.tipoUsuario.nombre.lower() == "administrador":
            ventas = Venta.objects.all().order_by('-fechaHora')
        else:
            ventas = Venta.objects.filter(usuario=user).order_by('-fechaHora')

        return render(request, 'perfil.html', {'ventas': ventas, 'user': user})
    else:
        return redirect('sitioLogin')


# mas cositas de la API
"""
    los LLM explican pesimo como utilizar los permisos de django rest framework, no los usen para esto, hay que hacerlo manualmente
    (pesimos de verdad, ni siquiera lo intenten)
    todas las view.action que existen son 'retrieve', 'list', 'create', 'update', 'partial_update', 'destroy'

    estas clases son generales se usan en algunos endpoints
    - controlPermisosListRetrieve: solo los administradores pueden crear, actualizar, eliminar. Todos pueden listar y obtener
    - controlPermisosAccesoAdmin: solo los administradores pueden acceder al endpoint
"""


class controlPermisosListRetrieve(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return True
        if view.action in ['list', 'retrieve', 'productos_destacados', 'categorias_destacadas']:
            return True
        return False


class controlPermisosAccesoAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return True
        return False


class controlPermisosEndpointUsuario(permissions.BasePermission):
    """
        esta clase controla los permisos del endpoint de usuarios (hacer otra clase para otro endpoint si es necesario)
        - los administradores pueden ver, editar, editar parcialmente y eliminar cualquier usuario
        - los usuarios normales solo pueden ver y editar (completo o parcial) su propio usuario
        - cualquier persona que haga post al endpoint de usuarios (crear usuario) esta permitida
    """

    def has_permission(self, request, view):
        user = request.user

        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return True

        if view.action in ['create', 'retrieve']:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return True

        if obj == user:
            if view.action in ['retrieve', 'partial_update']:
                return True

        return False


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [controlPermisosEndpointUsuario]

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username', None)
        idUsuario = self.request.query_params.get('id', None)

        if username:
            queryset = queryset.filter(username__icontains=username)
        if idUsuario:
            queryset = queryset.filter(id=idUsuario)
        return queryset


class ProductoViewSet(viewsets.ModelViewSet):
    """
        - los permisos para este viewset son controlPermisosListRetrieve
        - los administradores pueden ver, crear, editar, editar parcialmente y eliminar cualquier producto
        - los usuarios normales solo pueden ver (listar y obtener) los productos
    """

    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [controlPermisosListRetrieve]

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
        categorias = self.request.query_params.getlist('categorias')
        print("Categorias recibidas en query params:", categorias)

        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if idProducto:
            queryset = queryset.filter(id=idProducto)
        if categorias:
            queryset = queryset.filter(categoriaproducto__categoria__id__in=categorias).distinct()

        return queryset

    @action(detail=False, methods=['get'], url_path='productos-destacados')
    def productos_destacados(self, request):
        productos_ventas = (
            DetalleVenta.objects
            .values('producto__id')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('-total_vendido')[:5]
        )
        productos_ids = []
        for producto in productos_ventas:
            productos_ids.append(producto['producto__id'])

        productos = Producto.objects.filter(id__in=productos_ids)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data, status=200)


class CategoriaViewSet(viewsets.ModelViewSet):
    """
        - los permisos para este viewset son controlPermisosListRetrieve
        - los administradores pueden ver, crear, editar, editar parcialmente y eliminar cualquier categoria
        - los usuarios normales solo pueden ver (listar y obtener) las categorias
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [controlPermisosListRetrieve]

    def get_queryset(self):
        queryset = Categoria.objects.all()

        nombre = self.request.query_params.get('nombre', None)

        if nombre is not None:
            queryset = queryset.filter(nombre__icontains=nombre)

        return queryset

    @action(detail=False, methods=['get'], url_path='categorias-destacadas')
    def categorias_destacadas(self, request):
        # obtener las categorias con mas ventas con todos sus datos
        categorias_ventas = (
            DetalleVenta.objects
            .values('producto__categoriaPrincipal__id', 'producto__categoriaPrincipal__nombre')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('-total_vendido')[:5]
        )
        categorias_ids = []
        for categoria in categorias_ventas:
            categorias_ids.append(categoria['producto__categoriaPrincipal__id'])

        categorias = Categoria.objects.filter(id__in=categorias_ids)
        serializer = self.get_serializer(categorias, many=True)
        return Response(serializer.data, status=200)


class CategoriaProductoViewSet(viewsets.ModelViewSet):
    """
        - los permisos para este viewset son controlPermisosListRetrieve
        - los administradores pueden ver, crear, editar, editar parcialmente y eliminar cualquier relacion categoria
        - los usuarios normales solo pueden ver (listar y obtener) las relaciones categoria-producto
    """
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer
    permission_classes = [controlPermisosListRetrieve]

    def get_queryset(self):
        queryset = CategoriaProducto.objects.all()

        producto_id = self.request.query_params.get('producto_id', None)

        if producto_id:
            queryset = queryset.filter(producto__id=producto_id)

        return queryset


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


class controlPermisosEndpointCarrito(permissions.BasePermission):
    """
        esta clase controla los permisos del endpoint de carritos
        -Los administradores pueden ver, editar, editar parcialmente y eliminar cualquier carrito
        -Los usuarios normales solo pueden crear y obtener su propio carrito
        -Los usuarios no autenticados no pueden acceder a estos endpoints

        el endpoint de carrito no se esta usando para nada realmente, podria considerar borrarse, aunque no se pierde nada con tenerlo aqui
    """

    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return True

            if view.action in ['retrieve', 'create']:
                return True

        return False

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return True

            if obj.usuario == user:
                if view.action in ['retrieve']:
                    return True

        return False


class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer
    permission_classes = [controlPermisosEndpointCarrito]

    def get_queryset(self):
        queryset = Carrito.objects.all()
        idCarrito = self.request.query_params.get('idCarrito', None)
        idUsuario = self.request.query_params.get('idUsuario', None)
        if idCarrito:
            queryset = queryset.filter(id=idCarrito)
        if idUsuario:
            queryset = queryset.filter(usuario__id=idUsuario)
        return queryset


class DetalleCarritoViewSet(viewsets.ModelViewSet):
    """
        -Los administradores pueden ver, editar, editar parcialmente y eliminar cualquier detalle de carrito
        -Los usuarios normales pueden crear detalleCarritos para su propio carrito
        -Los usuarios normales pueden editar detalleCarritos de su propio carrito
        -Los usuarios normales pueden obtener detalleCarritos de su propio carrito
        -Los usuarios normales pueden eliminar detalleCarritos de su propio carrito
        -Los usuarios no autenticados no pueden acceder a estos endpoints
    """
    queryset = DetalleCarrito.objects.all()
    serializer_class = DetalleCarritoSerializer

    def get_queryset(self):
        queryset = DetalleCarrito.objects.all()
        user = self.request.user

        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return queryset
            else:
                carrito, _ = Carrito.objects.get_or_create(usuario=user)
                queryset = queryset.filter(carrito=carrito)

                return queryset
        else:
            return Response(
                {'error': 'Debes iniciar sesión para ver los detalles del carrito'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    def create(self, request):
        # Verificar que el usuario esté autenticado
        user = request.user
        if user.is_authenticated:
            producto_id = request.data.get('producto_id')
            cantidad = request.data.get('cantidad', 1)

            # Obtener o crear carrito
            carrito, _ = Carrito.objects.get_or_create(usuario=user)

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

        else:
            return Response(
                {'error': 'Debes iniciar sesión para agregar productos al carrito'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

    def get_queryset(self):
        queryset = Venta.objects.all()
        user = self.request.user

        if user.is_authenticated:
            if user.tipoUsuario.nombre.lower() == "administrador":
                return queryset
            else:
                queryset = queryset.filter(usuario=user)
                return queryset
        else:
            return Response(
                {'error': 'Debes iniciar sesión para ver las ventas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    def create(self, request):
        user = request.user
        if user.is_authenticated:
            carrito = Carrito.objects.get(usuario=user)
            detalles_carrito = DetalleCarrito.objects.filter(carrito=carrito)

            if not detalles_carrito.exists():
                return Response(
                    {'error': 'El carrito está vacío'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # comprobar el stock antes de crear la venta
            for detalle in detalles_carrito:
                if detalle.cantidad > detalle.producto.stock:
                    return Response(
                        {'error': f'No hay suficiente stock para el producto {detalle.producto.nombre}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            total_venta = 0
            for detalle in detalles_carrito:
                total_venta = total_venta + (detalle.producto.precio * detalle.cantidad)

            # obtenemos los datos de la request para crear la venta
            nombre = request.data.get('nombre', '')
            apellido = request.data.get('apellido', '')
            region = request.data.get('region', '')
            comuna = request.data.get('comuna', '')
            direccion = request.data.get('direccion', '')
            telefono = request.data.get('telefono', '')

            if not all([nombre, apellido, region, comuna, direccion, telefono]):
                return Response(
                    {'error': 'Faltan datos para completar la compra'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # solo tenemos un metodo de pago por ahora
            metodo_pago = MetodoPago.objects.first()

            # crear la venta
            venta = Venta.objects.create(
                totalVenta=total_venta,
                nombreDestinatario=nombre,
                apellidoDestinatario=apellido,
                region=region,
                comuna=comuna,
                direccionEnvio=direccion,
                telefonoContacto=telefono,
                usuario=user,
                metodoPago=metodo_pago
            )

            for detalle in detalles_carrito:
                DetalleVenta.objects.create(
                    venta=venta,
                    producto=detalle.producto,
                    cantidad=detalle.cantidad,
                )
                # actualizar el stock del producto
                detalle.producto.stock = detalle.producto.stock - detalle.cantidad
                detalle.producto.save()

            # Vaciar el carrito
            detalles_carrito.delete()

            serializer = VentaSerializer(venta)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': 'Debes iniciar sesión para realizar una compra'},
                status=status.HTTP_401_UNAUTHORIZED
            )


    @action(detail=False, methods=['get'], url_path='ventas-pendientes', permission_classes=[controlPermisosAccesoAdmin])
    def ventas_pendientes(self, request):
        idBuscar = request.query_params.get('idBuscar', None)

        if idBuscar:
            ventas_pendientes = Venta.objects.filter(estadoVenta='Pendiente', id=idBuscar).order_by('-fechaHora')
            serializer = self.get_serializer(ventas_pendientes, many=True)
            return Response(serializer.data, status=200)

        ventas_pendientes = Venta.objects.filter(estadoVenta='Pendiente').order_by('-fechaHora')
        serializer = self.get_serializer(ventas_pendientes, many=True)
        return Response(serializer.data, status=200)


    @action(detail=False, methods=['get'], url_path='metricas')
    def metricas(self, request):
        today = timezone.localdate()
        first_day_of_month = today.replace(day=1)

        start_today = timezone.make_aware(datetime.combine(today, time.min))
        end_today = timezone.make_aware(datetime.combine(today, time.max))

        start_month = timezone.make_aware(datetime.combine(first_day_of_month, time.min))
        end_month = timezone.make_aware(datetime.combine(today, time.max))

        ventas_mes = Venta.objects.filter(fechaHora__gte=start_month, fechaHora__lte=end_month)
        ventas_dia = Venta.objects.filter(fechaHora__gte=start_today, fechaHora__lte=end_today)


        total_ventas_mes = ventas_mes.aggregate(total=Coalesce(Sum('totalVenta'), 0))['total']
        cantidad_ventas_mes = ventas_mes.count()

        total_ventas_dia = ventas_dia.aggregate(total=Coalesce(Sum('totalVenta'), 0))['total']
        cantidad_ventas_dia = ventas_dia.count()

        # revisar ventas dia
        print("Total ventas dia:", total_ventas_dia)
        print("Cantidad ventas dia:", cantidad_ventas_dia)

        top_productos = (
            DetalleVenta.objects
            .values('producto__nombre')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('-total_vendido')[:10]
        )

        flop_productos = (
            DetalleVenta.objects
            .values('producto__nombre')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('total_vendido')[:10]
        )

        top_categorias = (
            DetalleVenta.objects
            .values('producto__categoriaPrincipal__nombre')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('-total_vendido')[:5]
        )

        flop_categorias = (
            DetalleVenta.objects
            .values('producto__categoriaPrincipal__nombre')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('total_vendido')[:5]
        )

        # productos con menos de 5 de stock
        productos_bajo_stock = Producto.objects.filter(stock__lt=5).values('nombre', 'stock')

        data = {
            'total_ventas_mes': total_ventas_mes,
            'cantidad_ventas_mes': cantidad_ventas_mes,
            'total_ventas_dia': total_ventas_dia,
            'cantidad_ventas_dia': cantidad_ventas_dia,
            'top_productos': list(top_productos),
            'top_categorias': list(top_categorias),
            'flop_productos': list(flop_productos),
            'flop_categorias': list(flop_categorias),
            'productos_bajo_stock': list(productos_bajo_stock),
        }

        return Response(data, status=200)


class MetodoPagoViewSet(viewsets.ModelViewSet):
    queryset = MetodoPago.objects.all()
    serializer_class = MetodoPagoSerializer

    def get_queryset(self):
        queryset = MetodoPago.objects.all()

        nombre = self.request.query_params.get('nombre', None)

        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)

        return queryset
