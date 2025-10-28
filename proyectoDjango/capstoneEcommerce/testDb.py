import random

def poblar_datos():
    from principal.views import (
        DetalleVenta, Venta, CategoriaProducto, Producto, Categoria, User, MetodoPago
    )

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

    productos = []
    for nombre in productos_genericos:
        categoria_principal = random.choice(categorias)
        producto = Producto.objects.create(
            nombre=nombre,
            descripcion=f"Descripcion para {nombre}",
            precio=random.randint(1000, 50000),
            stock=random.randint(5, 50),
            categoriaPrincipal=categoria_principal
        )
        productos.append(producto)

    # Asociar productos con categorías aleatorias (al menos 1 por producto)
    for producto in productos:
        cats_usadas = random.sample(categorias, k=random.randint(1, len(categorias)))
        for cat in cats_usadas:
            CategoriaProducto.objects.create(producto=producto, categoria=cat)

    # Agrega 10 ventas, usuario y método de pago aleatorio
    ventas = []
    for _ in range(10):
        usuario = random.choice(usuarios)
        metodo_pago = random.choice(metodos_pago)
        venta = Venta.objects.create(
            totalVenta=0,
            usuario=usuario,
            metodoPago=metodo_pago
        )
        ventas.append(venta)

    # Para cada venta, asigna al menos 3 productos y cantidad aleatoria (1 a 10)
    for venta in ventas:
        productos_en_venta = random.sample(productos, k=random.randint(3, len(productos)))
        for producto in productos_en_venta:
            cantidad = random.randint(1, 10)
            DetalleVenta.objects.create(cantidad=cantidad, producto=producto, venta=venta)

    print("Datos poblados correctamente.")

poblar_datos()