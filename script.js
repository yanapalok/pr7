'use strict';


const timerEl = document.getElementById('session-time');
let seconds = 0;

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

window.setInterval(() => {
  seconds += 1;
  timerEl.textContent = formatTime(seconds);
}, 1000);


const DEFAULT_ROUTE = 'menu';
const sections = document.querySelectorAll('.page');
const links = document.querySelectorAll('.nav-link');
const routes = Array.from(sections, (section) => section.id);


function isValidRoute(name, list) {
  return typeof name === 'string' && Array.isArray(list) && list.includes(name);
}

function getRoute() {
  const name = window.location.hash.slice(1);
  return isValidRoute(name, routes) ? name : DEFAULT_ROUTE;
}

function renderRoute() {
  const route = getRoute();

  sections.forEach((section) => {
    section.classList.toggle('is-hidden', section.id !== route);
  });

  links.forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const active = document.getElementById(route);
  document.title = `${active.dataset.title} | McDonald's`;
}

window.addEventListener('hashchange', renderRoute);
renderRoute();


const MENU_ITEMS = [
  { id: 1, name: 'Біг Мак', price: 125, desc: 'Дві котлети, соус, салат, сир, огірок, цибуля на тристоронній булочці.' },
  { id: 2, name: 'Чізбургер', price: 65, desc: 'Класична котлета, сир, гірчиця, кетчуп, цибуля.' },
  { id: 3, name: 'Картопля фрі', price: 55, desc: 'Хрустка, гаряча, з сіллю. Підходить до всього меню.' },
  { id: 4, name: 'Макфлурі', price: 70, desc: 'Морозиво з наповнювачем на вибір.' }
];
const LOAD_DELAY_MS = 1500;

const stateBlocks = document.querySelectorAll('[data-state]');
const catalogEl = document.getElementById('catalog');
const searchEl = document.getElementById('search');
const emptyTextEl = document.getElementById('empty-text');

let items = MENU_ITEMS.slice();
let loadTimer = null;

function renderState(stateName) {
  stateBlocks.forEach((block) => {
    block.classList.toggle('is-hidden', block.dataset.state !== stateName);
  });
}

function createCard(item) {
  const li = document.createElement('li');
  li.className = 'card';

  const body = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = item.name;
  const desc = document.createElement('p');
  desc.textContent = item.desc;
  body.append(title, desc);

  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = `${item.price} ₴`;

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'btn btn-danger btn-sm';
  del.textContent = 'Видалити';
  del.dataset.id = String(item.id);
  del.setAttribute('aria-label', `Видалити: ${item.name}`);

  li.append(body, price, del);
  return li;
}



function filterItems(list, query) {
  const q = String(query).trim().toLowerCase();
  return list.filter((item) => item.name.toLowerCase().includes(q));
}

function renderCatalog() {
  const visible = filterItems(items, searchEl.value);

  catalogEl.replaceChildren(...visible.map(createCard));

  if (visible.length > 0) {
    renderState('content');
    return;
  }
  emptyTextEl.textContent = items.length === 0
    ? 'Усі позиції видалено. Поверніть початковий список.'
    : `За запитом «${searchEl.value.trim()}» нічого немає.`;
  renderState('empty');
}

function cancelLoading() {
  window.clearTimeout(loadTimer);
  loadTimer = null;
}


function loadData() {
  cancelLoading();
  renderState('loading');
  loadTimer = window.setTimeout(() => {
    loadTimer = null;
    renderCatalog();
  }, LOAD_DELAY_MS);
}

function resetList() {
  cancelLoading();
  items = MENU_ITEMS.slice();
  searchEl.value = '';
  renderCatalog();
}

document.getElementById('refresh').addEventListener('click', loadData);
document.getElementById('retry').addEventListener('click', loadData);
document.getElementById('reset').addEventListener('click', resetList);

searchEl.addEventListener('input', () => {
  cancelLoading();
  renderCatalog();
});

catalogEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-id]');
  if (!btn) return;
  items = items.filter((item) => String(item.id) !== btn.dataset.id);
  renderCatalog();
});


document.querySelectorAll('[data-set-state]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.setState;
    cancelLoading();
    if (target === 'content') {
      resetList();
    } else if (target === 'empty') {
      emptyTextEl.textContent = 'Список порожній.';
      renderState('empty');
    } else {
      renderState(target);
    }
  });
});

renderCatalog();


const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

function syncThemeButton() {
  const isDark = root.dataset.theme === 'dark';
  themeBtn.setAttribute('aria-pressed', String(isDark));
  themeBtn.textContent = isDark ? 'Світла тема' : 'Темна тема';
}

themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  syncThemeButton();
});
syncThemeButton();



function validateInput(value) {
  return typeof value === 'string' && value.trim() !== '';
}

const form = document.getElementById('feedback-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const fields = Array.from(form.elements).filter((el) => el.required);
  let valid = true;

  fields.forEach((field) => {
    const ok = field.checkValidity() && validateInput(field.value);
    field.classList.toggle('is-invalid', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    if (!ok) valid = false;
  });

  statusEl.classList.toggle('is-ok', valid);
  statusEl.classList.toggle('is-error', !valid);

  if (valid) {
    statusEl.textContent = 'Дякуємо! Повідомлення надіслано.';
    form.reset();
  } else {
    statusEl.textContent = 'Заповніть усі поля та перевірте адресу пошти.';
  }
});