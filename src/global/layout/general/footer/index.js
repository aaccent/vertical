import IMask from 'imask';

const form = document.querySelector("form");
if (form) {
    form.querySelectorAll(".contact-form__input").forEach((el) => {
        el.onfocus = () => {
            const span = el.closest(".contact-form__container").querySelector(".span");
            span.classList.add("span__active");
            if (!el.classList.contains("contact-form__textarea")) {
                el.closest(".contact-form__container").querySelector(".reset-input").style.display = "block";
            }
        }
        el.onblur = () => {
            if (!el.value) {
                const span = el.closest(".contact-form__container").querySelector(".span");
                span.classList.remove("span__active");
                el.closest(".contact-form__container").querySelector(".reset-input").style.display = "none";
            }
        }
    })

    const close = form.querySelectorAll(".reset-input");
    close.forEach((el) => {
        el.addEventListener("click", () => {
            el.closest(".contact-form__container").querySelector(".contact-form__input").value = "";
            el.closest(".contact-form__container").querySelector(".span").classList.remove("span__active");
            el.style.display = "none";
        })
    })

    new IMask(form.customer_phome, {
        mask: "+{7}(000)000-00-00",
    });
}
