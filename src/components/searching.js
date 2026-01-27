import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {

    // ------------------------------------------------------
    // #5.1 — настроить компаратор
    //
    // Используем только:
    //  - rules.skipEmptyTargetValues
    //  - rules.searchMultipleFields(...)
    //
    // Сравниваем поле searchField со всеми колонками:
    //  ['date', 'customer', 'seller']
    //
    // Последний параметр false означает:
    //  - искать подстроку, а не полное совпадение
    // ------------------------------------------------------
    const compare = createComparison([
        rules.skipEmptyTargetValues,
        rules.searchMultipleFields(searchField, ["date", "customer", "seller"], false)
    ]);

    return (data, state, action) => {

        // ------------------------------------------------------
        // #5.2 — применить компаратор
        //
        // searchValue берём из state
        // если поле поиска пустое — ничего не фильтруем
        // ------------------------------------------------------
        const searchValue = state[searchField];

        if (!searchValue) {
            return data;
        }

        // иначе фильтруем строки
        return data.filter(row => compare(row, state));
    };
}
