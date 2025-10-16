from django.contrib import admin
from django.urls import path, include


# temporal, en produccion se cambia por nginx (el + despues de urlpatterns tambien se quita)
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('principal.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
