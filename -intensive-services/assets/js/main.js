const text = "Loader_if";
const repetitions = 10; // Достатня кількість повторень для заповнення екрану

// Створюємо елементи
const marqueeWrapper = document.getElementById("marqueeWrapper");
for (let i = 0; i < repetitions; i++) {
  const textElement = document.createElement("span");
  textElement.className = "marquee__text";
  textElement.textContent = text;
  marqueeWrapper.appendChild(textElement);
}

const textElements = document.querySelectorAll(".marquee__text");

// Обчислюємо ширину одного текстового елемента
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
  if (isElementInViewport(marqueeContainer)) {
    isScrolling = true;
  } else {
    isScrolling = false;
  }
});

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

//slider
document.addEventListener("DOMContentLoaded", function () {
  const sliderTrack = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide");
  const navDots = document.querySelectorAll(".nav-dot");
  const slideWidth = slides[0].offsetWidth;
  let currentIndex = 0;

  // Initialize slider
  updateSlider();

  // Set up event listeners for nav dots
  navDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });
  });

  // Auto slide (optional)
  // setInterval(() => {
  //     currentIndex = (currentIndex + 1) % slides.length;
  //     updateSlider();
  // }, 5000);

  function updateSlider() {
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    navDots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  let startX, moveX;
  let isDragging = false;

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
    isDragging = false;
    if (!moveX) return;

    const diff = moveX - startX;
    if (diff > 50 && currentIndex > 0) {
      currentIndex--;
    } else if (diff < -50 && currentIndex < slides.length - 1) {
      currentIndex++;
    }

    updateSlider();
    moveX = null;
  });
});

//error validation

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderContainer");

  // Обробник відправлення форми
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Забороняємо стандартну поведінку форми

    // Отримуємо значення полів форми
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const serviceSelect = document.getElementById("service");
    const serviceDescription = serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-description'); // Отримуємо текстову інформацію

    // Перевірка на порожні поля (додайте перевірки за потреби)
    if (!name || !phone || !serviceDescription) {
      alert("Будь ласка, заповніть всі поля!");
      return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toLocaleString('uk-UA');

    // Створюємо повідомлення для Telegram
    const message = `Нове замовлення:
    Ім'я: ${name}
    Телефон: ${phone}
    Вид роботи: ${serviceDescription} 
    Час створення замовлення: ${dateString}`;

    // Відправляємо повідомлення до бота через API Telegram
    sendToTelegram(message);
  });

  // Функція для відправлення повідомлення до Telegram
  function sendToTelegram(message) {
    const botToken = '8165384478:AAHQxL-bBrcHcQA7mJCLO-NCOl4tSCpIyJM';  // Замість цього введіть токен вашого бота
    const chatId = '-1002403182785';  // Замість цього введіть ваш chat_id

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
      chat_id: chatId,
      text: message,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          alert("Ваша заявка успішно надіслана!");
          form.reset(); // Очищаємо форму після успішної відправки
        } else {
          alert("Сталася помилка при відправці заявки.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Сталася помилка при відправці заявки.");
      });
  }
});
  const customSelect = document.getElementById("customSelect");
  const orderContainer = document.getElementById("orderContainer");
  const serviceError = document.getElementById("serviceError");

  customSelect.addEventListener("focus", () => {
    orderContainer.classList.add("overlay");
    customSelect.classList.add("error");
  });

  customSelect.addEventListener("change", () => {
    orderContainer.classList.remove("overlay");
    customSelect.classList.remove("error");
    serviceError.classList.remove("show");
  });

  // Закриваємо селект при кліці поза ним
  document.addEventListener("click", (event) => {
    if (!orderContainer.contains(event.target)) {
      customSelect.blur();
      orderContainer.classList.remove("overlay");
    }
  });

  // Форма валідація
  const form = document.querySelector(".order__form");
  form.addEventListener("submit", (e) => {
    let isValid = true;

    // Name validation
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("nameError");
    if (!nameInput.value.trim()) {
      nameError.classList.add("show");
      isValid = false;
    } else {
      nameError.classList.remove("show");
    }

    // Phone validation
    const phoneInput = document.getElementById("phone");
    const phoneError = document.getElementById("phoneError");
    if (!phoneInput.value.trim()) {
      phoneError.classList.add("show");
      isValid = false;
    } else {
      phoneError.classList.remove("show");
    }

    // Service validation
    if (customSelect.value === "") {
      serviceError.classList.add("show");
      customSelect.classList.add("error");
      isValid = false;
    } else {
      serviceError.classList.remove("show");
      customSelect.classList.remove("error");
    }

    if (!isValid) {
      e.preventDefault();
    }
  });