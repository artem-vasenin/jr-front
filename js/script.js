window.onload = function() {
    console.log("Страница полностью загружена!");
    const searchBtn = document.getElementById("search-btn");
    const submitBtn = document.getElementById("submit-btn");

    searchBtn.addEventListener("click", function() {
        alert('Тут будет поиск');
    });

    submitBtn.addEventListener("click", function() {
        alert('Тут будет добавление задач');
    });
};
