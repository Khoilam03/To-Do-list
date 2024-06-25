from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import TodoItem  # Importing the correct model

class TodoItemAPITest(APITestCase):
    def setUp(self):
        # Setting up initial data
        self.todo1 = TodoItem.objects.create(title="Initial Todo 1", completed=False)
        self.todo2 = TodoItem.objects.create(title="Initial Todo 2", completed=True)
    
    def test_get_todos(self):
        """
        Ensure we can retrieve a list of todos from /api.
        """
        url = reverse('Todo')  # Assuming 'Todo' is the name of the URL pattern for listing todos
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Checks if the count of todos is correct

    def test_create_todo(self):
        """
        Ensure we can create a new todo item via /api.
        """
        url = reverse('Todo')
        data = {'title': 'New Todo', 'completed': False}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TodoItem.objects.count(), 3)  # One new todo added

    def test_update_todo(self):
        """
        Ensure we can update an existing todo item.
        """
        url = reverse('api-detail', args=[self.todo1.id])  # Assuming 'api-detail' handles individual todo operations
        data = {'title': 'Updated Todo 1', 'completed': True}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.todo1.refresh_from_db()
        self.assertEqual(self.todo1.title, 'Updated Todo 1')
        self.assertEqual(self.todo1.completed, True)

    def test_delete_todo(self):
        """
        Ensure we can delete a todo item.
        """
        url = reverse('api-detail', args=[self.todo2.id])  # Using 'api-detail' for delete operation
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TodoItem.objects.count(), 1)  # One less after deletion

    def test_todo_not_found(self):
        """
        Ensure that a 404 is returned if the todo is not found.
        """
        url = reverse('api-detail', args=[12345])  # Assuming an ID that does not exist
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
