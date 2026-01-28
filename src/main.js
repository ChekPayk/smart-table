// src/main.js

import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// --- Шаг 0: подготовка данных ---
// const { data, ...indexes } = initData(sourceData);
const API = initData(sourceData);

// --- Инициализация таблицы ---
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"], // поиск, заголовок и фильтры
    after: ["pagination"],
  },
  render,
);

// --- Шаг 5: поиск ---
// const applySearching = initSearching('search');

// --- Шаг 4: фильтрация ---
// const applyFiltering = initFiltering(sampleTable.filter.elements, {
//     searchBySeller: indexes.sellers,
// });

// --- Шаг 3: сортировка ---
// const applySorting = initSorting([
//     sampleTable.header.elements.sortByDate,
//     sampleTable.header.elements.sortByTotal
// ]);

// --- Шаг 2: пагинация ---
// const applyPagination = initPagination(
//     sampleTable.pagination.elements,
//     (el, page, isCurrent) => {
//         const input = el.querySelector("input");
//         const span = el.querySelector("span");

//         input.value = page;
//         input.checked = isCurrent;
//         span.textContent = page;

//         return el;
//     }
// );
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

// --- Основная функция обработки данных ---
function processData(dataSet, state, action) {
  let result = [...dataSet];

  // // Поиск
  // result = applySearching(result, state, action);

  // // Фильтрация
  // result = applyFiltering(result, state, action);

  // // Сортировка
  // result = applySorting(result, state, action);

  // // Пагинация
  // result = applyPagination(result, state, action);

  return result;
}

// --- Рендер таблицы ---
async function render(action) {
  const state = collectState();
  // const result = processData(data, state, action);
  let query = {};
  query = applyPagination(query, state, action); // обновляем query
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
}

// --- Первичный рендер ---
init().then(render);
