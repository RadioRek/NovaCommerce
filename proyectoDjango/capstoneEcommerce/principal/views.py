from django.shortcuts import render

# Create your views here.


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