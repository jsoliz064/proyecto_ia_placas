from django.http import HttpResponse
import cv2
from matplotlib import pyplot as plt
import numpy as np
import imutils
import easyocr
from PIL import Image

from django.http.response import JsonResponse 
import json
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .forms import DocumentoForm
from django.conf import settings
from django.conf.urls.static import static

class Upload(View):
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request,*args, **kwargs):
        return super().dispatch(request,*args,**kwargs)

    def index(self,request):
        img = cv2.imread('media/img/auto1.jpg')

        if img is None:
            return HttpResponse("none")
        return HttpResponse("index")

    def post(self,request):
        formulario = DocumentoForm(request.POST,files=request.FILES)
        if formulario.is_valid():
            formulario.save()
            print('guarded')
        else:
            print('failed')
            return HttpResponse("none")

        img = cv2.imread(settings.MEDIA_ROOT+"\img\placa.jpg")

        if img is None:
            print('imag not found')
            return HttpResponse("none")
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        bfilter = cv2.bilateralFilter(gray, 11, 17, 17) #Noise reduction
        edged = cv2.Canny(bfilter, 30, 200) #Edge detection

        keypoints = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = imutils.grab_contours(keypoints)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]

        location = None
        for contour in contours:
            approx = cv2.approxPolyDP(contour, 10, True)
            if len(approx) == 4:
                location = approx
                break

        text=""
        if location is not None:
            mask = np.zeros(gray.shape, np.uint8)
            new_image = cv2.drawContours(mask, [location], 0,255, -1)
            new_image = cv2.bitwise_and(img, img, mask=mask)

        #plt.imshow(cv2.cvtColor(new_image, cv2.COLOR_BGR2RGB))

            (x,y) = np.where(mask==255)
            (x1, y1) = (np.min(x), np.min(y))
            (x2, y2) = (np.max(x), np.max(y))
            cropped_image = gray[x1:x2+1, y1:y2+1]

        #plt.imshow(cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB))

            reader = easyocr.Reader(['en'])
            result = reader.readtext(cropped_image)
            for result in result:
                res=result[-2]
                if len(res)>=7:
                    text=res
            #text = result[2][-2]

        if text:
            return HttpResponse(text)
        else:
            return HttpResponse("none")

    
