import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {

    // @todo: #2.3 — подготовить шаблон кнопки
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();   // очищаем контейнер

    return (data, state, action) => {

        // @todo: #2.1 — расчёт количества страниц
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;

        // @todo: #2.6 — обработка кнопок навигации
        if (action) switch (action.name) {
            case 'prev':  page = Math.max(1, page - 1); break;
            case 'next':  page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last':  page = pageCount; break;
        }

        // @todo: #2.4 — вывести видимые страницы
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            })
        );

        // @todo: #2.5 — обновить статус
        fromRow.textContent = (page - 1) * rowsPerPage + 1;
        toRow.textContent = Math.min(page * rowsPerPage, data.length);
        totalRows.textContent = data.length;

        // @todo: #2.2 — вернуть только строки текущей страницы
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    }
}
