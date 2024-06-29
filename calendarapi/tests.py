from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import TodoItem
from .serializers import TodoSerializer

class TodoItemAPITest(APITestCase):
    def setUp(self):
        # Set up test data for the TodoItem model
        self.todo1 = TodoItem.objects.create(title="Initial Todo 1", completed=False)
        self.todo2 = TodoItem.objects.create(title="Initial Todo 2", completed=True)
        self.valid_payload = {
            'title': 'Valid Todo',
            'completed': False
        }
        self.invalid_payload = {
            'title': '',
            'completed': False
        }
        
    def test_get_todos(self):
        """
        Ensure we can retrieve a list of todos.
        """
        url = reverse('todo-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_todo_valid(self):
        """
        Ensure we can create a new todo item with valid payload.
        """
        url = reverse('todo-list')
        response = self.client.post(url, data=self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TodoItem.objects.count(), 3)  # Including the setUp data

    def test_create_todo_invalid(self):
        """
        Ensure we cannot create a todo item with invalid payload.
        """
        url = reverse('todo-list')
        response = self.client.post(url, data=self.invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_todo(self):
        """
        Ensure we can delete a todo item.
        """
        url = reverse('todo-list')
        response = self.client.delete(url, data={'id': self.todo1.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TodoItem.objects.count(), 1)

    def test_update_todo_valid(self):
        """
        Ensure we can update a todo item with valid data.
        """
        url = reverse('todo-list')
        updated_payload = {'id': self.todo2.id, 'title': 'Updated Todo', 'completed': True}
        response = self.client.put(url, data=updated_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.todo2.refresh_from_db()
        self.assertEqual(self.todo2.title, 'Updated Todo')
        self.assertEqual(self.todo2.completed, True)

    def test_update_todo_invalid(self):
        """
        Ensure we cannot update a todo item with invalid data.
        """
        url = reverse('todo-list')
        invalid_payload = {'id': self.todo2.id, 'title': '', 'completed': True}
        response = self.client.put(url, data=invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
