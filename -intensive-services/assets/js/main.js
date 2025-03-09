document.addEventListener("DOMContentLoaded", function () {
  const scrollToFormBtn = document.querySelector(".order__sevices");
  const scrollToFormBtn2 = document.querySelector(".hero__order-service"); 
  const serviceButtons = document.querySelectorAll(".service__btn");
  const orderFormSection = document.querySelector(".order-form-section"); 
  

  function scrollToForm() {
    orderFormSection.scrollIntoView({
      behavior: "smooth", 
      block: "start", 
    });
  }

  serviceButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToForm();
    });
  })

  if (scrollToFormBtn && orderFormSection) {
    scrollToFormBtn.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToForm();
    });
  }

  if (scrollToFormBtn2 && orderFormSection) {
    scrollToFormBtn2.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToForm();
    });
  }

});
const text = "Loader_if";
const repetitions = 10; 


const marqueeWrapper = document.getElementById("marqueeWrapper");
for (let i = 0; i < repetitions; i++) {
  const textElement = document.createElement("span");
  textElement.className = "marquee__text";
  textElement.textContent = text;
  marqueeWrapper.appendChild(textElement);
}

const textElements = document.querySelectorAll(".marquee__text");
const textWidth = textElements[0].offsetWidth + parseInt(getComputedStyle(textElements[0]).marginRight);
const marqueeContainer = document.querySelector(".marquee__container");
let position = 0;
let lastScrollY = window.scrollY;
let isScrolling = false;

// Функція для перевірки видимості блока
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// Додаємо слухач події прокрутки
window.addEventListener("scroll", function () {
  isScrolling = isElementInViewport(marqueeContainer);
});

// Анімація marquee
function animateMarquee() {
  if (isScrolling) {
    const scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    position -= scrollDelta * 1.5;

    if (position <= -textWidth) {
      position += textWidth;
    } else if (position > 0) {
      position -= textWidth;
    }

    marqueeWrapper.style.transform = `translateX(${position}px)`;
  }
  requestAnimationFrame(animateMarquee);
}

animateMarquee();

// Слайдер
document.addEventListener("DOMContentLoaded", function () {
  const sliderTrack = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide");
  const navDots = document.querySelectorAll(".nav-dot");
  const slideWidth = slides[0].offsetWidth;
  let currentIndex = 0;

  updateSlider();

  navDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });
  });

  function updateSlider() {
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    navDots.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
  }

  let startX, moveX, isDragging = false;

  sliderTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  sliderTrack.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    moveX = e.touches[0].clientX;
    const diff = moveX - startX;
    const translateX = -currentIndex * 100 + (diff / slideWidth) * 100;

    if (translateX <= 0 && translateX >= -(slides.length - 1) * 100) {
      sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
  });

  sliderTrack.addEventListener("touchend", () => {
    if (!moveX) return;
    const diff = moveX - startX;
    if (diff > 50 && currentIndex > 0) currentIndex--;
    else if (diff < -50 && currentIndex < slides.length - 1) currentIndex++;
    updateSlider();
    moveX = null;
    isDragging = false;
  });
});

// Валідація форми та відправка у Telegram
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderContainer");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");

  function validateName(name) {
    return /^[a-zA-Zа-яА-ЯіІїЇєЄ']+$/u.test(name);
  }

  function validatePhone(phone) {
    return /^\+380\d{9}$/.test(phone);
  }

  function toggleError(input, errorElement, isValid, errorMessage) {
    if (!isValid) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add("show");
    } else {
      errorElement.classList.remove("show");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const serviceSelect = document.getElementById("service");
    const serviceDescription = serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-description');

    let isValid = true;

    if (!validateName(name)) {
      if (name.length > 20) {
        toggleError(nameInput, nameError, false, "Ім'я не повинно перевищувати 20 символів.");
      } else {
        toggleError(nameInput, nameError, false, "Введіть правильне ім'я (лише букви).");
      }
      isValid = false;
    } else {
      toggleError(nameInput, nameError, true);
    }

    if (!validatePhone(phone)) {
      toggleError(phoneInput, phoneError, false, "Введіть правильний номер у форматі +38 (0XX) XXX XX XX.");
      isValid = false;
    } else {
      toggleError(phoneInput, phoneError, true);
    }

    if (!serviceDescription) {
      alert("Будь ласка, виберіть послугу!");
      isValid = false;
    }

    if (isValid) {
      sendToTelegram(name, phone, serviceDescription);
    }
  });

  function sendToTelegram(name, phone, serviceDescription) {
    const botToken = '7823306121:AAHr9HYBMXh2KQ7o7OwC3shaCOOxPDvPCdw';
    const chatId = '-1002305607610';
    const currentDate = new Date().toLocaleString('uk-UA');
    const message = `Нове замовлення:\nІм'я: ${name}\nТелефон: ${phone}\nВид роботи: ${serviceDescription}\nЧас створення: ${currentDate}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          alert("Форма успішно відправлена!");
          form.reset();
        } else {
          alert("Помилка при відправці форми.");
        }
      })
      .catch(() => alert("Помилка під час відправки."));
  }
});
