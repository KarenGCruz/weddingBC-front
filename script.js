const weddingElem = document.getElementById('wedding');
const weddingDateString = weddingElem?.dataset?.datetime || '2026-12-19T17:00:00';
const weddingDate = new Date(weddingDateString).getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    // If the wedding date has passed, show 0
    document.getElementById("days").innerHTML = "00";
    document.getElementById("hours").innerHTML = "00";
    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("seconds").innerHTML = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
  document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
  document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
  document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
}

// Initial call
updateCountdown();
// Update every second
setInterval(updateCountdown, 1000);

// num de acompañantes, viene de api
const numCompanions = 4;

const companionsContainer = document.getElementById('companions-container');
const companionsMessage = document.getElementById('companions-message');
const companionsInputs = document.getElementById('companions-inputs');
const companionsControls = document.getElementById('companions-controls');
const remainingCount = document.getElementById('remaining-count');
const addCompanionBtn = document.getElementById('add-companion-btn');


let currentCompanions = 0;
let savedCompanionValues = [];

function updateCompanionsMessage() {
  if (numCompanions === 0) {
    companionsMessage.textContent = 'Esta es una invitación individual.';
    companionsControls.style.display = 'none';
  } else {
    companionsMessage.textContent = `Hemos considerado ${numCompanions} integrantes de tu familia, favor de registrarlos.`;
    companionsControls.style.display = 'flex';
  }
}

function createCompanionInput() {
  for (let i = 0; i < numCompanions; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Nombre de acompañante${i+1}`;
    input.className = 'companion-input';
    companionsInputs.appendChild(input);
  }
}



const radioButtons = document.querySelectorAll('input[name="asistencia"]');

function updateCompanionsVisibility() {
  const selected = document.querySelector('input[name="asistencia"]:checked');
  if (selected && selected.value === 'asistiré') {
    companionsContainer.classList.remove('companions-hidden');
    //restoreCompanions();
  } else {
    saveCompanions();
    companionsContainer.classList.add('companions-hidden');
  }
}

radioButtons.forEach(radio => {
  radio.addEventListener('change', updateCompanionsVisibility);
});

const form = document.querySelector('.rsvp form');
const modal = document.getElementById('confirmation-modal');
const modalMessage = document.getElementById('modal-message');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');

let pendingFormSubmit = false;

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const asistir = document.querySelector('input[name="asistencia"]:checked');
    if (asistir && asistir.value === 'asistiré') {
      // Count only filled inputs
      const filledInputs = Array.from(companionsInputs.querySelectorAll('.companion-input')).filter(input => input.value.trim() !== '').length;
      const availableCompanions = numCompanions - filledInputs;
      if (availableCompanions > 0) {
        // Show custom modal
        modalMessage.textContent = `Aún tienes espacio para ${availableCompanions} acompañante(s) más. ¿Deseas continuar sin agregarlos?`;
        modal.classList.remove('hidden');
        pendingFormSubmit = true;
      } else {
        // All companions filled, submit normally
        form.submit();
      }
    } else {
      // Not confirming attendance, submit normally
      form.submit();
    }
  });

  modalCancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    pendingFormSubmit = false;
  });

  modalConfirmBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    form.submit();
  });

  // Close modal when clicking overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) {
      modal.classList.add('hidden');
      pendingFormSubmit = false;
    }
  });
}

const reveals = document.querySelectorAll('.invitation, .godparents, .countdown, .story, .details, .rsvp, .godparent-item, .event');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

reveals.forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});

const timeBoxes = document.querySelectorAll('.time-box');

const countdownObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      timeBoxes.forEach((box) => box.classList.add('visible'));
    }
  });
}, { threshold: 0.2 });

const countdownSection = document.querySelector('.countdown');
countdownObserver.observe(countdownSection);

updateCompanionsVisibility();
createCompanionInput();
