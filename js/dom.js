jewel.dom = (function () {

    const $ = (queryString) => {
        return document.querySelectorAll(queryString);
    };

    const addClass = (element, className) => {
        element.classList.add(className);
    };

    const bind = (element, event, handler) => {
        if(typeof element === 'string') {
            element = $(element)[0];
        }
        element.addEventListener(event, handler, false);
    };

    const hasClass = (element, className) => {
        return element.classList.constains(className);
    };

    const removeClass = (element, className) => {
        element.classList.remove(className);
    };

    return {
        $,
        addClass,
        bind,
        hasClass,
        removeClass
    };

})();