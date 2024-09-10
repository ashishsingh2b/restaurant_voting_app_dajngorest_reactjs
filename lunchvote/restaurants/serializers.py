from rest_framework import serializers
from .models import Restaurant, UserVote,VoteHistory
from django.utils import timezone
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  


class RestaurantSerializer(serializers.ModelSerializer):
    total_votes = serializers.SerializerMethodField()
    user = UserSerializer()  # 

    class Meta:
        model = Restaurant
        fields = ['id', 'name','user', 'total_votes']

    def get_total_votes(self, obj):
        today = timezone.now().date()
        votes = obj.votes.filter(date=today)
        vote_values = {'first': 1, 'second': 0.5, 'third': 0.25}
        return sum(vote_values.get(vote.vote_type, 0) for vote in votes)
    
    def update(self, instance, validated_data):
        instance.name=validated_data.get("name" or instance.name)
        instance.save()
        return instance
 
class VoteHistorySerializer(serializers.ModelSerializer):
    winner_name = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    distinct_user_votes = serializers.SerializerMethodField()

    class Meta:
        model = VoteHistory
        fields = ['date', 'winner', 'winner_name', 'total_votes', 'distinct_user_votes']

    def get_winner_name(self, obj):
        return obj.winner.name if obj.winner else 'No name available'

    def get_total_votes(self, obj):
        # Calculate the total votes for the winner on the date specified in the VoteHistory entry
        votes = UserVote.objects.filter(
            restaurant=obj.winner,
            date=obj.date
        )
        vote_values = {'first': 1, 'second': 0.5, 'third': 0.25}
        total_votes = sum(vote_values.get(vote.vote_type, 0) for vote in votes)
        return total_votes

    def get_distinct_user_votes(self, obj):
        # Calculate the number of distinct users who voted for the winner on the date
        distinct_users = UserVote.objects.filter(
            restaurant=obj.winner,
            date=obj.date
        ).values('user').distinct().count()
        return distinct_users