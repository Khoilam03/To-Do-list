from django.db import models

# Create your models here.

class TodoItem(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title + ": " + self.printComplete()
    def printComplete(self):
        if self.completed:
            return "Completed"
        return "Not Completed"