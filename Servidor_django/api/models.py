from django.db import models
import os
from django.conf import settings
import os.path
from os import path

class Documento(models.Model):

    def get_file_path(instance, filename):
        if path.exists(settings.MEDIA_ROOT+"\img\placa.jpg"): 
            os.remove(os.path.join(settings.MEDIA_ROOT+"\img\placa.jpg"))

        filename = "%s.%s" % ("placa", "jpg") 
        return os.path.join('img/', filename)

    documento = models.FileField(upload_to =get_file_path)

    class Meta:
        managed = True
        db_table='documetos'
        

    
