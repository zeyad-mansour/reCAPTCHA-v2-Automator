import torch

model = torch.hub.load('ultralytics/yolov5', 'custom', path='yolov5x.pt')

img = 'test_images/bicycles.jfif'
results = model(img)

results.pandas().xyxy[0]
results.print()

def captcha_classifier(class_type, image_path):
    pass #todo
