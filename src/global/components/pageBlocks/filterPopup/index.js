const radios = document.querySelectorAll(".radio");
radios.forEach((el) => {
    el.addEventListener("click", () => {
        const activeRadio = el.closest(".radio__list").querySelector(".radio_active")
        if (activeRadio) {
            activeRadio.classList.remove("radio_active")
        } 
        el.classList.add("radio_active")
    })
})

const checkboxes = document.querySelectorAll(".checkbox");
checkboxes.forEach((el) => {
    el.addEventListener("click", () => {
        el.classList.toggle("checkbox_active")
    })
})

document.querySelector(".filter-popup__reset").addEventListener("click", () => {
    document.querySelectorAll(".radio_active").forEach((el) => el.classList.remove("radio_active"));
    document.querySelectorAll(".checkbox_active").forEach((el) => el.classList.remove("checkbox_active"));
})

