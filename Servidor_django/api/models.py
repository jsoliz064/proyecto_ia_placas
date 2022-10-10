from django.db import models

class Documento(models.Model):
    documento = models.FileField(upload_to='media/')
