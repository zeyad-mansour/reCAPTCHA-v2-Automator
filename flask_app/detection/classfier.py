import torch
import os

model = torch.hub.load('ultralytics/yolov5', 'custom', path='yolov5x.pt')

def captcha_classifier(class_type, image_path):#todo
    results = model(image_path)
    
    f = open("debug.txt", "w")
    f.write(f"{class_type}, {image_path}")
    f.close()
    return "this is temp"
