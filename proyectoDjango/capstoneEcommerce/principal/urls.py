from django.urls import path, include
from . import views

# cositas de la API
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet
router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename="producto")


urlpatterns = [
    # aqui se agregan las urls de la app principal (las rutas que se ingresan en el navegador)
    # se le indica la url de la ruta, la funcion del archivo views.py que se va a ejecutar y un nombre para la ruta para identificarla
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('registro/', views.registro, name='registro'),
    path('sitioLogin/', views.sitioLogin, name='sitioLogin'),
    path('panelControl/', views.panelControl, name='panelControl'),
    path('sitioLogin/', views.sitioLogin, name='sitioLogin'),
    path('tienda/', views.tienda, name='tienda'),
    path('producto/<int:producto_id>/', views.producto, name='producto'),
    path('perfil/', views.perfil, name='perfil'),


    # rutas de la API
    path('api/', include(router.urls)),
    path('carrito/', views.carrito, name='carrito'),
]



