"use strict";

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

function showSlides() {
  let slides = document.getElementsByClassName("mySlides");
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].classList.add("active");
  setTimeout(showSlides, 5000);
}

const header = document.querySelector(".main-header");

function toggleHeaderPosition() {
  if (window.scrollY > 0) {
    header.classList.add("fixed-header");
  } else {
    header.classList.remove("fixed-header");
  }
}

window.addEventListener("scroll", toggleHeaderPosition);

// product detail

/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};

/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
};

addEventOnElem(navToggler, "click", toggleNav);

/**
 * slider funtionality
 */

const slider = document.querySelector("[data-slider]");
const nextBtn = document.querySelector("[data-next]");
const prevBtn = document.querySelector("[data-prev]");

// set the slider default position
let sliderPos = 0;

// set the number of total slider items
const totalSliderItems = 4;

// make next slide btn workable
const slideToNext = function () {
  sliderPos++;
  slider.style.transform = `translateX(-${sliderPos}00%)`;

  sliderEnd();
};

addEventOnElem(nextBtn, "click", slideToNext);

// make prev slide btn workable
const slideToPrev = function () {
  sliderPos--;
  slider.style.transform = `translateX(-${sliderPos}00%)`;

  sliderEnd();
};

addEventOnElem(prevBtn, "click", slideToPrev);

// check when slider is end then what should slider btn do
function sliderEnd() {
  if (sliderPos >= totalSliderItems - 1) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }

  if (sliderPos <= 0) {
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.classList.remove("disabled");
  }
}

sliderEnd();

/**
 * product quantity functionality
 */

const totalPriceElem = document.querySelector("[data-total-price]");
const qtyElem = document.querySelector("[data-qty]");
const qtyMinusBtn = document.querySelector("[data-qty-minus]");
const qtyPlusBtn = document.querySelector("[data-qty-plus]");

// set the product default quantity
let qty = 1;

// set the product default price
let productPrice = 125;

// set the initial total price
let totalPrice = 125;

const increaseProductQty = function () {
  qty++;
  totalPrice = qty * productPrice;

  qtyElem.textContent = qty;
  totalPriceElem.textContent = `$${totalPrice}.00`;
};

addEventOnElem(qtyPlusBtn, "click", increaseProductQty);

const decreaseProductQty = function () {
  if (qty > 1) qty--;
  totalPrice = qty * productPrice;

  qtyElem.textContent = qty;
  totalPriceElem.textContent = `$${totalPrice}.00`;
};

addEventOnElem(qtyMinusBtn, "click", decreaseProductQty);

// ADD TO CART

$("#add-to-cart-btn").on("click", function () {
  let quantity = $("#product-quantity").val();
  let product_title = $(".product-title").val();
  let product_id = $(".product-id").val();
  let product_price = $("#current-product-price").text();
  let this_val = $(this);

  console.log("Quantity:", quantity);
  console.log("ID:", product_id);
  console.log("Title:", product_title);
  console.log("Price:", product_price);
  console.log("Current Element:", this_val);
});
