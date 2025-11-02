// Ducklett interactive appointment page
// Uses vanilla JavaScript modules for clarity and maintainability.

const STORAGE_KEY = "ducklettAppointment";
const THEME_KEY = "ducklettTheme";
const SAD_TIMEOUT = 2400;

const elements = {
  yesButton: document.querySelector("#yes-btn"),
  noButton: document.querySelector("#no-btn"),
  statusMessage: document.querySelector("#status-message"),
  schedulerSection: document.querySelector("#scheduler"),
  bookingForm: document.querySelector("#booking-form"),
  dateInput: document.querySelector("#date-input"),
  timeInput: document.querySelector("#time-input"),
  confirmation: document.querySelector("#confirmation"),
  ducklettFigure: document.querySelector(".ducklett"),
  bubbleTemplate: document.querySelector("#bubble-template"),
  celebrationAudio: document.querySelector("#celebration-audio"),
  themeToggle: document.querySelector("#toggle-theme"),
};

/**
 * Adds water bubble celebration elements.
 * The animation is purely decorative, so bubbles are marked aria-hidden.
 */
function spawnBubbles() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 12; i += 1) {
    const bubble = elements.bubbleTemplate.content.firstElementChild.cloneNode(true);
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDelay = `${Math.random() * 0.8}s`;
    fragment.appendChild(bubble);
  }
  elements.confirmation.appendChild(fragment);
  // Clean up bubbles after animation completes.
  setTimeout(() => {
    elements.confirmation.querySelectorAll(".bubble").forEach((node) => node.remove());
  }, 4200);
}

/** Displays the scheduler section with a smooth reveal. */
function showScheduler() {
  if (elements.schedulerSection.hasAttribute("hidden")) {
    elements.schedulerSection.hidden = false;
    elements.schedulerSection.classList.add("is-visible");
    setTimeout(() => elements.schedulerSection.classList.remove("is-visible"), 400);
  }
}

/** Enables or disables the CTA buttons while updating ARIA state. */
function toggleButtonsDisabled(isDisabled) {
  [elements.yesButton, elements.noButton].forEach((button) => {
    button.disabled = isDisabled;
    button.setAttribute("aria-disabled", String(isDisabled));
  });
}

/** Handles the "No" response, including the sad animation and message. */
function handleNoClick() {
  toggleButtonsDisabled(true);
  elements.statusMessage.textContent = "Ducklett está triste... ¿seguro?";
  elements.ducklettFigure.classList.add("ducklett--sad");
  setTimeout(() => {
    toggleButtonsDisabled(false);
    elements.ducklettFigure.classList.remove("ducklett--sad");
  }, SAD_TIMEOUT);
}

/**
 * Validates the selected date and time, ensuring they form a future appointment.
 * @returns {{valid: boolean, message?: string, isoString?: string}}
 */
function validateSchedule(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return { valid: false, message: "Selecciona la fecha y el horario." };
  }

  const selectedDateTime = new Date(`${dateValue}T${timeValue}`);
  if (Number.isNaN(selectedDateTime.getTime())) {
    return { valid: false, message: "La fecha u hora no es válida." };
  }

  const now = new Date();
  if (selectedDateTime <= now) {
    return { valid: false, message: "Elige un momento futuro para conversar." };
  }

  return { valid: true, isoString: selectedDateTime.toISOString() };
}

/** Persists the confirmed schedule and updates the UI message. */
function saveAppointment(dateValue, timeValue, isoString, options = {}) {
  const appointment = { date: dateValue, time: timeValue, iso: isoString };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointment));
  renderAppointment(isoString, options);
}

/** Attempts to play the celebration audio with graceful failure. */
function playCelebrationSound() {
  if (!elements.celebrationAudio) return;
  const playPromise = elements.celebrationAudio.cloneNode(true).play();
  if (playPromise) {
    playPromise.catch(() => {
      // Ignore autoplay restrictions silently.
    });
  }
}

/** Handles form submissions for booking confirmation. */
function handleBookingSubmit(event) {
  event.preventDefault();
  const dateValue = elements.dateInput.value;
  const timeValue = elements.timeInput.value;
  const validation = validateSchedule(dateValue, timeValue);
  if (!validation.valid) {
    elements.statusMessage.textContent = validation.message;
    elements.confirmation.hidden = true;
    return;
  }
  elements.statusMessage.textContent = "¡Ducklett está feliz!";
  saveAppointment(dateValue, timeValue, validation.isoString, { celebrate: true });
}

/** Restores saved data from localStorage, if any. */
function restoreState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.date && data.time) {
        elements.dateInput.value = data.date;
        elements.timeInput.value = data.time;
        showScheduler();
        renderAppointment(data.iso ?? `${data.date}T${data.time}`, { celebrate: false });
        elements.statusMessage.textContent = "Hemos recordado tu última cita con Ducklett.";
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "dark") {
    document.body.classList.add("dark");
    elements.themeToggle.setAttribute("aria-pressed", "true");
    elements.themeToggle.textContent = "Desactivar modo oscuro";
  }
}

/** Toggles the theme between light and dark variations. */
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  elements.themeToggle.setAttribute("aria-pressed", String(isDark));
  elements.themeToggle.textContent = isDark ? "Desactivar modo oscuro" : "Activar modo oscuro";
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

/** Registers the event listeners for the page. */
function registerEventListeners() {
  elements.noButton.addEventListener("click", handleNoClick);
  elements.yesButton.addEventListener("click", () => {
    showScheduler();
    elements.statusMessage.textContent = "¡Genial! Selecciona cuándo quieres hablar.";
    elements.dateInput.focus();
  });
  elements.bookingForm.addEventListener("submit", handleBookingSubmit);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.ducklettFigure.addEventListener("dblclick", () => {
    elements.statusMessage.textContent = "🐣 ¡Easter egg! Ducklett practicó un nuevo aleteo.";
  });
}

registerEventListeners();
restoreState();

/**
 * Renders the confirmation panel with the selected appointment date.
 * @param {string} isoString - The ISO date time string to display.
 * @param {{celebrate?: boolean}} options - Controls celebratory animations.
 */
function renderAppointment(isoString, { celebrate = true } = {}) {
  if (!isoString) {
    elements.confirmation.hidden = true;
    return;
  }
  const dateFormatter = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const friendlyDate = dateFormatter.format(new Date(isoString));
  elements.confirmation.hidden = false;
  elements.confirmation.innerHTML = `
    <p>🎉 ¡Listo! Ducklett te espera el <strong>${friendlyDate}</strong>.</p>
    <p>¡No olvides llevar tus mejores historias acuáticas!</p>
  `;
  if (celebrate) {
    spawnBubbles();
    playCelebrationSound();
  }
}
