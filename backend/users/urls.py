from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView,
    GetAllUsersView, GetUserByIdView, UpdateUserByIdView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/', GetAllUsersView.as_view(), name='get_all_users'),
    path('users/<int:user_id>/', GetUserByIdView.as_view(), name='get_user_by_id'),
    path('users/<int:user_id>/update/', UpdateUserByIdView.as_view(), name='update_user_by_id'),
]