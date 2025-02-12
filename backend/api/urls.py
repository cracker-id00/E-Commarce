from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('current_user/', current_user, name='current_user'),
    path('profile/', profile, name='profile'),
    path('cart/', CartView.as_view(), name='cart'),
    path('addresses/', addresses, name='addresses'),
    path('orders/', orders, name='order-list'),
    path('orders/create/', create_order, name='create_order'),
    path('orders/<int:order_id>/', update_order, name='update_order'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)