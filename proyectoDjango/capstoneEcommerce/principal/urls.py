from django.urls import path, include
from . import views

urlpatterns = [
    # aqui se agregan las urls de la app principal (las rutas que se ingresan en el navegador)
    # se le indica la url de la ruta, la funcion del archivo views.py que se va a ejecutar y un nombre para la ruta para identificarla
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('registro/', views.registro, name='registro'),
    path('sitioLogin/', views.sitioLogin, name='sitioLogin'),
    path('tienda/', views.tienda, name='tienda'),    
]
