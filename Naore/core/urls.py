from django.urls import path, include
from core.views import add_to_cart, category_product_list_view, delete_item_from_cart, index, product_list_view, product_detail_view,  search_view, cart_view, update_cart, checkout_view, payment_completed_view, payment_failed_view        

app_name = "core"

urlpatterns = [
    path("", index, name="index"),
    path("products", product_list_view, name="product-list"),
    path("product/<pid>/", product_detail_view, name="product-detail"),

    # path("category/", category_list_view, name="category-list"),
    path("category/<cid>/", category_product_list_view, name="category-product-list"),

    # search
    path("search/", search_view, name="search"),


    path("add-to-cart/", add_to_cart, name="add-to-cart"),

    path("cart/", cart_view, name="cart"),

    path("delete-from-cart/", delete_item_from_cart, name="delete-from-cart"),


    path("update-cart/", update_cart, name="update-cart"),


    path("checkout/", checkout_view, name="checkout"),

    path("paypal/", include('paypal.standard.ipn.urls')),
    

    path("paypal-completed/", payment_completed_view, name="paypal-completed"),
    path("paypal-failed/", payment_failed_view, name="paypal-failed"),

]