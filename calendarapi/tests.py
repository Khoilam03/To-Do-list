import datetime
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import TaskSummary
from .serializers import TaskSummarySerializer

class TaskSummaryTests(APITestCase):

    def setUp(self):
        self.task_summary_data = {
            'date': (datetime.datetime.now() - datetime.timedelta(days=1)).date(),
            'completed': 5,
            'not_completed': 3
        }
        self.task_summary = TaskSummary.objects.create(**self.task_summary_data)
        self.valid_payload = {
            'date': (datetime.datetime.now() - datetime.timedelta(days=2)).date(),
            'completed': 3,
            'not_completed': 1
        }
        self.invalid_payload = {
            'date': '',
            'completed': '',
            'not_completed': ''
        }

    def test_get_all_task_summaries(self):
        response = self.client.get(reverse('task-summary-list-create'))
        task_summaries = TaskSummary.objects.all()
        serializer = TaskSummarySerializer(task_summaries, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_valid_task_summary(self):
        response = self.client.post(
            reverse('task-summary-list-create'),
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_task_summary(self):
        response = self.client.post(
            reverse('task-summary-list-create'),
            data=self.invalid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_valid_single_task_summary(self):
        response = self.client.get(
            reverse('task-summary-detail', kwargs={'date': self.task_summary.date})
        )
        task_summary = TaskSummary.objects.get(date=self.task_summary.date)
        serializer = TaskSummarySerializer(task_summary)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_task_summary(self):
        response = self.client.get(
            reverse('task-summary-detail', kwargs={'date': '2023-01-01'})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_valid_update_task_summary(self):
        response = self.client.put(
            reverse('task-summary-detail', kwargs={'date': self.task_summary.date}),
            data={'date': self.task_summary.date, 'completed': 6, 'not_completed': 2},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_update_task_summary(self):
        response = self.client.put(
            reverse('task-summary-detail', kwargs={'date': self.task_summary.date}),
            data=self.invalid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_delete_task_summary(self):
        response = self.client.delete(
            reverse('task-summary-detail', kwargs={'date': self.task_summary.date})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_task_summary(self):
        response = self.client.delete(
            reverse('task-summary-detail', kwargs={'date': '2023-01-01'})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
