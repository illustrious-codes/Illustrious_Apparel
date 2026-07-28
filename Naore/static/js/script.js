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

$(document).on("click", ".update-product", function () {
  let product_id = $(this).data("product");
  let this_val = $(this);
  let product_quantity = $(".product-qty-" + product_id).val();

  console.log("Product Id:", product_id);
  console.log("Product Qty:", product_quantity);

  $.ajax({
    url: "/update-cart",
    data: {
      id: product_id,
      qty: product_quantity,
    },
    dataType: "json",
    beforeSend: function () {
      // this_val.hide();
      console.log("Updating product:", product_id);
    },
    success: function (response) {
      this_val.show();
      $(".cart-items-count").text(response.totalcartitems);
      $("#cart-list").html(response.data);
      // $("#cart-list").html(res.data);
      // $(".cart-count").text(res.totalcartitems);
    },
  });
});

/* ══════════════════════════════════════════════════════
   ILLUSTRIOUS CODES APPAREL — main.js (FIXED)
══════════════════════════════════════════════════════ */

/* ─── HELPER ────────────────────────────────────────── */
const fmt = (n) => "₦" + n.toLocaleString("en-NG");

/* ─── PRODUCT DATA ──────────────────────────────────── */
// ✅ FIX 1: was declared twice (once here, once in HTML <script>).
// Keep it ONLY here and remove it from your HTML <script> block.
const products = [
  {
    id: 1,
    name: "Luxury Hoodie",
    category: "men",
    price: 35000,
    img: "cloth1.jpg",
    badge: "New",
    cat_label: "Men · Hoodies",
  },
  {
    id: 2,
    name: "Premium Shirt",
    category: "men",
    price: 28000,
    img: "cloth2.jpg",
    badge: "",
    cat_label: "Men · Shirts",
  },
  {
    id: 3,
    name: "Classic IC Tee",
    category: "men",
    price: 18000,
    img: "cloth1.jpg",
    badge: "",
    cat_label: "Men · Tees",
  },
  {
    id: 4,
    name: "Statement Jacket",
    category: "women",
    price: 42000,
    img: "cloth2.jpg",
    badge: "Sale",
    cat_label: "Women · Jackets",
    old_price: 55000,
  },
  {
    id: 5,
    name: "Silk Midi Dress",
    category: "women",
    price: 38000,
    img: "women.jpg",
    badge: "New",
    cat_label: "Women · Dresses",
  },
  {
    id: 6,
    name: "Trench Coat",
    category: "women",
    price: 65000,
    img: "women.jpg",
    badge: "",
    cat_label: "Women · Outerwear",
  },
  {
    id: 7,
    name: "IC Sneakers",
    category: "shoes",
    price: 45000,
    img: "shoes.jpg",
    badge: "New",
    cat_label: "Shoes · Sneakers",
  },
  {
    id: 8,
    name: "Leather Loafers",
    category: "shoes",
    price: 52000,
    img: "shoes.jpg",
    badge: "",
    cat_label: "Shoes · Formal",
  },
  {
    id: 9,
    name: "IC Monogram Bag",
    category: "accessories",
    price: 30000,
    img: "bag.jpg",
    badge: "New",
    cat_label: "Accessories · Bags",
  },
  {
    id: 10,
    name: "Gold Chain Belt",
    category: "accessories",
    price: 12000,
    img: "bag.jpg",
    badge: "",
    cat_label: "Accessories · Belts",
  },
  {
    id: 11,
    name: "Cargo Trousers",
    category: "men",
    price: 22000,
    img: "men.jpg",
    badge: "",
    cat_label: "Men · Trousers",
  },
  {
    id: 12,
    name: "Bodycon Dress",
    category: "women",
    price: 27000,
    img: "women.jpg",
    badge: "Sale",
    cat_label: "Women · Dresses",
    old_price: 35000,
  },
];

/* ─── STATE ─────────────────────────────────────────── */
let cart = [];
let activeFilter = "all";

/* ══════════════════════════════════════════════════════
   ALL DOM-DEPENDENT CODE wrapped in DOMContentLoaded
   ✅ FIX 2: prevents "Cannot read properties of null"
   crashes when elements don't exist on the current page
══════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  /* ─── SLIDER ──────────────────────────────────────── */
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

    nextBtn.addEventListener("click", () => {
      if (sliderPos < totalSliderItems - 1) {
        sliderPos++;
        slider.style.transform = `translateX(-${sliderPos * 100}%)`;
        sliderEnd();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (sliderPos > 0) {
        sliderPos--;
        slider.style.transform = `translateX(-${sliderPos * 100}%)`;
        sliderEnd();
      }
    });

    sliderEnd();
  }

  /* ─── QUANTITY (product detail page) ─────────────── */
  const totalPriceElem = document.querySelector("[data-total-price]");
  const qtyMinusBtn = document.querySelector("[data-qty-minus]");
  const qtyPlusBtn = document.querySelector("[data-qty-plus]");

  if (totalPriceElem && qtyMinusBtn && qtyPlusBtn) {
    let qty = 1;
    const rawPrice = totalPriceElem.dataset.price || "0";
    const productPrice = parseFloat(rawPrice);

    const updatePrice = () => {
      totalPriceElem.textContent = `₦${(qty * productPrice).toLocaleString(
        "en-NG"
      )}`;
    };

    qtyPlusBtn.addEventListener("click", () => {
      qty++;
      updatePrice();
    });
    qtyMinusBtn.addEventListener("click", () => {
      if (qty > 1) qty--;
      updatePrice();
    });

    updatePrice();
  }

  /* ─── HAMBURGER (mobile nav) ──────────────────────── */
  // ✅ FIX 3: all getElementById calls are now inside DOMContentLoaded
  // AND wrapped in null checks so pages without these elements don't crash

  const mobileNavClose = document.getElementById("mobileNavClose");

  // ✅ Safe version — add this to script.js
  document.addEventListener("DOMContentLoaded", function () {
    /* ── HAMBURGER ─────────────────────────────────── */
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileNav = document.getElementById("mobileNav");
    const overlayBg = document.getElementById("overlayBg");
    const mobileNavClose = document.getElementById("mobileNavClose");

    function openMobileNav() {
      if (mobileNav) mobileNav.classList.add("open");
      if (overlayBg) overlayBg.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeMobileNav() {
      if (mobileNav) mobileNav.classList.remove("open");
      if (overlayBg) overlayBg.classList.remove("show");
      document.body.style.overflow = "";
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMobileNav);
    if (mobileNavClose)
      mobileNavClose.addEventListener("click", closeMobileNav);
    if (overlayBg) overlayBg.addEventListener("click", closeMobileNav);

    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });

    /* ── MOBILE SHOP TOGGLE ────────────────────────── */
    const mobileShopToggle = document.getElementById("mobileShopToggle");
    const mobileCategoryList = document.getElementById("mobileCategoryList");

    if (mobileShopToggle && mobileCategoryList) {
      mobileShopToggle.addEventListener("click", function (e) {
        e.preventDefault();
        const isOpen = mobileCategoryList.style.display === "flex";
        mobileCategoryList.style.display = isOpen ? "none" : "flex";
        const icon = this.querySelector("i");
        if (icon)
          icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
      });
    }
  });

  const openMobileNav = () => {
    if (mobileNav) mobileNav.classList.add("open");
    if (overlayBg) overlayBg.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  const closeMobileNav = () => {
    if (mobileNav) mobileNav.classList.remove("open");
    if (overlayBg) overlayBg.classList.remove("show");
    document.body.style.overflow = "";
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener("click", closeMobileNav);
  if (overlayBg) overlayBg.addEventListener("click", closeMobileNav);

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  /* ─── SEARCH TOGGLE ───────────────────────────────── */
  const searchToggle = document.getElementById("searchToggle");
  const searchBar = document.getElementById("searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  if (searchToggle && searchBar) {
    searchToggle.addEventListener("click", () => {
      searchBar.classList.toggle("open");
      if (searchBar.classList.contains("open") && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (searchClose && searchBar) {
    searchClose.addEventListener("click", () => {
      searchBar.classList.remove("open");
    });
  }

  /* ─── CART DRAWER ─────────────────────────────────── */
  const cartBtn = document.getElementById("cartBtn");
  const cartClose = document.getElementById("cartClose");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartDrawer = document.getElementById("cartDrawer");

  const openCart = () => {
    if (cartDrawer) cartDrawer.classList.add("open");
    if (cartOverlay) cartOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  const closeCart = () => {
    if (cartDrawer) cartDrawer.classList.remove("open");
    if (cartOverlay) cartOverlay.classList.remove("show");
    document.body.style.overflow = "";
  };

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  /* ─── CART UI UPDATE ──────────────────────────────── */
  function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);

    document
      .querySelectorAll(".cart-count")
      .forEach((el) => (el.textContent = count));

    const cartCountLabel = document.getElementById("cartCountLabel");
    const cartTotal = document.getElementById("cartTotal");
    const cartItems = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartFooter");

    if (cartCountLabel) cartCountLabel.textContent = count;
    if (cartTotal) cartTotal.textContent = fmt(total);

    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <i class="fa fa-shopping-bag"></i>
          <p>Your cart is empty</p>
          <a href="#shop" class="btn-gold" id="cartShopLink">Start Shopping</a>
        </div>`;
      if (cartFooter) cartFooter.style.display = "none";
      document
        .getElementById("cartShopLink")
        ?.addEventListener("click", closeCart);
    } else {
      cartItems.innerHTML = cart
        .map(
          (i) => `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${i.img || "cloth1.jpg"}" alt="${i.name}" />
          </div>
          <div class="cart-item-info">
            <h4>${i.name}</h4>
            <p>${fmt(i.price)} × ${i.qty}</p>
          </div>
          <button class="cart-item-remove" data-name="${i.name}" title="Remove">
            <i class="fa fa-times"></i>
          </button>
        </div>`
        )
        .join("");

      if (cartFooter) cartFooter.style.display = "flex";

      cartItems.querySelectorAll(".cart-item-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          cart = cart.filter((i) => i.name !== btn.dataset.name);
          updateCartUI();
        });
      });
    }
  }

  /* ─── ADD TO CART (vanilla JS) ───────────────────── */
  function addToCart(name, price, img) {
    const existing = cart.find((i) => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, img: img || "", qty: 1 });
    }
    updateCartUI();
    showToast(`✓ ${name} added to cart`);
  }

  function bindAddToCart() {
    document
      .querySelectorAll(".btn-add-cart, .add-to-cart-btn")
      .forEach((btn) => {
        // avoid binding twice
        btn.replaceWith(btn.cloneNode(true));
      });
    document
      .querySelectorAll(".btn-add-cart, .add-to-cart-btn")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const name = btn.dataset.name || btn.dataset.title || "Product";
          const price = parseInt(btn.dataset.price || "0");
          const img = btn.dataset.img || "";
          addToCart(name, price, img);
        });
      });
  }

  /* ─── PRODUCT GRID RENDER ─────────────────────────── */
  function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const filtered =
      activeFilter === "all"
        ? products
        : products.filter((p) => p.category === activeFilter);

    grid.innerHTML = filtered
      .map(
        (p) => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-card-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          ${
            p.badge
              ? `<span class="product-badge ${
                  p.badge === "Sale" ? "sale-badge" : ""
                }">${p.badge}</span>`
              : ""
          }
          <div class="product-card-actions">
            <button title="Add to Wishlist"><i class="fa fa-heart"></i></button>
            <button title="Quick View"><i class="fa fa-eye"></i></button>
          </div>
        </div>
        <div class="product-card-info">
          <p class="pcat">${p.cat_label}</p>
          <h3>${p.name}</h3>
          <p class="price">
            ${fmt(p.price)}
            ${p.old_price ? `<span class="old">${fmt(p.old_price)}</span>` : ""}
          </p>
          <button class="btn-cart btn-add-cart"
            data-name="${p.name}"
            data-price="${p.price}"
            data-img="${p.img}">Add to Cart</button>
        </div>
      </div>`
      )
      .join("");

    bindAddToCart();
  }

  /* ─── FILTER TABS ─────────────────────────────────── */
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.filter;
      renderProducts();
    });
  });

  /* ─── TOAST ───────────────────────────────────────── */
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ─── BACK TO TOP ─────────────────────────────────── */
  const btt = document.getElementById("backToTop");
  if (btt) {
    window.addEventListener("scroll", () => {
      btt.classList.toggle("show", window.scrollY > 400);
    });
    btt.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ─── STICKY HEADER SHADOW ────────────────────────── */
  const siteHeader = document.getElementById("site-header");
  if (siteHeader) {
    window.addEventListener("scroll", () => {
      siteHeader.style.boxShadow =
        window.scrollY > 60 ? "0 4px 30px rgba(0,0,0,.6)" : "none";
    });
  }

  /* ─── NEWSLETTER ──────────────────────────────────── */
  const nlForm = document.getElementById("nlForm");
  if (nlForm) {
    nlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("✓ You're now part of the Illustrious circle");
      e.target.reset();
    });
  }

  /* ─── INIT ────────────────────────────────────────── */
  renderProducts();
  bindAddToCart();
}); // ← end DOMContentLoaded

/* ══════════════════════════════════════════════════════
   JQUERY — Add to Cart / Delete / Update
   ✅ FIX 4: wrapped in $(document).ready so jQuery is
   confirmed loaded before these run
══════════════════════════════════════════════════════ */
if (typeof $ !== "undefined") {
  $(document).ready(function () {
    /* Add to cart (Django/AJAX version for product detail page) */
    $(document).on("click", ".add-to-cart-btn", function () {
      let quantity = $("#product-quantity").val() || 1;
      let product_title =
        $(".product-title").val() || $(".product-title").text();
      let product_id = $(".product-id").val();
      let product_pid = $(".product-pid").val();
      let product_price = $(".current-product-price").text();
      let product_image = $(".product-image img").first().attr("src");
      let product_old_price = $(".old-price").text();

      if (!product_id) return; // not on product detail page, skip

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
        success: function (res) {
          console.log("Added to cart:", product_title);
          if (res.totalcartitems !== undefined) {
            $(".cart-count").text(res.totalcartitems);
          }
        },
        error: function () {
          console.error("Failed to add to cart.");
        },
      });
    });

    /* Delete from cart */
    $(document).on("click", ".delete-product", function () {
      let product_id = $(this).data("product");
      $.ajax({
        url: "/delete-from-cart",
        data: { id: product_id },
        dataType: "json",
        success: function (res) {
          $("#cart-list").html(res.data);
          $(".cart-count").text(res.totalcartitems);
        },
      });
    });

    /* Update cart quantity */
    $(document).on("click", ".update-product", function () {
      let product_id = $(this).data("product");
      let product_quantity = $(".product-qty-" + product_id).val();
      let this_val = $(this);

      $.ajax({
        url: "/update-cart",
        data: { id: product_id, qty: product_quantity },
        dataType: "json",
        success: function (response) {
          this_val.show();
          $(".cart-items-count").text(response.totalcartitems);
          $("#cart-list").html(response.data);
        },
      });
    });
  });
}

// function sendToWhatsApp(event, type) {
//   event.preventDefault();

//   const qty = document.getElementById("product-quantity-{{ p.id }}").value || 1;
//   const title = "{{ p.title }}";
//   const price = "{{ p.price }}";
//   const phone = "2349057058845";

//   let message = "";

//   if (type === "cart") {
//     message =
//       "Hello Illustrious Codes! I want to order: " +
//       qty +
//       " piece(s)\n\n" +
//       "Product: " +
//       title +
//       "\n" +
//       "Price: ₦" +
//       price +
//       "\n\n" +
//       "Please confirm availability.";
//   } else {
//     message =
//       "Hello Illustrious Codes! I want to BUY NOW: " +
//       qty +
//       " piece(s)\n\n" +
//       "Product: " +
//       title +
//       "\n" +
//       "Price: ₦" +
//       price +
//       "\n\n" +
//       "Please send me payment details.";
//   }

//   const encoded = encodeURIComponent(message);
//   window.open("https://wa.me/" + phone + "?text=" + encoded, "_blank");
// }
