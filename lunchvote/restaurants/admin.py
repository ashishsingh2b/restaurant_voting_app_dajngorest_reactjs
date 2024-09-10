from django.contrib import admin
from .models import Restaurant, UserVote , VoteHistory

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('id','name',)
    search_fields = ('name',)

@admin.register(UserVote)
class UserVoteAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'restaurant', 'vote_type', 'date')
    list_filter = ('vote_type', 'date')
    search_fields = ('user__username', 'restaurant__name')

@admin.register(VoteHistory)
class VoteHistoryAdmin(admin.ModelAdmin):
    list_display = ('id','date', 'winner','vote_type')
    search_fields = ('winner__name',)
