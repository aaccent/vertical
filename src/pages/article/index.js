import { scroll } from 'features/animations/scroll'

const outlines = Array.from(document.querySelectorAll(".article__outline__item"));
const header = document.querySelector(".header__container");

const copyLink = document.querySelector(".copy_link");
copyLink?.addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        copyLink.classList.add("link_copied");
        copyLink.addEventListener("mouseleave", () => {
            copyLink.classList.remove("link_copied")
        })
    });
})

const share = document.querySelector(".article__share-list_initiator");
const shareDate = {
    url: window.location.href
}

share?.addEventListener("click", () => {
    navigator.share(shareDate);
})

const links = document.querySelectorAll(".article__outline__item a");
links.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        // Уберите активное состояние для всех элементов
        links.forEach((el) => {
            if (el.closest(".article__outline__item").classList.contains("article__outline__item_active")) {
                el.closest(".article__outline__item").classList.remove("article__outline__item_active");
            }
        });

        // Добавьте активное состояние для текущего элемента
        link.closest(".article__outline__item").classList.add("article__outline__item_active");

        console.log(link.getAttribute('href'));
        console.log(event);
        // Используйте setScrollTo для прокрутки к нужному элементу или позиции
        scroll.scrollTo(event.screenX);
    });
});




