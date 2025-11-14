from principal.models import (
    DetalleVenta, Venta, CategoriaProducto, Producto, Categoria, User, MetodoPago, TipoUsuario
)
import os
import django
import random

# Configura Django antes de importar cualquier modelo
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'capstoneEcommerce.settings')
django.setup()

# Ahora puedes importar desde tu app


def poblar_datos():

    # Limpiar solo tablas indicadas
    DetalleVenta.objects.all().delete()
    Venta.objects.all().delete()
    CategoriaProducto.objects.all().delete()
    Producto.objects.all().delete()
    Categoria.objects.all().delete()
    MetodoPago.objects.all().delete()
    User.objects.all().delete()
    TipoUsuario.objects.all().delete()

    # ==============================================================
    # Creamos los tipos de usuario
    tiposUsuario = ["Administrador", "Cliente"]
    for tipo in tiposUsuario:
        TipoUsuario.objects.create(nombre=tipo)

    # ==============================================================
    # Usuarios
    passAdmin = "admin"
    passClientes = "1234"

    usuario1 = {
        "username" : "Alicia",
        "nomnbre" : "Alicia",
        "apellido" : "Liddell",
        "email" : "alicia@gmail.com",
        "direccion" : "Calle Falsa 123",
        "telefono" : 987654321,
        "is_staff" : True,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Administrador")
    }

    usuario2 = {
        "username" : "Lizzie",
        "nomnbre" : "Elizabeth",
        "apellido" : "Bennet",
        "email" : "lizzie@gmail.com",
        "direccion" : "Avenida Siempre Viva 742",
        "telefono" : 123456789,
        "is_staff" : False,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Cliente")
    }

    usuario3 = {
        "username" : "Karlangas",
        "nomnbre" : "Carlos",
        "apellido" : "Santana",
        "email" : "krlo@gmail.com",
        "direccion" : "Boulevard de los Sueños Rotos 456",
        "telefono" : 555666777,
        "is_staff" : False,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Cliente")
    }

    usuario4 = {
        "username" : "Carla",
        "nomnbre" : "Carla",
        "apellido" : "Gonzalez",
        "email" : "carla.g@cafe.cl",
        "direccion" : "Calle del Café 789",
        "telefono" : 444555666,
        "is_staff" : False,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Cliente")
    }

    usuario5 = {
        "username" : "Pedro",
        "nomnbre" : "Pedro",
        "apellido" : "Ramirez",
        "email" : "ramirez@gmail.com",
        "direccion" : "Camino Real 321",
        "telefono" : 222333444,
        "is_staff" : False,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Cliente")
    }

    usuariosClientes = [usuario2, usuario3, usuario4, usuario5]

    # crear admin
    userAdmin = User.objects.create_superuser(**usuario1)
    userAdmin.set_password(passAdmin)
    userAdmin.save()

    # crear clientes
    for usr in usuariosClientes:
        userCliente = User.objects.create_user(**usr)
        userCliente.set_password(passClientes)
        userCliente.save()

    print("Usuarios creados")

    # ==============================================================
    # Métodos de pago
    metodos_pago_nombres = ["Transferencia Bancaria"]
    for nombre in metodos_pago_nombres:
        MetodoPago.objects.create(nombre=nombre)

    print("Métodos de pago creados")

    """
    Grano entero
    Café molido
    Cápsulas y pods
    Café de origen único
    Descafeinado
    Ediciones limitadas
    Café orgánico
    Tueste claro / medio / oscuro
    Café para espresso / filtro / prensa francesa / cold brew
    Accesorios
    Regalos y kits
    Dulces y acompañamientos

    """

    # ==============================================================
    # Nombres genéricos para categorías
    categorias_genericas = [
        "Grano entero", # 0
        "Café molido", # 1
        "Cápsulas y pods", # 2
        "Café de origen único", # 3
        "Descafeinado", # 4
        "Ediciones limitadas", # 5
        "Café orgánico", # 6
        "Tueste claro", # 7
        "Tueste medio", # 8
        "Tueste oscuro", # 9
        "Café para espresso", # 10
        "Café para filtro", # 11
        "Café para prensa francesa", # 12
        "Café para cold brew", # 13
        "Accesorios", # 14
        "Pack", # 15
        "Reglalo", # 16
        "Dulces", # 17
        "Acompañamientos" # 18
    ]

    categorias = []
    for cat in categorias_genericas:
        categoria = Categoria.objects.create(nombre=cat)
        categorias.append(categoria)

    # ==============================================================
    # Productos para crear
    productosParaCrear = []
    categoriasProductos = []

    imgProd1 = "productos/cafe.png"
    producto1 = {
        "nombre" : "",
        "descripcion" : "",
        "precio" : 0,
        "img" : imgProd1,
        "stock" : 0,
        "categoriaPrincipal" : None
    }
    categoriasSecundariasProducto1 = []
    productosParaCrear.append(producto1)
    categoriasProductos.append(categoriasSecundariasProducto1)


    imgProd2 = "productos/imgProd2.png"
    producto2 = {
        "nombre" : "Cafe Molido Etiopia Sidamo",
        "descripcion" : "Molido para filtro, perfil floral.",
        "precio" : 9500,
        "img" : imgProd2,
        "stock" : 120,
        "categoriaPrincipal" : categorias[1]
    }

    imgProd3 = "productos/cafeAndino.pn     g"
    producto3 = {
        "nombre" : "Café Andino Intenso",
        "descripcion" : "Tueste oscuro con amargor marcado, cuerpo pesado y final prolongado. Ideal para quienes buscan una taza fuerte que mantenga sabor incluso con leche. Aroma a cacao tostado y notas terrosas.",
        "precio" : 7500,
        "img" : imgProd3,
        "stock" : 42,
        "categoriaPrincipal" : categorias[9]
    }

    imgProd4 = "productos/imgProd4.png"
    producto4 = {
        "nombre" : "Café Origen Colombia Supremo",
        "descripcion" : "Grano arabico con notas a caramelo y citricos.",
        "precio" : 11900,
        "img" : imgProd4,
        "stock" : 120,
        "categoriaPrincipal" : categoria[0]
    }

    imgProd5 = "productos/imgProd5.png"
    producto5 = {
        "nombre" : "Capsulas Espresso Intenso",
        "descripcion" : "Capsulas compatibles de sabor fuerte.",
        "precio" : 5900,
        "img" : imgProd5,
        "stock" : 200,
        "categoriaPrincipal" : categoria[2]
    }

    imgProd6 = "productos/imgProd6.png"
    producto6 = {
        "nombre" : "Cafetera Prensa Francesa 600 ml",
        "descripcion" : "Vidrio templado y acero.",
        "precio" : 19.900,
        "img" : imgProd6,
        "stock" : 40,
        "categoriaPrincipal" : categoria[12]
    }

    imgProd7 = "productos/Cold_Brew.jpg"
    producto7 = {
        "nombre" : "Costa Fría Cold Brew Mix",
        "descripcion" : "Mezcla diseñada para extracción en frío, baja acidez, cuerpo suave y dulzor natural. Notas a cacao, vainilla y frutos secos. Perfecto para bebidas frías y concentrados.",
        "precio" : 5500,
        "img" : imgProd7,
        "stock" : 120,
        "categoriaPrincipal" : categoria[13]
    }

    imgProd8 = "productos/note_despresso.png"
    producto8 = {
        "nombre" : "Note d' Expresso",
        "descripcion" : "Mezcla diseñada para espresso, crema densa, cuerpo robusto y acidez baja. Notas a chocolate amargo, almendra tostada y un toque especiado. Mantiene consistencia en máquinas automáticas o manuales.",
        "precio" : 9000,
        "img" : imgProd8,
        "stock" : 25,
        "categoriaPrincipal" : categoria[10]
    }

    imgProd9 = "productos/imgProd9.png"
    producto9 = {
        "nombre" : "Kit Lover del Espresso",
        "descripcion" : "Tazas espresso dobles + 500 g de blend espresso.",
        "precio" : 21500,
        "img" : imgProd9,
        "stock" : 50,
        "categoriaPrincipal" : categoria[10]
    }

    imgProd10 = "productos/ehya_descafeinado.png"
    producto10 = {
        "nombre" : "Ehya Cafe Descafeinado",
        "descripcion" : "Café descafeinado mediante método natural que preserva los compuestos aromáticos. Notas a nuez, cacao suave y un dulzor parecido a la panela. Mantiene cuerpo medio y un final redondo, perfecto para consumo nocturno sin alterar el sueño.",
        "precio" : 7800,
        "img" : imgProd10,
        "stock" : 40,
        "categoriaPrincipal" : categoria[4]
    }

    imgProd11 = "productos/imgProd11.png"
    producto11 = {
        "nombre" : "Caja Gourmet Cafe + Dulces",
        "descripcion" : "Cafe 250 g + chocolates artesanales.",
        "precio" : 15900,
        "img" : imgProd11,
        "stock" : 70,
        "categoriaPrincipal" : categoria[10]
    }

    imgProd12 = "productos/native_Organico.png"
    producto1 = {
        "nombre" : "Native Cafe Organico",
        "descripcion" : "Café certificado orgánico cultivado sin pesticidas ni químicos. Notas herbales, cacao natural y frutos secos. Su acidez es baja y su cuerpo es medio, dando como resultado una taza suave y sostenible para el consumo diario.",
        "precio" : 9200,
        "img" : imgProd12,
        "stock" : 32,
        "categoriaPrincipal" : categoria[6]
    }

    imgProd13 = "productos/fortaleza_despertar.jpg"
    producto13 = {
        "nombre" : "Fortaleza Cafe Depertar Platinium",
        "descripcion" : "Mezcla robusta pensada para generar crema espesa, sabor intenso y baja acidez. Notas a chocolate amargo, especias tostadas y un leve toque ahumado. Un espresso directo, fuerte y persistente en boca.",
        "precio" : 10000,
        "img" : imgProd13,
        "stock" : 27,
        "categoriaPrincipal" : categoria[9]
    }

    imgProd14 = "productos/Dolce_Gusto_Expresso_Intenso.png"
    producto14 = {
        "nombre" : "Dolce Gusto Expresso Intenso Nescafe",
        "descripcion" : "Cápsulas compatibles con máquinas de espresso que contienen una mezcla intensa de tueste oscuro con notas a chocolate bitter y caramelo tostado. El café entrega una extracción corta y poderosa, con crema densa y un final levemente dulce. Diseñado para quienes buscan un espresso directo, rápido y consistente sin perder complejidad aromática.",
        "precio" : 5900,
        "img" : imgProd14,
        "stock" : 45,
        "categoriaPrincipal" : categoria[4]
    }

    imgProd15 = "productos/kit_accesorios.jpg"
    producto15 = {
        "nombre" : "Kit Accesorios Barista Inicio",
        "descripcion" : "Set que incluye tamper metálico, jarra espumadora de acero, cepillo de limpieza y cuchara dosificadora. Pensado para quienes preparan espresso en casa y necesitan herramientas básicas pero duraderas.",
        "precio" : 14900,
        "img" : imgProd15,
        "stock" : 22,
        "categoriaPrincipal" : categoria[14]
    }

    imgProd16 = "productos/imgProd16.png"
    producto16 = {
        "nombre" : "Kit Inicio Cafe de Especialidad",
        "descripcion" : "Prensa francesa + 250 g de cafe.",
        "precio" : 34900,
        "img" : imgProd16,
        "stock" : 35,
        "categoriaPrincipal" : categoria[15]
    }

    imgProd17 = "productos/desgustacion_barista_incapto.png"
    producto17 = {
        "nombre" : "Pack Desgustacion barista incapto",
        "descripcion" : "Cada pack contiene 10 cafés diferentes, cada uno en formato mini-bolsa de 80–100 g. Perfil variado para probar tuestes, métodos y orígenes sin comprar bolsas grandes",
        "precio" : 15990,
        "img" : imgProd17,
        "stock" : 40,
        "categoriaPrincipal" : categoria[14]
    }

    imgProd19 = "productos/imgProd19.png"
    producto19 = {
        "nombre" : "Capsulas Descafeinado Suave",
        "descripcion" : "Aroma equilibrado sin cafeina.",
        "precio" : 5800,
        "img" : imgProd19,
        "stock" : 130,
        "categoriaPrincipal" : categoria[4]
    }

    imgProd20 = "productos/GiftBox_Coffee.png"
    producto20 = {
        "nombre" : "Caja Regalo Coffee Lover",
        "descripcion" : "Presentación premium en caja rígida que incluye café de origen único, taza artesanal y tarjeta personalizada. Producto ideal para cumpleaños, empresas y detalles especiales.",
        "precio" : 22500,
        "img" : imgProd20,
        "stock" : 12,
        "categoriaPrincipal" : categoria[16]
    }

    imgProd21 = "productos/galletas_para_cafe.png"
    producto21 = {
        "nombre" : "Galletas Crocantes ",
        "descripcion" : "Galletas artesanales infusionadas con café molido y chocolate bitter. Textura crujiente, dulzor moderado y aroma intenso ideal para acompañar un espresso.",
        "precio" : 3200,
        "img" : imgProd21,
        "stock" : 55,
        "categoriaPrincipal" : categoria[18]
    }

    imgProd22 = "productos/imgProd22.png"
    producto22 = {
        "nombre" : "Blend Casa Versatil",
        "descripcion" : "Mezcla para espresso y filtrados.",
        "precio" : 9800,
        "img" : imgProd22,
        "stock" : 150,
        "categoriaPrincipal" : categoria[8]
    }

    imgProd23 = "productos/bombones_rellenos.jpg"
    producto23 = {
        "nombre" : "Bombones Rellenos de Espresso",
        "descripcion" : "bombones de chocolate amargo con relleno cremoso elaborado con reducción de espresso. Sabor fuerte y final prolongado.",
        "precio" : 4700,
        "img" : imgProd23,
        "stock" : 55,
        "categoriaPrincipal" : categoria[17]
    }

    imgProd24 = "productos/bruma_cafe.png"
    producto24 = {
        "nombre" : "Bruma Matinal Filtrado",
        "descripcion" : "mezcla diseñada para métodos de goteo y filtrado manual. Perfil limpio con notas a caramelo suave, frutos secos y un toque cítrico leve. Cuerpo medio y acidez equilibrada. Mantiene claridad y consistencia en V60, Chemex o cafetera eléctrica.",
        "precio" : 7900,
        "img" : imgProd24,
        "stock" : 44,
        "categoriaPrincipal" : categoria[11]
    }

    imgProd25 = "productos/cafe_tuestemedio.jpg"
    producto25 = {
        "nombre" : "Maya Vinic Cafe tueste medio",
        "descripcion" : "Café redondo y estable, pensado para consumo diario. Notas a chocolate con leche, avellana tostada y un punto de panela. Cuerpo medio-alto y retrogusto dulce. Funciona bien en filtro, prensa y espresso suave.",
        "precio" : 8200,
        "img" : imgProd25,
        "stock" : 38,
        "categoriaPrincipal" : categoria[8]
    }

    imgProd26 = "productos/cafe_tuesteclaro.jpg"
    producto26 = {
        "nombre" : "Claro Amanecer 1982",
        "descripcion" : "Grano de alta montaña con acidez brillante, notas frutales (frutos rojos, mandarina) y aroma floral. Ideal para resaltar complejidad y dulzor natural en métodos de filtrado. Final limpio y refrescante.",
        "precio" : 9000,
        "img" : imgProd26,
        "stock" : 27,
        "categoriaPrincipal" : categoria[7]
    }

    imgProd27= "productos/cafe_especial.jpg"
    producto27 = {
        "nombre" : "Edición Dorada Microlote Especial Chiara",
        "descripcion" : "Microlote exclusivo de cosecha reducida, tostado en pequeños lotes para preservar aromas delicados. Perfil complejo con capas de jazmín, miel, té negro y chocolate oscuro. Alta claridad y textura sedosa. Solo disponible durante la temporada.",
        "precio" : 14900,
        "img" : imgProd27,
        "stock" : 9,
        "categoriaPrincipal" : categoria[5]
    }

    imgProd28 = "productos/cafe_origenunico.jpg"
    producto28 = {
        "nombre" : "Cerro Azul Single Origin",
        "descripcion" : "Proveniente de una sola finca ubicada en altura, donde cada lote se selecciona manualmente para garantizar uniformidad. Presenta un perfil frutal limpio con notas a durazno, naranja madura y miel ligera. Acidez brillante pero equilibrada, cuerpo medio y final dulce persistente. Ideal para métodos que realzan claridad como V60, Kalita o Aeropress.",
        "precio" : 11500,
        "img" : imgProd28,
        "stock" : 22,
        "categoriaPrincipal" : categoria[3]
    }











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

