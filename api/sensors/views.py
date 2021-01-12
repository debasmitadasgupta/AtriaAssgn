from django.db.models import Min, Max, Avg
from rest_framework import viewsets,generics,views
from .serializers import SensorDataSerializer
from .models import SensorData
from django_filters.rest_framework import DjangoFilterBackend
from .filters import SensorDataFilter
from rest_framework.response import Response


# Create your views here.

class SensorDataViewSet(viewsets.ModelViewSet):
    serializer_class = SensorDataSerializer
    queryset = SensorData.objects.all()
    filterset_class = SensorDataFilter


class SensorValueSet(viewsets.ModelViewSet):
    serializer_class = SensorDataSerializer
    queryset = SensorData.objects.all()
    filterset_class = SensorDataFilter

    def list(self, request, *args, **kwargs):
        qs=self.filter_queryset(self.get_queryset())
        values = {}
        values['min'] = qs.aggregate(Min('reading'))
        values['max'] = qs.aggregate(Max('reading'))
        values['mean'] = round(qs.aggregate(Avg('reading')),2)
        return Response(values)


