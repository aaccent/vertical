const outlines = document.querySelectorAll(".article__outline__item");
const header = document.querySelector(".header__container");

window.addEventListener("scroll", () => {
    let scrollDistance = window.scrollY;
    document.querySelectorAll(".article__text").forEach((el, i) => {
        if (el.offsetTop - header.clientHeight <= scrollDistance) {
            outlines.forEach((el) => {
                if (el.classList.contains("article__outline__item_active")) {
                    el.classList.remove("article__outline__item_active");
                }
            })
            document.querySelectorAll(".article__outline__item")[i].classList.add("article__outline__item_active");
        }
    })
});

const links = document.querySelectorAll(".article__outline__item a");
links.forEach((el) => {
    el.addEventListener("click", () => {
        links.forEach((el) => {
            if (el.closest(".article__outline__item").classList.contains("article__outline__item_active")) {
                el.closest(".article__outline__item").classList.remove("article__outline__item_active");
            }
        })
    })
})