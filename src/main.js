import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// --- Шаг 0: подготовка данных ---
const API = initData();

// --- Инициализация таблицы ---
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

// --- Шаг 5: поиск ---
const applySearching = initSearching("search");

// --- Шаг 4: фильтрация ---
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements,
);

// --- Шаг 3: сортировка ---
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const span = el.querySelector("span");

    input.value = page;
    input.checked = isCurrent;
    span.textContent = page;

    return el;
  },
);

// --- Сбор состояния формы ---
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  // Приведение типов
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

// --- Рендер таблицы ---
async function render(action) {
  let state = collectState();
  let query = {};
  query = applyPagination(query, state, action); // обновляем query
  query = applyFiltering(query, state, action); // result заменяем на query

  query = applySearching(query, state, action);
  query = applySorting(query, state, action);

  const { total, items } = await API.getRecords(query);

  updatePagination(total, query); // перерисовываем пагинатор
  sampleTable.render(items);
}

// --- Обработчики событий ---
sampleTable.container.addEventListener("change", () => render());
sampleTable.container.addEventListener("reset", () =>
  setTimeout(() => render()),
);
sampleTable.container.addEventListener("submit", (e) => {
  e.preventDefault();
  render(e.submitter);
});

// --- Подключаем таблицу к DOM ---
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await API.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

// --- Первичный рендер ---
init().then(render);
