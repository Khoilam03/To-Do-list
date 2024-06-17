from django.shortcuts import render, HttpResponse
from .models import TodoItem
from django.http import JsonResponse
from .serializers import TodoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# Create your views here.
def home(request):
    return render(request, "home.html")
def todos(request):
    items = TodoItem.objects.all()
    return render(request, "todo.html", {"todos": items})
@api_view(['GET', 'POST'])
def todoList(request):
    if request.method == "GET":
        items = TodoItem.objects.all()
        serializer = TodoSerializer(items, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)