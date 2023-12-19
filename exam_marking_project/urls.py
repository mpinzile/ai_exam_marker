# exam_marking_project/urls.py

from django.contrib import admin
from django.urls import path, include
from marking_system.views import welcome_page

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', welcome_page, name='welcome_page'),  # Point the root URL to welcome_page
    path('marking/', include('marking_system.urls')),
    # Add more project-level URL patterns as needed
]
handler404 = 'marking_system.views.custom_404'