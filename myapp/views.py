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
def jsonTodos(request):
    items = TodoItem.objects.all().values()
    return JsonResponse(list(items), safe=False) 
@api_view(['DELETE'])
def clear(request):
    deleted, _ = TodoItem.objects.all().delete()
    return Response({"deleted": deleted}, status=status.HTTP_204_NO_CONTENT)
@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def todoList(request):
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
        else: return Response("Empty data provided", status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        item_id = request.data.get('id')
        if not item_id:
            return Response({"error": "ID is required to delete an item"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            item = TodoItem.objects.get(id=item_id)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TodoItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        item_id = request.data.get('id')
        if not item_id:
            return Response({"error": "ID is required to update an item"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            item = TodoItem.objects.get(id=item_id)
            serializer = TodoSerializer(item, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TodoItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
