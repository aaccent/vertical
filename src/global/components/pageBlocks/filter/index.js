const dropdownItems = Array.from(document.querySelectorAll(".dropdown__list__item"));
const filterSelected = document.querySelector(".filter__selected");

function buildFilter(text) {

    const itemSelected = Array.from(document.querySelectorAll(".dropdown__list__item__selected")).find((el) => el.textContent === text);
    const filterSelectedRight = filterSelected.querySelector(".filter__selected__right");
    console.log(itemSelected)

    if (itemSelected) {

        const newSelected = document.createElement("div");
        newSelected.classList.add("badge", "badge_blue");
        newSelected.textContent = text;

        const img = document.createElement("img");
        img.src = require("media/static/icons/close/close_white.svg");

        newSelected.append(img);
        filterSelectedRight.append(newSelected);

        img.onclick = () => {

            img.closest(".badge").remove();
            const itemDeselected = dropdownItems.find((el) => el.textContent === img.closest(".badge").textContent);
            itemDeselected.classList.remove("dropdown__list__item__selected");

            if (!filterSelected.querySelectorAll(".badge").length) {
                return filterSelected.style.display = "none";
            }
        }
    } else {
        filterSelectedRight.querySelectorAll(".badge").forEach((el) => {
            if (el.textContent === text) {
                el.remove();
            }
        })
    }
}

dropdownItems.forEach((el) => el.addEventListener("click", (e) => {
    el.classList.toggle("dropdown__list__item__selected");
    if (filterSelected) {
        buildFilter(el.textContent);
        if (!filterSelected.querySelectorAll(".badge").length) {
            return filterSelected.style.display = "none";
        }
        filterSelected.style.display = "flex";
    }
}))




if (document.querySelector(".filter__selected__reset")) {
    document.querySelector(".filter__selected__reset").onclick = () => {
        filterSelected.querySelectorAll(".badge")
            .forEach((el) => el.remove());

        filterSelected.style.display = "none";

        document.querySelectorAll(".dropdown__list__item__selected")
            .forEach((el) => el.classList.remove("dropdown__list__item__selected"));
    }
}
