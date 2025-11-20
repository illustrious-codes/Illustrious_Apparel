from django.urls import path
from core.views import add_to_cart, category_product_list_view, index, product_list_view, product_detail_view,  search_view

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
    
]