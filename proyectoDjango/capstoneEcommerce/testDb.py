import os
import django
import random

# Configura Django antes de importar cualquier modelo
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'capstoneEcommerce.settings')
django.setup()

# Ahora puedes importar desde tu app
from principal.models import (
    DetalleVenta, Venta, CategoriaProducto, Producto, Categoria, User, MetodoPago
)

def poblar_datos():

    # Limpiar solo tablas indicadas
    DetalleVenta.objects.all().delete()
    Venta.objects.all().delete()
    CategoriaProducto.objects.all().delete()
    Producto.objects.all().delete()
    Categoria.objects.all().delete()

    # Usuarios, métodos de pago y tipos de usuario ya existen
    usuarios = list(User.objects.all())
    metodos_pago = list(MetodoPago.objects.all())

    # Nombres genéricos para categorías
    categorias_genericas = [
        "Electrónica", "Ropa", "Juguetes", "Hogar", "Deportes",
        "Libros", "Mascotas", "Herramientas", "Arte", "Cocina"
    ]
    random.shuffle(categorias_genericas)

    # Crear categorías
    categorias = [Categoria.objects.create(nombre=cat) for cat in categorias_genericas]

    # Nombres genéricos para productos
    productos_genericos = [
        "Laptop", "Camiseta", "Muñeca", "Silla", "Bicicleta",
        "Libro", "Collar para perro", "Taladro", "Pintura acrílica", "Sartén"
    ]

    # Lista de nombres de archivo relativos a MEDIA_ROOT
    imagenes = ["productos/cafe.png", "productos/prod2.jpeg", "productos/prod3.jpeg"]

    productos = []
    for nombre in productos_genericos:
        categoria_principal = random.choice(categorias)
        producto = Producto.objects.create(
            nombre=nombre,
            descripcion=f"Descripcion para {nombre}",
            precio=random.randint(1000, 50000),
            stock=random.randint(5, 50),
            categoriaPrincipal=categoria_principal,
            img=random.choice(imagenes)
        )
        productos.append(producto)

    print("Productos creados")

    # Asociar productos con categorías aleatorias (al menos 1 por producto)
    for producto in productos:
        cats_usadas = random.sample(categorias, k=random.randint(1, len(categorias)))
        for cat in cats_usadas:
            CategoriaProducto.objects.create(producto=producto, categoria=cat)

    print("Categorías de productos asociadas")

    # Agrega 300 ventas, usuario y método de pago aleatorio
    ventas = []
    estadoVentas = ['Confirmada', 'Confirmada', 'Confirmada', 'Confirmada', 'Pendiente']
    for _ in range(300):
        usuario = random.choice(usuarios)
        metodo_pago = random.choice(metodos_pago)
        estadoVenta = random.choice(estadoVentas)
        venta = Venta.objects.create(
            totalVenta=0,
            usuario=usuario,
            metodoPago=metodo_pago,
            estadoVenta=estadoVenta
        )
        ventas.append(venta)

    print("Ventas creadas")

    # Para cada venta, asigna al menos un producto con cantidad aleatoria
    contador = 0
    for venta in ventas:
        productos_en_venta = random.sample(productos, k=random.randint(1, 3))
        print(f"Asignando productos a la venta {contador}")
        contador += 1

        for producto in productos_en_venta:
            cantidad = random.randint(1, 10)
            DetalleVenta.objects.create(cantidad=cantidad, producto=producto, venta=venta)

    print("Datos poblados correctamente.")


poblar_datos()
