from rest_framework import serializers
from .models import TaskSummary

class TaskSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSummary
        fields = ['date', 'completed', 'not_completed']
