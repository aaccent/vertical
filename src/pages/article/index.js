const outlines = Array.from(document.querySelectorAll(".article__outline__item"));
const header = document.querySelector(".header__container");




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





