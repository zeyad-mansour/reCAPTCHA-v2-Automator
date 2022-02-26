import torch
import os
import cv2

model = torch.hub.load('ultralytics/yolov5', 'custom', path='yolov5x.pt')

def captcha_classifier(class_type, image_path):#todo
    im = cv2.imread(image_path)
    h, w, c = im.shape

    if h == 300 and w == 300:
        three_by_three = True #9 by 100 by 100
    elif h == 300 and w == 300:
        four_by_four = True
    else:
        return "invalid dimensions"
    
    bitstring = ""
    results = model(image_path)
    for *box, conf, cls in results.xyxy[0]: 
        x1y1 = [int(x.item()) for x in box[:2]]
        x2y2 = [int(x.item()) for x in box[2:]]
        x1, y1, x2, y2, conf = *x1y1, *x2y2, conf.item()

        #todo logic that returns bitstring


    return bitstring
