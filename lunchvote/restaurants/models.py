from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def get_total_votes(self):
        """Calculate total votes for the restaurant."""
        vote_values = {'first': 1, 'second': 0.5, 'third': 0.25}
        total_votes = sum(vote_values.get(vote.vote_type, 0) for vote in self.votes.all())
        return total_votes
    
    def get_username(self):
        """Return the username of the user associated with this restaurant."""
        return self.user.username

    def __str__(self):
        return self.name

class UserVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=10)  # 'first', 'second', or 'third'
    date = models.DateField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'restaurant', 'vote_type', 'date')

class VoteHistory(models.Model):
    date = models.DateField()
    winner = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    vote_type = models.CharField(max_length=10, choices=[('first', 'First'), ('second', 'Second'), ('third', 'Third')])

    class Meta:
        ordering = ['-date']
