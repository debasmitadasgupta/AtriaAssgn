from django.db import models


# Create your models here.
class SensorData(models.Model):
    reading = models.DecimalField(decimal_places=2,max_digits=20)
    timestamp = models.FloatField(max_length=10)
    sensorType = models.CharField(max_length=50)
