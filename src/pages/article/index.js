const outlines = Array.from(document.querySelectorAll(".article__outline__item"));
const header = document.querySelector(".header__container");

window.addEventListener("scroll", () => {
    let scrollDistance = window.scrollY;
    document.querySelectorAll(".article__text").forEach((el, i) => {
        if (el.offsetTop - header.clientHeight <= scrollDistance) {
            outlines.find((el) => el.classList.contains("article__outline__item_active"))
                .classList.remove("article__outline__item_active");
            document.querySelectorAll(".article__outline__item")[i].classList.add("article__outline__item_active");
        }
    })
});

const links = Array.from(document.querySelectorAll(".article__outline__item a"));
links.forEach((el) => {
    el.addEventListener("click", () => {
        links.find((el) => el.closest(".article__outline__item").classList.contains("article__outline__item_active"))
            .classList.remove("article__outline__item_active")
    })
})