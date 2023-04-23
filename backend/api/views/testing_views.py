from django.http import JsonResponse

def hello(request):
    print("Hello world")
    return JsonResponse({'message': 'Hello World!'})