 import IMask from 'imask';
 import gsap from 'gsap'

const form = document.querySelector("form");
if (form) {
    form.querySelectorAll(".contact-form__input").forEach((el) => {
        el.onfocus = () => {
            
            const span = el.closest(".contact-form__container").querySelector(".span");
            gsap.to(span, {y:-25, duration:.4})
            span.classList.add("span__active");
            if (!el.classList.contains("contact-form__textarea")) {
                el.closest(".contact-form__container").querySelector(".reset-input").style.display = "block";
                el.nextElementSibling.classList.remove("contact-form__error__active");
            }
        }
        el.onblur = () => {
            if (!el.value) {
                const span = el.closest(".contact-form__container").querySelector(".span");
                gsap.fromTo(span, {y:-20, duration:.4}, {y:0, duration:.4})
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
        return new Promise((resolve, reject) => {
            e.preventDefault()
            let valid = true;
            if (!form.customer_name.value) {
                form.customer_name.nextElementSibling.classList.add("contact-form__error__active");
                valid = false;
            }
            if (!form.customer_phone.value || form.customer_phone.value.length < 16) {
                form.customer_phone.nextElementSibling.classList.add("contact-form__error__active");
                valid = false;
            }
            if (form.customer_mail.value && !form.customer_mail.value.match(/.+@.+\..+/i)) {
                form.customer_mail.nextElementSibling.classList.add("contact-form__error__active");
                valid = false;
            }

            valid ? resolve(() => {
                form.requestSubmit(e.currentTarget);
                form.reset();
            }) : reject(new Error("введите верные данные"))
            
        }).then(
            result => result(),
            error => console.log(error)
        )
        
    })
}
