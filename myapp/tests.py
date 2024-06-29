from django.test import TestCase, Client
from django.urls import reverse
from .models import TodoItem
from rest_framework import status
import json

class JsonTodosViewTest(TestCase):
    
    def setUp(self):
        self.client = Client()
        # Create test TodoItem objects
        TodoItem.objects.create(title='Test Todo 1', completed=False)
        TodoItem.objects.create(title='Test Todo 2', completed=True)

    def test_json_todos(self):
        # Issue a GET request to the jsonTodos endpoint
        response = self.client.get(reverse('json'))
        
        # Assert that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Decode the JSON response content
        data = json.loads(response.content)
        
        # Assert that the returned data matches the expected structure and content
        self.assertEqual(len(data), 2)  # Assuming there are 2 TodoItem objects in the database
        
        # Assert specific fields of the first TodoItem
        self.assertEqual(data[0]['title'], 'Test Todo 1')
        self.assertEqual(data[0]['completed'], False)
        
        # Assert specific fields of the second TodoItem
        self.assertEqual(data[1]['title'], 'Test Todo 2')
        self.assertEqual(data[1]['completed'], True)
        
        # You can add more assertions based on your serializer and data structure
    def test_clear_view(self):
        # Issue a DELETE request to the clear endpoint
        response = self.client.delete(reverse('clear_todos'))
        
        # Assert that the response status code is 204 NO CONTENT
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify that all TodoItem objects are deleted from the database
        todos = TodoItem.objects.all()
        self.assertEqual(len(todos), 0)

    def tearDown(self):
        # Clean up any test data if needed
        TodoItem.objects.all().delete()