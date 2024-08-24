import requests
from django.http import JsonResponse
from django.views import View

class WeatherView(View):
    def get(self, request, *args, **kwargs):
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')
        city = request.GET.get('city')
        appid = '299b37daa69d866809ba3b3976229506'
        
        if lat and lon:
            url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={appid}'
        elif city:
            url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={appid}'
        else:
            return JsonResponse({'error': 'Invalid parameters'}, status=400)
        
        response = requests.get(url)
        return JsonResponse(response.json())

class ForecastView(View):
    def get(self, request, *args, **kwargs):
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')
        appid = '299b37daa69d866809ba3b3976229506'
        
        if lat and lon:
            url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&cnt=8&appid={appid}'
        else:
            return JsonResponse({'error': 'Invalid parameters'}, status=400)
        
        response = requests.get(url)
        return JsonResponse(response.json())