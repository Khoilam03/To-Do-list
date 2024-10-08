import io
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
def jsontodos(request):
    if request.method == 'GET':
        items = TodoItem.objects.all().values()
        return JsonResponse(list(items), safe=False) 
@api_view(['DELETE'])
def clear(request):
    deleted, _ = TodoItem.objects.all().delete()
    return Response({"deleted": deleted}, status=status.HTTP_204_NO_CONTENT)
@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def todolist(request):
    if request.method == "GET":
        items = TodoItem.objects.all()
        serializer = TodoSerializer(items, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        if request.data:
            serializer = TodoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response("Empty data provided", status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        item_id = request.data.get('id')
        item = TodoItem.objects.get(id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    if request.method == "PUT":
        item_id = request.data.get('id')
        item = TodoItem.objects.get(id=item_id)
        serializer = TodoSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
