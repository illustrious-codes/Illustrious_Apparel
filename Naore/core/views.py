from email import message
from math import log
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.template.loader import render_to_string

from core.models import Product, Category, Vendor, CartOrder, CartOrderItems, ProductImages,ProductReview,wishlist, Address 

from django.urls import reverse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from paypal.standard.forms import PayPalPaymentsForm

from django.contrib.auth.decorators import login_required

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


# def add_to_cart(request):
#     cart_product = {}

#     cart_product[str(request.GET["id"])] = {
#         'title': request.GET['title'],
#         'qty': request.GET['qty'],
#         'price': request.GET['price'],
#     }

#     if 'cart_data_obj' is request.session:
#         if str(request.GET['id']) in request.session["cart_data_obj"]:
#             cart_data = request.session['cart_data_obj']
#             cart_data[str(request.GET['id'])]['qty'] = int(cart_product[str(request.GET['id'])]['qty'])
#             cart_data.update(cart_data)
#             request.session['cart_data_obj'] = cart_data
#         else:
#             cart_data = request.session['cart_data_obj']
#             cart_data.update(cart_product)
#             request.session['cart_data_obj'] = cart_data
#     else:
#         request.session['cart_data_obj'] = cart_product
#     return JsonResponse({"data": request.session["cart_data_obj"], 'totalcartitems': len(request.session["cart_data_obj"])})



# def add_to_cart(request):
#     product_id = str(request.GET["id"])
#     qty = int(request.GET['qty'])
    
#     # Prepare current product
#     cart_product = {
#         product_id: {
#             'pid': product_id,
#             'title': request.GET['title'],
#             'qty': qty,
#             'price': request.GET['price'],
#         }
#     }

#     # If cart exists
#     if 'cart_data_obj' in request.session:
#         cart_data = request.session['cart_data_obj']

#         # If product already in cart → add quantity
#         if product_id in cart_data:
#             cart_data[product_id]['qty'] += qty
#         else:
#             # Add new product
#             cart_data.update(cart_product)

#         request.session['cart_data_obj'] = cart_data

#     # If cart does not exist → create
#     else:
#         request.session['cart_data_obj'] = cart_product

#     return JsonResponse({
#         "data": request.session["cart_data_obj"],
#         "totalcartitems": len(request.session["cart_data_obj"])
#     })


def add_to_cart(request):
    product_id = str(request.GET["id"])      # numeric ID (optional)
    product_pid = request.GET["pid"]         # real PID
    qty = int(request.GET['qty'])
    old_price = request.GET.get('old_price', '')


    cart_product = {
        product_id: {                        # use PID as the cart key
            'pid': product_pid,               # use real PID
            'title': request.GET['title'],
            'qty': qty,
            'price': request.GET['price'],
            'image': request.GET.get('image', ''),
            'old_price': old_price,
        }
    }

    # If cart exists
    if 'cart_data_obj' in request.session:
        cart_data = request.session['cart_data_obj']

        if product_pid in cart_data:
            cart_data[product_pid]['qty'] += qty
        else:
            cart_data.update(cart_product)

        request.session['cart_data_obj'] = cart_data

    else:
        request.session['cart_data_obj'] = cart_product

    return JsonResponse({
        "data": request.session["cart_data_obj"],
        "totalcartitems": len(request.session["cart_data_obj"])
    })



# def cart_view(request):
#     cart_total_amount = 0
#     if 'cart_data_obj' in request.session:
#         for p_id, item in request.session['cart_data_obj'].items():
#             price = item["price"].replace("#", "")
#             cart_total_amount += int(item['qty']) * float(item[price])
#         return render(request, "core/cart.html", {
#         "cart_data": request.session["cart_data_obj"],
#         "totalcartitems": len(request.session["cart_data_obj"]), "cart_total_amount": cart_total_amount
#     })
#     else:
#         message.warning(request, "Your cart is empty")
#         return redirect("core.index")
#         return render(request, "core/cart.html", {
#         "cart_data": "",
#         "totalcartitems": len(request.session["cart_data_obj"]), "cart_total_amount": cart_total_amount
#     })



# def cart_view(request):
#     cart_total_amount = 0
    
#     if 'cart_data_obj' in request.session:

#         for p_id, item in request.session['cart_data_obj'].items():
#             price = item["price"].replace("#", "").strip()
#             cart_total_amount += int(item['qty']) * float(price)



#         return render(request, "core/cart.html", {
#             "cart_data": request.session["cart_data_obj"],
#             "totalcartitems": len(request.session["cart_data_obj"]),
#             "cart_total_amount": cart_total_amount
            
#         })
    
#     else:
#         messages.warning(request, "Your cart is empty")
#         return redirect("core:index")


def cart_view(request):
    cart_total_amount = 0
    
    if 'cart_data_obj' in request.session:

        cart_data = request.session['cart_data_obj']

        for p_id, item in cart_data.items():
            price = float(item["price"].replace("#", "").strip())
            qty = int(item['qty'])
            
            item_total = price * qty    # <-- calculate per item subtotal
            item["item_total"] = round(item_total, 2)  # <-- store it

            cart_total_amount += item_total

        # save updated cart data back to session
        request.session['cart_data_obj'] = cart_data

        return render(request, "core/cart.html", {
            "cart_data": cart_data,
            "totalcartitems": len(cart_data),
            "cart_total_amount": round(cart_total_amount, 2)
        })

    else:
        messages.warning(request, "Your cart is empty")
        return redirect("core:index")


# def delete_item_from_cart(request):
#     product_id = str(request.GET('id'))
#     if 'cart_data_obj' in request.session:
#         if product_id in request.session["cart_data_obj"]:
#             cart_data = request.session["cart_data_obj"]
#             del request.session["cart_data_obj"][product_id]
#             request.session["cart_data_obj"] = cart_data



#     cart_total_amount = 0
    
#     if 'cart_data_obj' in request.session:

#         cart_data = request.session['cart_data_obj']

#         for p_id, item in cart_data.items():
#             price = float(item["price"].replace("#", "").strip())
#             qty = int(item['qty'])
            
#             item_total = price * qty    # <-- calculate per item subtotal
#             item["item_total"] = round(item_total, 2)  # <-- store it

#             cart_total_amount += item_total

#     context = render_to_string("core/async/cart-list.html", "cart_data": request.session["cart_data"], "totalcartitems": len(request.session["cart_data_obj"]), "cart_total_amount": round(cart_total_amount, 2))
#     return JsonResponse({"data": context, "totalcartitems": len(request.session["cart_data_obj"]) })
    





# def delete_item_from_cart(request):
#     product_id = request.GET.get("id")   # Corrected

#     # Delete item from session cart
#     if 'cart_data_obj' in request.session:
#         cart_data = request.session["cart_data_obj"]
#         if product_id in cart_data:
#             del cart_data[product_id]
#             request.session["cart_data_obj"] = cart_data

#     # Recalculate totals
#     cart_total_amount = 0
#     cart_data = request.session.get("cart_data_obj", {})

#     for p_id, item in cart_data.items():
#         price = float(item["price"].replace("#", "").strip())
#         qty = int(item["qty"])
#         item_total = price * qty
#         item["item_total"] = round(item_total, 2)
#         cart_total_amount += item_total

#     # Render updated cart list
#     context_html = render_to_string(
#         "core/async/cart-list.html",
#         {
#             "cart_data": cart_data,
#             "totalcartitems": len(cart_data),
#             "cart_total_amount": round(cart_total_amount, 2),
#         },
#         request=request
#     )

#     return JsonResponse({
#         "data": context_html,
#         "totalcartitems": len(cart_data)
#     })



def delete_item_from_cart(request):
    product_id = request.GET.get("id")   # Get ID safely

    # Delete item from cart session
    if "cart_data_obj" in request.session:
        cart_data = request.session["cart_data_obj"]

        if product_id in cart_data:
            del cart_data[product_id]
            request.session["cart_data_obj"] = cart_data  # Save updated

    # Recalculate totals
    cart_total_amount = 0
    cart_data = request.session.get("cart_data_obj", {})

    for p_id, item in cart_data.items():
        price = float(item["price"].replace("#", "").strip())
        qty = int(item["qty"])

        item_total = price * qty
        item["item_total"] = round(item_total, 2)  # Add updated total

        cart_total_amount += item_total

    # Render updated cart list
    context_html = render_to_string(
        "core/async/cart-list.html",
        {
            "cart_data": cart_data,
            "totalcartitems": len(cart_data),
            "cart_total_amount": round(cart_total_amount, 2),
        },
        request=request
    )

    return JsonResponse({
        "data": context_html,
        "totalcartitems": len(cart_data)
    })



# def update_cart(request):
#     product_id = request.GET.get("id")
#     product_qty = request.GET.get("qty")  

    
#     # Update item in cart
#     if "cart_data_obj" in request.session:
#         cart_data = request.session["cart_data_obj"]

#         if product_id in cart_data:
#             cart_data[product_id]['qty'] = product_qty   # FIXED
#             request.session["cart_data_obj"] = cart_data

#     # Recalculate totals
#     cart_total_amount = 0
#     cart_data = request.session.get("cart_data_obj", {})

#     for p_id, item in cart_data.items():
#         price = float(item["price"].replace("#", "").strip())
#         qty = int(item['qty'])

#         item_total = price * qty
#         item["item_total"] = round(item_total, 2)
#         cart_total_amount += item_total

#     # Render updated cart
#     context_html = render_to_string(
#         "core/async/cart-list.html",
#         {
#             "cart_data": cart_data,
#             "totalcartitems": len(cart_data),
#             "cart_total_amount": round(cart_total_amount, 2),
#         },
#         request=request
#     )

#     return JsonResponse({
#         "data": context_html,
#         "totalcartitems": len(cart_data)
#     })




def update_cart(request):
    product_id = request.GET.get("id")
    product_qty = request.GET.get("qty")

    # Force valid qty
    if not product_qty or not str(product_qty).isdigit():
        product_qty = "1"

    # Update item in cart
    if "cart_data_obj" in request.session:
        cart_data = request.session["cart_data_obj"]

        if product_id in cart_data:
            cart_data[product_id]["qty"] = product_qty
            request.session["cart_data_obj"] = cart_data

    # Recalculate totals
    cart_total_amount = 0
    cart_data = request.session.get("cart_data_obj", {})

    for p_id, item in cart_data.items():
        price = float(item["price"].replace("#", "").replace(",", "").strip())

        # prevent NoneType
        qty_raw = item.get("qty")
        if not qty_raw or not str(qty_raw).isdigit():
            qty = 1
            item["qty"] = "1"  # fix it in the session
        else:
            qty = int(qty_raw)

        item_total = price * qty
        item["item_total"] = round(item_total, 2)
        cart_total_amount += item_total

    request.session.modified = True

    # Render updated cart
    context_html = render_to_string(
        "core/async/cart-list.html",
        {
            "cart_data": cart_data,
            "totalcartitems": len(cart_data),
            "cart_total_amount": round(cart_total_amount, 2),
        },
        request=request
    )

    return JsonResponse({
        "data": context_html,
        "totalcartitems": len(cart_data)
    })




@login_required
def checkout_view(request):
    host = request.get_host()
    paypal_dict = {
        "business": settings.PAYPAL_RECEIVER_EMAIL,
        "amount": "100.00",
        "item_name": "Order-Item-No-3",
        "invoice": "INVOICE_NO-3",
        "currency_code": "USD",
        "notify_url": 'http://{}{}'.format(host, reverse("core:paypal-ipn")),
        "return_url": 'http://{}{}'.format(host, reverse("core:paypal-completed")),
        "cancel_return": 'http://{}{}'.format(host, reverse("core:paypal-failed")),

    }

    paypal_payment_button = PayPalPaymentsForm(initial=paypal_dict)
  
    cart_total_amount = 0 
    if "cart_data_obj" in request.session:
        for p_id, item in request.session["cart_data_obj"].items():
            # cart_total_amount += int(item['qty']) * float(item["price"])
            
            price_str = item["price"].replace('#', '').replace('₦', '').replace('$', '')
            price = float(price_str)
            cart_total_amount += int(item['qty']) * price


        return render(request, "core/checkout.html", {
            "cart_data": request.session["cart_data_obj"],
            "totalcartitems": len(request.session["cart_data_obj"]),
            "cart_total_amount": round(cart_total_amount, 2),
            'paypal_payment_button':paypal_payment_button
        })


def payment_completed_view(request):
    return render(request, 'core/payment-completed.html')

def payment_failed_view(request):
    return render(request, 'core/payment-failed.html')



def category_product_list(request, cid):
    category = get_object_or_404(Category, cid=cid)
    products = Product.objects.filter(category=category)
    categories = Category.objects.all()  # ← needed for nav + footer

    context = {
        'category': category,
        'products': products,
        'categories': categories,  # ← without this, the page breaks
    }
    return render(request, 'core/category-product-list.html', context)