// SLIDER

document.addEventListener("DOMContentLoaded", () => {
  const addEventOnElem = (elem, type, callback) => {
    if (!elem) return;
    if (elem.length > 1) {
      for (let i = 0; i < elem.length; i++) {
        elem[i].addEventListener(type, callback);
      }
    } else {
      elem.addEventListener(type, callback);
    }
  };

  // SLIDER
  const slider = document.querySelector("[data-slider]");
  const nextBtn = document.querySelector("[data-next]");
  const prevBtn = document.querySelector("[data-prev]");
  if (slider && nextBtn && prevBtn) {
    let sliderPos = 0;
    const totalSliderItems = slider.children.length;

    const sliderEnd = () => {
      nextBtn.classList.toggle("disabled", sliderPos >= totalSliderItems - 1);
      prevBtn.classList.toggle("disabled", sliderPos <= 0);
    };

    const slideToNext = () => {
      if (sliderPos < totalSliderItems - 1) {
        sliderPos++;
        slider.style.transform = `translateX(-${sliderPos}00%)`;
        sliderEnd();
      }
    };

    const slideToPrev = () => {
      if (sliderPos > 0) {
        sliderPos--;
        slider.style.transform = `translateX(-${sliderPos}00%)`;
        sliderEnd();
      }
    };

    addEventOnElem(nextBtn, "click", slideToNext);
    addEventOnElem(prevBtn, "click", slideToPrev);
    sliderEnd();
  }

  // QUANTITY
  const totalPriceElem = document.querySelector("[data-total-price]");
  const qtyElem = document.querySelector("[data-qty]");
  const qtyMinusBtn = document.querySelector("[data-qty-minus]");
  const qtyPlusBtn = document.querySelector("[data-qty-plus]");
  if (totalPriceElem && qtyElem && qtyMinusBtn && qtyPlusBtn) {
    let qty = 1;
    const productPrice = parseFloat("{{ p.price }}");

    const updatePrice = () => {
      qtyElem.textContent = qty;
      totalPriceElem.textContent = `#${(qty * productPrice).toFixed(2)}`;
    };

    addEventOnElem(qtyPlusBtn, "click", () => {
      qty++;
      updatePrice();
    });

    addEventOnElem(qtyMinusBtn, "click", () => {
      if (qty > 1) qty--;
      updatePrice();
    });

    updatePrice(); // initialize
  }
});

// ADD TO CART
$(".add-to-cart-btn").on("click", function () {
  let quantity = $("#product-quantity").val();
  let product_title = $(".product-title").text();
  let product_id = $(".product-id").val();
  let product_pid = $(".product-pid").val();
  let product_price = $(".current-product-price").text();
  let product_image = $(".product-image").first().attr("src");
  let product_old_price = $(".product-old-price").text();

  $.ajax({
    url: "/add-to-cart",
    data: {
      id: product_id,
      pid: product_pid,
      qty: quantity,
      title: product_title,
      price: product_price,
      image: product_image,
      old_price: product_old_price,
    },
    dataType: "json",
    success: function () {
      console.log("Added Product to Cart...");
    },
  });
});

$(document).on("click", ".delete-product", function () {
  let product_id = $(this).data("product");

  $.ajax({
    url: "/delete-from-cart",
    data: { id: product_id },
    dataType: "json",
    beforeSend: function () {
      console.log("Deleting product:", product_id);
    },
    success: function (res) {
      $("#cart-list").html(res.data); // update cart list
      $(".cart-count").text(res.totalcartitems); // update count
    },
  });
});
