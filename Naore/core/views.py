from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

from core.models import Product, Category, Vendor, CartOrder, CartOrderItems, ProductImages,ProductReview,wishlist, Address 


def index(request):
    # products = Product.objects.all().order_by("-id")
    # products = Product.objects.filter(featured=True).order_by("-id")
    products = Product.objects.filter(product_status="published", featured=True)
    categories = Category.objects.all()


    context = {
        "products":products,
        "categories":categories
    }
    return render(request, 'core/index.html', context)


def product_list_view(request):
    products = Product.objects.filter(product_status="published")


    context = {
        "products":products
    }
    return render(request, 'core/product-list.html', context)


# def category_list_view(request):
#     # categories = Category.objects.filter(product_status="published")
#     categories = Category.objects.all()


#     context = {
#         "categories":categories
#     }
#     return render(request, 'core/category-list.html', context)

def category_product_list_view(request, cid):
    category = Category.objects.get(cid=cid)
    products = Product.objects.filter(product_status="published", category=category)
    categories = Category.objects.all()
    

    
    context = {
        "category":category,
        "products":products,
        "categories":categories,

    }
    return render(request, "core/category-product-list.html", context)


def product_detail_view(request, pid):
    product = Product.objects.get(pid=pid)
    # product = get_object_or_404(Product, pid=pid)

    p_image = product.p_images.all()


    context = {
        "p": product,
        "p_image": p_image,

    }
    return render(request, 'core/product-detail.html', context)


# def search_view(request):
#     query = request.GET.get("q")

#     products = Product.objects.filter(title__icontains=query).order_by("-date")
#     context = {
#         "products": products,
#         "query": query,
#     }
#     return render(request, "core/search.html", context)


def search_view(request):
    query = request.GET.get("q", "").strip()  # Always returns a clean string

    products = Product.objects.filter(title__icontains=query).order_by("-date")
    categories = Category.objects.all()
    
    context = {
        "products": products,
        "query": query,
        "categories": categories,

    }
    return render(request, "core/search.html", context)
