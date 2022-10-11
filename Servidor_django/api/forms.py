from django import forms
from django.forms import ModelForm
from .models import Documento

class DocumentoForm(ModelForm):
    class Meta:
        model=Documento
        fields = ['documento']