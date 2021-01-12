import django_filters
from .models import SensorData

class SensorDataFilter(django_filters.FilterSet):
    class Meta:
        model = SensorData
        fields ={
            'timestamp' : ['gte','lte']
        }