
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

  // return (data, state, action) => {

  //     // ------------------------------------------------------
  //     // #5.2 — применить компаратор
  //     //
  //     // searchValue берём из state
  //     // если поле поиска пустое — ничего не фильтруем
  //     // ------------------------------------------------------
  //     const searchValue = state[searchField];

  //     if (!searchValue) {
  //         return data;
  //     }

  //     // иначе фильтруем строки
  //     return data.filter(row => compare(row, state));
  // };
  return (query, state, action) => {
    // result заменили на query
    return state[searchField]
      ? Object.assign({}, query, {
          // проверяем, что в поле поиска было что-то введено
          search: state[searchField], // устанавливаем в query параметр
        })
      : query; // если поле с поиском пустое, просто возвращаем query без изменений
  };
}
