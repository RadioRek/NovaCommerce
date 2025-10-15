from django.shortcuts import render

# cositas de la API
from rest_framework import viewsets
from .models import Producto, User
from .serializers import ProductoSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser


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
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

