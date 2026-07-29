from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Product, Category


class StaticViewSitemap(Sitemap):
    priority = 1.0
    changefreq = "weekly"

    def items(self):
        return [
            "core:index",
            "core:product-list",
            "core:search",
        ]

    def location(self, item):
        return reverse(item)


class ProductSitemap(Sitemap):
    priority = 0.9
    changefreq = "weekly"

    def items(self):
        # Only include published, active products
        return Product.objects.filter(status=True)

    def location(self, obj):
        return reverse("core:product-detail", kwargs={"pid": obj.pid})


class CategorySitemap(Sitemap):
    priority = 0.8
    changefreq = "weekly"

    def items(self):
        return Category.objects.all()

    def location(self, obj):
        return reverse("core:category-product-list", kwargs={"cid": obj.cid})