from django.urls import path, include
from . import views

# cositas de la API
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'productos', views.ProductoViewSet, basename="producto")
router.register(r'categorias', views.CategoriaViewSet, basename="categoria")
router.register(r'categoria-productos', views.CategoriaProductoViewSet, basename="categoria-producto")
router.register(r'users', views.UserViewSet, basename="user")
router.register(r'carritos', views.CarritoViewSet, basename="carrito")
router.register(r'detalle-carritos', views.DetalleCarritoViewSet, basename="detalle-carrito")
router.register(r'detalle-ventas', views.DetalleVentaViewSet, basename="detalle-venta")
router.register(r'ventas', views.VentaViewSet, basename="venta")
router.register(r'metodos-pago', views.MetodoPagoViewSet, basename="metodo-pago")


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
    path("checkout/", views.checkout, name="checkout"),
    path("metricas/", views.metricas, name="metricas"),
    path("nosotros/", views.nosotros, name="nosotros"),
    path("actualizarProducto/<int:producto_id>/", views.actualizarProducto, name="actualizarProducto"),
    path("actualizarUsuario/<int:usuario_id>/", views.actualizarUsuario, name="actualizarUsuario"),
    path("confirmacionOrden/<int:venta_id>/", views.confirmacionOrden, name="confirmacionOrden"),
    path("personalizarTienda/", views.personalizarTienda, name="personalizarTienda"),

    path("testEquisde/", views.testEquisde, name="testEquisde"),


    # rutas de la API
    path("api/", include(router.urls)),
    path("api/login/", views.LoginView.as_view(), name="api-login"),
    path("api/logout/", views.LogoutView.as_view(), name="api-logout"),
]
