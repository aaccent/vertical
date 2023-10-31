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
})


const copyLink = document.querySelector(".copy_link");
copyLink.addEventListener("click", () => {
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
share.addEventListener("click", () => {
    navigator.share(shareDate);
})





