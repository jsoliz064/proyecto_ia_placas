from django.urls import path
from .views import Upload
urlpatterns=[
    path('predecir',Upload.as_view(),name='predecir')
]

