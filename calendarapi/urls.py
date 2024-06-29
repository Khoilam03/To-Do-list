from django.urls import path
from .views import TaskSummaryListCreate, TaskSummaryDetail

urlpatterns = [
    path('tasks/', TaskSummaryListCreate.as_view(), name='task-summary-list-create'),
    path('tasks/<str:date>/', TaskSummaryDetail.as_view(), name='task-summary-detail'),
]
