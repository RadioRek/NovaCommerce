from django.contrib import admin
from .models import Producto, Categoria, TipoUsuario, MetodoPago, Venta, User, CategoriaProducto, DetalleVenta

# Register your models here.
admin.site.register(Producto)
admin.site.register(Categoria)
admin.site.register(TipoUsuario)
admin.site.register(MetodoPago)
admin.site.register(Venta)
admin.site.register(User)
admin.site.register(CategoriaProducto)
admin.site.register(DetalleVenta)

