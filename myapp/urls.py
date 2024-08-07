from django.urls import path
from . import views

urlpatterns = [
    path("homes/", views.home, name="Home"),
    path("todos/", views.todos, name="Todos"),
    path("", views.todolist, name="Todo"),
    path("json/", views.jsontodos, name="json"),
    path('clear/', views.clear, name='clear_todos'),
]