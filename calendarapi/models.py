from django.db import models

class TaskSummary(models.Model):
    date = models.DateField(unique=True)
    completed = models.IntegerField()
    not_completed = models.IntegerField()

    def __str__(self):
        return f"{self.date}: {self.completed} completed, {self.not_completed} not completed"
