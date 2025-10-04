jewel.dom = (function () {

    const $ = (queryString) => {
        return document.querySelectorAll(queryString);
    };

    const addClass = (element, className) => {
        element.classList.add(className);
    };

    const hasClass = (element, className) => {
        return element.classList.constains(className);
    };

    const removeClass = (element, className) => {
        element.classList.remov(className);
    };

    return {
        $,
        addClass,
        hasClass,
        removeClass
    };

})();