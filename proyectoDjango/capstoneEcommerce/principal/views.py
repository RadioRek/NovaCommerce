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

