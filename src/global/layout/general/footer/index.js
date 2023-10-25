 import IMask from 'imask';

const form = document.querySelector("form");
if (form) {
    form.querySelectorAll(".contact-form__input").forEach((el) => {
        el.onfocus = () => {
            
            const span = el.closest(".contact-form__container").querySelector(".span");
            span.classList.add("span__active");
            if (!el.classList.contains("contact-form__textarea")) {
                el.closest(".contact-form__container").querySelector(".reset-input").style.display = "block";
                el.closest(".contact-form__container").querySelector(".contact-form__error").style.display = "none";
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
            el.style.display = "none";
        })
    })

    new IMask(form.customer_phone, {
        mask: "+{7}(000)000-00-00",
    });

    form.querySelector("button").addEventListener("click", (e) => {
        e.preventDefault();
        if (!form.customer_name.value) {
            form.customer_name.closest(".contact-form__container").querySelector(".contact-form__error").style.display = "inline";
        }
        if (!form.customer_phone.value || form.customer_phone.value.length < 16) {
            form.customer_phone.closest(".contact-form__container").querySelector(".contact-form__error").style.display = "inline";
        }
        if (form.customer_mail.value && !form.customer_mail.value.match(/.+@.+\..+/i)) {
            form.customer_mail.closest(".contact-form__container").querySelector(".contact-form__error").style.display = "inline";
        }
    })
}
