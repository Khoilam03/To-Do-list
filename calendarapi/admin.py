from django.contrib import admin
from .models import TaskSummary

class TaskSummaryAdmin(admin.ModelAdmin):
    list_display = ('date', 'completed', 'not_completed')
    search_fields = ('date',)

admin.site.register(TaskSummary, TaskSummaryAdmin)
