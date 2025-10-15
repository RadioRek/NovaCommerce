from django.urls import path, include
from . import views


# cositas de la API
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
router = DefaultRouter()
router.register(r'productos', views.ProductoViewSet, basename="producto")


urlpatterns = [
    # aqui se agregan las urls de la app principal (las rutas que se ingresan en el navegador)
    # se le indica la url de la ruta, la funcion del archivo views.py que se va a ejecutar y un nombre para la ruta para identificarla
    path("", views.home, name="home"),
    path("home/", views.home, name="home"),
    path("registro/", views.registro, name="registro"),
    path("sitioLogin/", views.sitioLogin, name="sitioLogin"),
    path("panelControl/", views.panelControl, name="panelControl"),
    path("tienda/", views.tienda, name="tienda"),
    path("producto/<int:producto_id>/", views.producto, name="producto"),
    path("perfil/", views.perfil, name="perfil"),
    path("carrito/", views.carrito, name="carrito"),
    # rutas de la API
    path("api/", include(router.urls)),
    path("api/login/", views.LoginView.as_view(), name="api-login"),
    path("api/logout/", views.LogoutView.as_view(), name="api-logout"),
]
