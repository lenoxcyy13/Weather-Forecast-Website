from django.urls import path
from .views import WeatherView, ForecastView

urlpatterns = [
    path('weather/', WeatherView.as_view(), name='weather'),
    path('forecast/', ForecastView.as_view(), name='get_forecast'),
]