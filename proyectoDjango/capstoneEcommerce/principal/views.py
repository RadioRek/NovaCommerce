from django.shortcuts import render

# cositas de la API
from rest_framework import viewsets, permissions
from .models import Producto, Categoria, CategoriaProducto, User
from .serializers import ProductoSerializer, CategoriaSerializer, CategoriaProductoSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser

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
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {'request': self.request}
    
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer

class IsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.tipoUsuario
            and request.user.tipoUsuario.nombre.lower() == "administrador"
        )

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdministrador]