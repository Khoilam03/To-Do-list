from django.urls import path
from . import views

urlpatterns = [
    path("home/", views.home, name="Home"),
    path("todos/", views.todos, name="Todos"),
    path("", views.todoList, name="Todo")
]