from django.urls import path
from .views import RestaurantViewSet, VoteHistoryViewSet, RegisterUser, LoginUser, UserProfile

urlpatterns = [

    #user urls
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('login/', LoginUser.as_view(), name='login_user'),
    path('profile/', UserProfile.as_view(), name='user_profile'),
    
    # Restaurant-related URLs
    path('restaurants/', RestaurantViewSet.as_view({'get': 'list'}), name='restaurant-list'),
    path('restaurants/add_restaurant/', RestaurantViewSet.as_view({'post': 'add_restaurant'}), name='restaurant-add'),
    path('restaurants/retrieve_restaurant/<int:pk>/', RestaurantViewSet.as_view({'get': 'retrieve_restaurant'}), name='retrieve_restaurant'),
    path('restaurants/<int:pk>/edit-restaurant/', RestaurantViewSet.as_view({'put': 'update_restaurant'}), name='update_restaurant'),
    path('restaurants/<int:pk>/delete-restaurant/', RestaurantViewSet.as_view({'delete': 'delete_restaurant'}), name='delete_restaurant'),
    path('restaurants/vote/', RestaurantViewSet.as_view({'post': 'vote'}), name='restaurant-vote'),
   

    # VoteHistory-related URLs
    path('history/todays_winner/', VoteHistoryViewSet.as_view({'get': 'todays_winner'}), name='todays_winner'),
    path('history/historical_winners/', VoteHistoryViewSet.as_view({'get': 'historical_winners'}), name='historical_winners'),
        

]
