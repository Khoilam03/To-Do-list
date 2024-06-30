import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TaskSummary
from .serializers import TaskSummarySerializer

class TaskSummaryListCreate(APIView):
    def get(self, request):
        summaries = TaskSummary.objects.all()
        serializer = TaskSummarySerializer(summaries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSummarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskSummaryDetail(APIView):
    def get_object(self, date):
        try:
            return TaskSummary.objects.get(date=date)
        except TaskSummary.DoesNotExist:
            return None

    def get(self, request, date):
        summary = self.get_object(date)
        if summary:
            serializer = TaskSummarySerializer(summary)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, date):
        summary = self.get_object(date)
        if summary is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSummarySerializer(summary, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, date):
        summary = self.get_object(date)
        if summary is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        summary.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
