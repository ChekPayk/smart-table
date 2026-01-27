import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {

    // текущее состояние сортировки
    let field = null;
    let order = 'none';

    return (data, state, action) => {

        // --------------------------------------------------
        // @todo: #3.1 — обработать клик по кнопке сортировки
        // --------------------------------------------------
        if (action && action.name === 'sort') {

            // переключаем состояние кнопки
            action.dataset.value = sortMap[action.dataset.value];

            // запоминаем новое состояние
            field = action.dataset.field;
            order = action.dataset.value;

            // --------------------------------------------------
            // @todo: #3.2 — сбросить остальные сортировки
            // --------------------------------------------------
            columns.forEach(col => {
                if (col !== action) {
                    col.dataset.value = 'none';
                }
            });

        } else {

            // --------------------------------------------------
            // @todo: #3.3 — восстановить выбранный режим сортировки
            // --------------------------------------------------
            columns.forEach(col => {
                if (col.dataset.value !== 'none') {
                    field = col.dataset.field;
                    order = col.dataset.value;
                }
            });
        }

        // если сортировки нет
        if (!field || order === 'none') {
            return data;
        }

        // применяем сортировку через утилиту
        return sortCollection(data, field, order);
    };
}
