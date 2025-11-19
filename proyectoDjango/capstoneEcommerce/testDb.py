import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'capstoneEcommerce.settings')
django.setup()

from principal.models import (
    DetalleVenta, Venta, CategoriaProducto, Producto, Categoria, User, MetodoPago, TipoUsuario
)
from datetime import datetime
import random

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
        "nombre" : "Alicia",
        "apellido" : "Liddell",
        "email" : "alicia@gmail.com",
        "direccion" : "Calle Falsa 123",
        "telefono" : 987654321,
        "is_staff" : True,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Administrador")
    }

    usuario2 = {
        "username" : "Lizzie",
        "nombre" : "Elizabeth",
        "apellido" : "Bennet",
        "email" : "lizzie@gmail.com",
        "direccion" : "Avenida Siempre Viva 742",
        "telefono" : 123456789,
        "is_staff" : False,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Cliente")
    }

    usuario3 = {
        "username" : "Karlangas",
        "nombre" : "Carlos",
        "apellido" : "Santana",
        "email" : "krlo@gmail.com",
        "direccion" : "Boulevard de los Sueños Rotos 456",
        "telefono" : 555666777,
        "is_staff" : False,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Cliente")
    }

    usuario4 = {
        "username" : "Carla",
        "nombre" : "Carla",
        "apellido" : "Gonzalez",
        "email" : "carla.g@cafe.cl",
        "direccion" : "Calle del Café 789",
        "telefono" : 444555666,
        "is_staff" : False,
        "tipoUsuario" : TipoUsuario.objects.get(nombre="Cliente")
    }

    usuario5 = {
        "username" : "Pedro",
        "nombre" : "Pedro",
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
    metodos_pago_nombres = ["Transferencia"]
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
        "Grano entero",  # 0
        "Café molido",  # 1
        "Cápsulas y pods",  # 2
        "Café de origen único",  # 3
        "Descafeinado",  # 4
        "Ediciones limitadas",  # 5
        "Café orgánico",  # 6
        "Tueste claro",  # 7
        "Tueste medio",  # 8
        "Tueste oscuro",  # 9
        "Café para espresso",  # 10
        "Café para filtro",  # 11
        "Café para prensa francesa",  # 12
        "Café para cold brew",  # 13
        "Accesorios",  # 14
        "Pack",  # 15
        "Reglalo",  # 16
        "Dulces",  # 17
        "Acompañamientos"  # 18
    ]

    categorias = []
    for cat in categorias_genericas:
        categoria = Categoria.objects.create(nombre=cat)
        categorias.append(categoria)

    # ==============================================================
    # Productos para crear
    productosParaCrear = []
    categoriasProductos = []

    imgProd2 = "productos/imgProd2.png"
    producto2 = {
        "nombre" : "Cafe Molido Etiopia Sidamo",
        "descripcion" : "Molido para filtro, perfil floral.",
        "precio" : 9500,
        "img" : imgProd2,
        "stock" : 120,
        "categoriaPrincipal" : categorias[1]
    }
    categoriasSecundariasProducto2 = [categorias[3], categorias[7], categorias[11]]
    productosParaCrear.append(producto2)
    categoriasProductos.append(categoriasSecundariasProducto2)

    imgProd3 = "productos/cafeAndino.png"
    producto3 = {
        "nombre" : "Café Andino Intenso",
        "descripcion" : "Tueste oscuro con amargor marcado, cuerpo pesado y final prolongado. Ideal para quienes buscan una taza fuerte que mantenga sabor incluso con leche. Aroma a cacao tostado y notas terrosas.",
        "precio" : 7500,
        "img" : imgProd3,
        "stock" : 42,
        "categoriaPrincipal" : categorias[9]
    }
    categoriasSecundariasProducto3 = [categorias[0], categorias[10]]
    productosParaCrear.append(producto3)
    categoriasProductos.append(categoriasSecundariasProducto3)

    imgProd4 = "productos/imgProd4.png"
    producto4 = {
        "nombre" : "Café Origen Colombia Supremo",
        "descripcion" : "Grano arabico con notas a caramelo y citricos.",
        "precio" : 11900,
        "img" : imgProd4,
        "stock" : 120,
        "categoriaPrincipal" : categorias[0]
    }
    categoriasSecundariasProducto4 = [categorias[3], categorias[7]]
    productosParaCrear.append(producto4)
    categoriasProductos.append(categoriasSecundariasProducto4)

    imgProd5 = "productos/imgProd5.png"
    producto5 = {
        "nombre" : "Capsulas Espresso Intenso",
        "descripcion" : "Capsulas compatibles de sabor fuerte.",
        "precio" : 5900,
        "img" : imgProd5,
        "stock" : 200,
        "categoriaPrincipal" : categorias[2]
    }
    categoriasSecundariasProducto5 = [categorias[9], categorias[10]]
    productosParaCrear.append(producto5)
    categoriasProductos.append(categoriasSecundariasProducto5)

    imgProd6 = "productos/imgProd6.png"
    producto6 = {
        "nombre" : "Cafetera Prensa Francesa 600 ml",
        "descripcion" : "Vidrio templado y acero.",
        "precio" : 19900,
        "img" : imgProd6,
        "stock" : 40,
        "categoriaPrincipal" : categorias[12]
    }
    categoriasSecundariasProducto6 = [categorias[14], categorias[16]]
    productosParaCrear.append(producto6)
    categoriasProductos.append(categoriasSecundariasProducto6)

    imgProd7 = "productos/Cold_Brew.jpg"
    producto7 = {
        "nombre" : "Costa Fría Cold Brew Mix",
        "descripcion" : "Mezcla diseñada para extracción en frío, baja acidez, cuerpo suave y dulzor natural. Notas a cacao, vainilla y frutos secos. Perfecto para bebidas frías y concentrados.",
        "precio" : 5500,
        "img" : imgProd7,
        "stock" : 120,
        "categoriaPrincipal" : categorias[13]
    }
    categoriasSecundariasProducto7 = [categorias[7], categorias[10], categorias[6]]
    productosParaCrear.append(producto7)
    categoriasProductos.append(categoriasSecundariasProducto7)

    imgProd8 = "productos/note_despresso.png"
    producto8 = {
        "nombre" : "Note d' Expresso",
        "descripcion" : "Mezcla diseñada para espresso, crema densa, cuerpo robusto y acidez baja. Notas a chocolate amargo, almendra tostada y un toque especiado. Mantiene consistencia en máquinas automáticas o manuales.",
        "precio" : 9000,
        "img" : imgProd8,
        "stock" : 25,
        "categoriaPrincipal" : categorias[10]
    }
    categoriasSecundariasProducto8 = [categorias[8], categorias[1], categorias[6]]
    productosParaCrear.append(producto8)
    categoriasProductos.append(categoriasSecundariasProducto8)

    imgProd9 = "productos/imgProd9.png"
    producto9 = {
        "nombre" : "Kit Lover del Espresso",
        "descripcion" : "Tazas espresso dobles + 500 g de blend espresso.",
        "precio" : 21500,
        "img" : imgProd9,
        "stock" : 50,
        "categoriaPrincipal" : categorias[10]
    }
    categoriasSecundariasProducto9 = [categorias[14], categorias[15]]
    productosParaCrear.append(producto9)
    categoriasProductos.append(categoriasSecundariasProducto9)

    imgProd10 = "productos/ehya_descafeinado.png"
    producto10 = {
        "nombre" : "Ehya Cafe Descafeinado",
        "descripcion" : "Café descafeinado mediante método natural que preserva los compuestos aromáticos. Notas a nuez, cacao suave y un dulzor parecido a la panela. Mantiene cuerpo medio y un final redondo, perfecto para consumo nocturno sin alterar el sueño.",
        "precio" : 7800,
        "img" : imgProd10,
        "stock" : 40,
        "categoriaPrincipal" : categorias[4]
    }
    categoriasSecundariasProducto10 = [categorias[1], categorias[6]]
    productosParaCrear.append(producto10)
    categoriasProductos.append(categoriasSecundariasProducto10)

    imgProd11 = "productos/imgProd11.png"
    producto11 = {
        "nombre" : "Caja Gourmet Cafe + Dulces",
        "descripcion" : "Cafe 250 g + chocolates artesanales.",
        "precio" : 15900,
        "img" : imgProd11,
        "stock" : 70,
        "categoriaPrincipal" : categorias[10]
    }
    categoriasSecundariasProducto11 = [categorias[16], categorias[17], categorias[18]]
    productosParaCrear.append(producto11)
    categoriasProductos.append(categoriasSecundariasProducto11)

    imgProd12 = "productos/native_Organico.png"
    producto12 = {
        "nombre" : "Native Cafe Organico",
        "descripcion" : "Café certificado orgánico cultivado sin pesticidas ni químicos. Notas herbales, cacao natural y frutos secos. Su acidez es baja y su cuerpo es medio, dando como resultado una taza suave y sostenible para el consumo diario.",
        "precio" : 9200,
        "img" : imgProd12,
        "stock" : 32,
        "categoriaPrincipal" : categorias[6]
    }
    categoriasSecundariasProducto12 = [categorias[0], categorias[7], categorias[11]]
    productosParaCrear.append(producto12)
    categoriasProductos.append(categoriasSecundariasProducto12)

    imgProd13 = "productos/fortaleza_despertar.jpg"
    producto13 = {
        "nombre" : "Fortaleza Cafe Depertar Platinium",
        "descripcion" : "Mezcla robusta pensada para generar crema espesa, sabor intenso y baja acidez. Notas a chocolate amargo, especias tostadas y un leve toque ahumado. Un espresso directo, fuerte y persistente en boca.",
        "precio" : 10000,
        "img" : imgProd13,
        "stock" : 27,
        "categoriaPrincipal" : categorias[9]
    }
    categoriasSecundariasProducto13 = [categorias[5], categorias[5], categorias[13]]
    productosParaCrear.append(producto13)
    categoriasProductos.append(categoriasSecundariasProducto13)

    imgProd14 = "productos/Dolce_Gusto_Expresso_Intenso.png"
    producto14 = {
        "nombre" : "Dolce Gusto Expresso Intenso Nescafe",
        "descripcion" : "Cápsulas compatibles con máquinas de espresso que contienen una mezcla intensa de tueste oscuro con notas a chocolate bitter y caramelo tostado. El café entrega una extracción corta y poderosa, con crema densa y un final levemente dulce. Diseñado para quienes buscan un espresso directo, rápido y consistente sin perder complejidad aromática.",
        "precio" : 5900,
        "img" : imgProd14,
        "stock" : 45,
        "categoriaPrincipal" : categorias[4]
    }
    categoriasSecundariasProducto14 = [categorias[2], categorias[5], categorias[7]]
    productosParaCrear.append(producto14)
    categoriasProductos.append(categoriasSecundariasProducto14)

    imgProd15 = "productos/kit_accesorios.jpg"
    producto15 = {
        "nombre" : "Kit Accesorios Barista Inicio",
        "descripcion" : "Set que incluye tamper metálico, jarra espumadora de acero, cepillo de limpieza y cuchara dosificadora. Pensado para quienes preparan espresso en casa y necesitan herramientas básicas pero duraderas.",
        "precio" : 14900,
        "img" : imgProd15,
        "stock" : 22,
        "categoriaPrincipal" : categorias[14]
    }
    categoriasSecundariasProducto15 = [categorias[14], categorias[3], categorias[16]]
    productosParaCrear.append(producto15)
    categoriasProductos.append(categoriasSecundariasProducto15)

    imgProd16 = "productos/imgProd16.png"
    producto16 = {
        "nombre" : "Kit Inicio Cafe de Especialidad",
        "descripcion" : "Prensa francesa + 250 g de cafe.",
        "precio" : 34900,
        "img" : imgProd16,
        "stock" : 35,
        "categoriaPrincipal" : categorias[15]
    }
    categoriasSecundariasProducto16 = [categorias[12], categorias[6], categorias[7]]
    productosParaCrear.append(producto16)
    categoriasProductos.append(categoriasSecundariasProducto16)

    imgProd17 = "productos/desgustacion_barista_incapto.png"
    producto17 = {
        "nombre" : "Pack Desgustacion barista incapto",
        "descripcion" : "Cada pack contiene 10 cafés diferentes, cada uno en formato mini-bolsa de 80–100 g. Perfil variado para probar tuestes, métodos y orígenes sin comprar bolsas grandes",
        "precio" : 15990,
        "img" : imgProd17,
        "stock" : 40,
        "categoriaPrincipal" : categorias[14]
    }
    categoriasSecundariasProducto17 = [categorias[15], categorias[5], categorias[3]]
    productosParaCrear.append(producto17)
    categoriasProductos.append(categoriasSecundariasProducto17)

    imgProd18 = "productos/cafe_origenunico.jpg"
    producto18 = {
        "nombre" : "Cerro Azul Single Origin",
        "descripcion" : "Proveniente de una sola finca ubicada en altura, donde cada lote se selecciona manualmente para garantizar uniformidad. Presenta un perfil frutal limpio con notas a durazno, naranja madura y miel ligera. Acidez brillante pero equilibrada, cuerpo medio y final dulce persistente. Ideal para métodos que realzan claridad como V60, Kalita o Aeropress.",
        "precio" : 11500,
        "img" : imgProd18,
        "stock" : 22,
        "categoriaPrincipal" : categorias[3]
    }
    categoriasSecundariasProducto18 = [categorias[2], categorias[7], categorias[11]]
    productosParaCrear.append(producto18)
    categoriasProductos.append(categoriasSecundariasProducto18)

    imgProd19 = "productos/imgProd19.png"
    producto19 = {
        "nombre" : "Capsulas Descafeinado Suave",
        "descripcion" : "Aroma equilibrado sin cafeina.",
        "precio" : 5800,
        "img" : imgProd19,
        "stock" : 130,
        "categoriaPrincipal" : categorias[4]
    }
    categoriasSecundariasProducto19 = [categorias[2], categorias[7], categorias[5]]
    productosParaCrear.append(producto19)
    categoriasProductos.append(categoriasSecundariasProducto19)

    imgProd20 = "productos/GiftBox_Coffee.png"
    producto20 = {
        "nombre" : "Caja Regalo Coffee Lover",
        "descripcion" : "Presentación premium en caja rígida que incluye café de origen único, taza artesanal y tarjeta personalizada. Producto ideal para cumpleaños, empresas y detalles especiales.",
        "precio" : 22500,
        "img" : imgProd20,
        "stock" : 12,
        "categoriaPrincipal" : categorias[16]
    }
    categoriasSecundariasProducto20 = [categorias[15], categorias[17], categorias[7]]
    productosParaCrear.append(producto20)
    categoriasProductos.append(categoriasSecundariasProducto20)

    imgProd21 = "productos/galletas_para_cafe.png"
    producto21 = {
        "nombre" : "Galletas Crocantes ",
        "descripcion" : "Galletas artesanales infusionadas con café molido y chocolate bitter. Textura crujiente, dulzor moderado y aroma intenso ideal para acompañar un espresso.",
        "precio" : 3200,
        "img" : imgProd21,
        "stock" : 55,
        "categoriaPrincipal" : categorias[18]
    }
    categoriasSecundariasProducto21 = [categorias[17], categorias[16]]
    productosParaCrear.append(producto21)
    categoriasProductos.append(categoriasSecundariasProducto21)

    imgProd22 = "productos/imgProd22.png"
    producto22 = {
        "nombre" : "Blend Casa Versatil",
        "descripcion" : "Mezcla para espresso y filtrados.",
        "precio" : 9800,
        "img" : imgProd22,
        "stock" : 150,
        "categoriaPrincipal" : categorias[8]
    }
    categoriasSecundariasProducto22 = [categorias[10], categorias[0], categorias[11]]
    productosParaCrear.append(producto22)
    categoriasProductos.append(categoriasSecundariasProducto22)

    imgProd23 = "productos/bombones_rellenos.jpg"
    producto23 = {
        "nombre" : "Bombones Rellenos de Espresso",
        "descripcion" : "bombones de chocolate amargo con relleno cremoso elaborado con reducción de espresso. Sabor fuerte y final prolongado.",
        "precio" : 4700,
        "img" : imgProd23,
        "stock" : 55,
        "categoriaPrincipal" : categorias[17]}
    categoriasSecundariasProducto23 = [categorias[16], categorias[15]]
    productosParaCrear.append(producto23)
    categoriasProductos.append(categoriasSecundariasProducto23)

    imgProd24 = "productos/bruma_cafe.png"
    producto24 = {
        "nombre" : "Bruma Matinal Filtrado",
        "descripcion" : "mezcla diseñada para métodos de goteo y filtrado manual. Perfil limpio con notas a caramelo suave, frutos secos y un toque cítrico leve. Cuerpo medio y acidez equilibrada. Mantiene claridad y consistencia en V60, Chemex o cafetera eléctrica.",
        "precio" : 7900,
        "img" : imgProd24,
        "stock" : 44,
        "categoriaPrincipal" : categorias[11]
    }
    categoriasSecundariasProducto24 = [categorias[3], categorias[8]]
    productosParaCrear.append(producto24)
    categoriasProductos.append(categoriasSecundariasProducto24)

    imgProd25 = "productos/cafe_tuestemedio.jpg"
    producto25 = {
        "nombre" : "Maya Vinic Cafe tueste medio",
        "descripcion" : "Café redondo y estable, pensado para consumo diario. Notas a chocolate con leche, avellana tostada y un punto de panela. Cuerpo medio-alto y retrogusto dulce. Funciona bien en filtro, prensa y espresso suave.",
        "precio" : 8200,
        "img" : imgProd25,
        "stock" : 38,
        "categoriaPrincipal" : categorias[8]
    }
    categoriasSecundariasProducto25 = [categorias[0], categorias[10]]
    productosParaCrear.append(producto25)
    categoriasProductos.append(categoriasSecundariasProducto25)

    imgProd26 = "productos/cafe_tuesteclaro.png"
    producto26 = {
        "nombre" : "Claro Amanecer 1982",
        "descripcion" : "Grano de alta montaña con acidez brillante, notas frutales (frutos rojos, mandarina) y aroma floral. Ideal para resaltar complejidad y dulzor natural en métodos de filtrado. Final limpio y refrescante.",
        "precio" : 9000,
        "img" : imgProd26,
        "stock" : 27,
        "categoriaPrincipal" : categorias[7]
    }
    categoriasSecundariasProducto26 = [categorias[3], categorias[0]]
    productosParaCrear.append(producto26)
    categoriasProductos.append(categoriasSecundariasProducto26)

    imgProd27 = "productos/cafe_especial.png"
    producto27 = {
        "nombre" : "Edicion Dorada Microlote Especial Chiara",
        "descripcion" : "Microlote exclusivo de cosecha reducida, tostado en pequeños lotes para preservar aromas delicados. Perfil complejo con capas de jazmin, miel, te negro y chocolate oscuro. Alta claridad y textura sedosa. Solo disponible durante la temporada.",
        "precio" : 14900,
        "img" : imgProd27,
        "stock" : 9,
        "categoriaPrincipal" : categorias[5]
    }
    categoriasSecundariasProducto27 = [categorias[4], categorias[3], categorias[7]]
    productosParaCrear.append(producto27)
    categoriasProductos.append(categoriasSecundariasProducto27)

    contador = 0
    for producto in productosParaCrear:
        producto = Producto.objects.create(
            nombre=producto["nombre"],
            descripcion=producto["descripcion"],
            precio=producto["precio"],
            img=producto["img"],
            stock=producto["stock"],
            categoriaPrincipal=producto["categoriaPrincipal"]
        )
        producto.save()

        for categoria in categoriasProductos[contador]:
            categoriaProducto = CategoriaProducto.objects.create(producto=producto, categoria=categoria)
            categoriaProducto.save()

        contador = contador + 1


    # ==============================================================
    # Ventas y detalles de venta
    estadoVentas = ['Confirmada', 'Confirmada', 'Confirmada', 'Confirmada', 'Pendiente']

    usuarios = User.objects.all()

    metodo_pago = MetodoPago.objects.first()

    productos = Producto.objects.all()

    for index in range(50):

        usuario = random.choice(usuarios)
        estadoVenta = random.choice(estadoVentas)

        # la fecha se genera aleatoriamente dentro de los dias de este mes
        fecha_aleatoria = datetime.now().replace(day=random.randint(1, 17))

        venta = Venta.objects.create(
            totalVenta=0,
            telefonoContacto=usuario.telefono,
            usuario=usuario,
            metodoPago=metodo_pago,
            estadoVenta=estadoVenta,
            fechaHora=fecha_aleatoria,
            nombreDestinatario=usuario.nombre,
            apellidoDestinatario=usuario.apellido,
            region="Metropolitana",
            comuna="San Joaquin",
            direccionEnvio=usuario.direccion,
        )

        cantidad_productos = random.randint(1, 2)

        productos_seleccionados = random.sample(list(productos), cantidad_productos)


        totalVenta = 0

        for producto in productos_seleccionados:
            cantidad = random.randint(1, 3)

            detalleVenta = DetalleVenta.objects.create(
                cantidad=cantidad,
                producto=producto,
                venta=venta
            )
            totalVenta = totalVenta + (producto.precio * cantidad)

            detalleVenta.save()

        venta.totalVenta = totalVenta
        venta.save()

        totalVenta = 0




poblar_datos()
