export function initFiltering(elements) {
  // --------------------------------------------------
  // #4.1 — заполнить выпадающие списки опциями
  // --------------------------------------------------
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const select = elements[elementName];

      select.append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        }),
      );
    });
  };

  // --------------------------------------------------
  // #4.2 и #4.5 — обработка фильтрации
  // --------------------------------------------------
  const applyFiltering = (query, state, action) => {
    // --------------------------------------------------
    // #4.2 — обработать очистку поля (кнопка clear)
    // --------------------------------------------------
    if (action && action.name === "clear") {
      const field = action.dataset.field; // что чистим
      const wrapper = action.closest(".filter-wrapper");

      if (wrapper) {
        const input = wrapper.querySelector("input, select");
        if (input) {
          input.value = "";
        }
      }

      // сбрасываем значение в state
      state[field] = "";
    }

    // --------------------------------------------------
    // #4.5 — формируем фильтр для запроса к API
    // --------------------------------------------------
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // ищем поля ввода в фильтре с непустыми данными
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
      }
    });

    // если в фильтре что-то добавилось, применим к запросу
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
