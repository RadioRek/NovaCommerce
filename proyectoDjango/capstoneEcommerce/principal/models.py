from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser, PermissionsMixin


class CustomUserManager(UserManager):
    def _create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("Debe ingresar un nombre de usuario.")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser debe tener is_superuser=True.")

        return self._create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    nombre = models.CharField(max_length=50, blank=True, default="")
    apellido = models.CharField(max_length=50, blank=True, default="")
    direccion = models.CharField(max_length=255, blank=True, default="")
    telefono = models.BigIntegerField(blank=True, null=True)
    email = models.EmailField(max_length=254, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    tipoUsuario = models.ForeignKey("TipoUsuario", on_delete=models.CASCADE, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return str(self.id) + " - " + self.username + " - " + self.nombre + " " + self.apellido


class TipoUsuario(models.Model):
    nombre = models.CharField(max_length=50, blank=True, default="")

    class Meta:
        verbose_name = "Tipo de Usuario"
        verbose_name_plural = "Tipos de Usuarios"

    def __str__(self):
        return self.nombre


class MetodoPago(models.Model):
    nombre = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Método de Pago"
        verbose_name_plural = "Métodos de Pago"

    def __str__(self):
        return self.nombre


class Venta(models.Model):
    totalVenta = models.IntegerField()
    fechaHora = models.DateTimeField()
    usuario = models.ForeignKey('User', on_delete=models.CASCADE)
    metodoPago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Venta"
        verbose_name_plural = "Ventas"

    def __str__(self):
        return str(self.id) + " - " + self.totalVenta + " - " + str(self.fechaHora)


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, default="")
    precio = models.IntegerField()
    img = models.BinaryField(blank=True, null=True)
    stock = models.IntegerField()

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return str(self.id) + " - " + self.nombre


class Categoria(models.Model):
    nombre = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.nombre


class DetalleVenta(models.Model):
    cantidad = models.IntegerField()
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    venta = models.ForeignKey('Venta', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Detalle de Venta"
        verbose_name_plural = "Detalles de Venta"

    def __str__(self):
        return f"Detalle {self.id} - Venta {self.venta.id} - Producto {self.producto.nombre}"


class CategoriaProducto(models.Model):
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Categoría de Producto"
        verbose_name_plural = "Categorías de Productos"

    def __str__(self):
        return f"{self.producto.nombre} - {self.categoria.nombre}"