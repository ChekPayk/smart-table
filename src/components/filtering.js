import { createComparison, defaultRules } from "../lib/compare.js";

// Настроим компаратор один раз
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // --------------------------------------------------
  // #4.1 — заполнить выпадающие списки опциями
  // --------------------------------------------------
Object.keys(indexes).forEach((elementName) => {
        const select = elements[elementName];

        select.append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });


  return (data, state, action) => {
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
    // #4.5 — фильтруем данные, используя компаратор
    // --------------------------------------------------
    return data.filter((row) => compare(row, state));
  };
}
