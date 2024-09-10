from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Max, Sum, Case, When, Value, FloatField, Subquery, OuterRef, Count
from .models import Restaurant, UserVote, VoteHistory
from .serializers import RestaurantSerializer, VoteHistorySerializer, UserSerializer
from django.shortcuts import get_object_or_404


MAX_VOTES_PER_DAY = 3  # Configurable

class RegisterUser(APIView):
    permission_classes = [AllowAny]
    #new

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class LoginUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class RestaurantViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """List all restaurants with user-specific vote data."""
        user = request.user
        queryset = Restaurant.objects.all()
        serializer = RestaurantSerializer(queryset, many=True)

        # Get user votes for today
        today = timezone.now().date()
        user_votes = UserVote.objects.filter(user=user, date=today).values('restaurant_id', 'vote_type')
        user_votes_dict = {vote['restaurant_id']: vote['vote_type'] for vote in user_votes}

        data = {
            'restaurants': [
                {**rest, 'user_vote': user_votes_dict.get(rest['id'])}
                for rest in serializer.data
            ]
        }
        return Response(data)

    @action(detail=False, methods=['post'])
    def add_restaurant(self, request):
        """Add a new restaurant."""
        name = request.data.get('name')
        if not name:
            return Response({'error': 'Restaurant name is required'}, status=status.HTTP_400_BAD_REQUEST)

        restaurant = Restaurant.objects.create(name=name, user=request.user)
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def retrieve_restaurant(self, request, pk=None):
        """Retrieve a single restaurant."""
        restaurant = get_object_or_404(Restaurant, pk=pk)
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)

    @action(detail=True, methods=['put'])
    def update_restaurant(self, request, pk=None):
        """Update an existing restaurant."""
        restaurant = get_object_or_404(Restaurant, pk=pk)

        if request.user != restaurant.user and not request.user.is_superuser:
            return Response({'error': 'You do not have permission to update this restaurant.'}, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name')
        
        if not name:
            return Response({'error': 'Restaurant name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['delete'])
    def delete_restaurant(self, request, pk=None):
        """Delete a restaurant."""
        restaurant = get_object_or_404(Restaurant, pk=pk)

        if request.user != restaurant.user and not request.user.is_superuser:
            return Response('You do not have permission to delete this restaurant.')

        restaurant.delete()
        return Response({'message': 'Restaurant deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def vote(self, request):
        """Vote for a restaurant."""
        user = request.user
        restaurant_id = request.data.get('restaurantId')
        vote_type = request.data.get('voteType')

        #Validate Vote Type        
        if vote_type not in ['first', 'second', 'third']:
            return Response({'error': 'Invalid vote type'}, status=status.HTTP_400_BAD_REQUEST)

        restaurant = Restaurant.objects.filter(id=restaurant_id).first()
        if not restaurant:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        #Check Daily Vote Limit or Reset The Vote Daily
        today = timezone.now().date()
        daily_votes = UserVote.objects.filter(user=user, date=today)

        if daily_votes.count() >= MAX_VOTES_PER_DAY:
            return Response({'error': 'Maximum number of votes per day exceeded'}, status=status.HTTP_403_FORBIDDEN)
        
        #Record the User Vote
        UserVote.objects.create(user=user, restaurant=restaurant, vote_type=vote_type, date=today)
        
        #Update Total Votes for All Restaurants
        vote_values = {'first': 1, 'second': 0.5, 'third': 0.25}
        restaurants = Restaurant.objects.all()
        for r in restaurants:
            votes = UserVote.objects.filter(restaurant=r, date=today)
            r.total_votes = sum(vote_values[v.vote_type] for v in votes)
            r.save()

        #7. Determine the Winner
        sorted_restaurants = sorted(restaurants, key=lambda r: r.total_votes, reverse=True)
        winner = sorted_restaurants[0] if sorted_restaurants else None
        if winner:
            VoteHistory.objects.create(date=today, winner=winner, vote_type=vote_type)

        #Daily Vote Limit
        votes_left = MAX_VOTES_PER_DAY - daily_votes.count()
        voted_restaurants = list(daily_votes.values_list('restaurant_id', flat=True))

        return Response({
            'restaurants': RestaurantSerializer(restaurants, many=True).data,
            'votesLeft': votes_left,
            'votedRestaurants': voted_restaurants
        })

class VoteHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VoteHistory.objects.all()
    serializer_class = VoteHistorySerializer

    @action(detail=False, methods=['get'])
    def todays_winner(self, request):
        today = timezone.now().date()

        votes_subquery = UserVote.objects.filter(
            restaurant=OuterRef('winner'),
            date=today
        ).values('restaurant').annotate(
            total_votes=Sum(
                Case(
                    When(vote_type='first', then=Value(1)),
                    When(vote_type='second', then=Value(0.5)),
                    When(vote_type='third', then=Value(0.25)),
                    default=Value(0),
                    output_field=FloatField()
                )
            ),
            distinct_user_votes=Count('user', distinct=True)
        ).values('total_votes', 'distinct_user_votes')

        todays_winners = VoteHistory.objects.filter(date=today).annotate(
            total_votes=Subquery(votes_subquery.values('total_votes')),
            distinct_user_votes=Subquery(votes_subquery.values('distinct_user_votes'))
        ).order_by('-total_votes', '-distinct_user_votes')

        if todays_winners.exists():
            latest_winner = todays_winners.first()
            serializer = VoteHistorySerializer(latest_winner)
            return Response(serializer.data)
        else:
            return Response({'error': 'No winner for today yet'}, status=404)

    @action(detail=False, methods=['get'])
    def historical_winners(self, request):
        latest_winners = VoteHistory.objects.values('date').annotate(latest_id=Max('id')).values_list('latest_id', flat=True)
        historical_winners = VoteHistory.objects.filter(id__in=latest_winners).order_by('date')

        serializer = VoteHistorySerializer(historical_winners, many=True)
        return Response(serializer.data)
