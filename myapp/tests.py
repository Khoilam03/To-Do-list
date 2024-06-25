from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import TodoItem

class TodoAPITest(APITestCase):
    def setUp(self):
        # Setup method to create test data
        TodoItem.objects.create(title="Test Todo Item 1", completed=False)
        TodoItem.objects.create(title="Test Todo Item 2", completed=True)

    def test_get_todos(self):
        """
        Ensure we can retrieve a list of todos.
        """
        url = reverse('Todos')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Assumes you have a serializer that returns the entire queryset

    def test_create_todo(self):
        """
        Ensure we can create a new todo item.
        """
        url = reverse('Todos')
        data = {'title': 'New Todo', 'completed': False}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TodoItem.objects.count(), 3)  # Assuming the setUp created two, and we add one here

    def test_delete_todo(self):
        """
        Ensure we can delete a todo item.
        """
        todo = TodoItem.objects.first()  # Get the first todo added in setUp
        url = reverse('Todos') + str(todo.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TodoItem.objects.count(), 1)  # One should be left after delete

    def test_todo_json(self):
        """
        Test the JSON response of todos.
        """
        url = reverse('json')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))  # Assuming JSON returns a list
