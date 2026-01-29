import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // @todo: #2.6 — обработка кнопок навигации
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
        case "page":
          if (action.pageNumber) {
            page = Math.max(1, Math.min(pageCount, action.pageNumber));
          }
          break;
      }
    }

    // @todo: #2.1 — расчёт количества страниц
    return Object.assign({}, query, {
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    // @todo: #2.1 — расчёт количества страниц
    pageCount = Math.ceil(total / limit);

    // @todo: #2.4 — вывести видимые страницы
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // @todo: #2.5 — обновить статус (rowsPerPage заменена на limit)
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return {
    updatePagination,
    applyPagination,
  };
};
