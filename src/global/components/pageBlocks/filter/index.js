const dropdownItems = Array.from(document.querySelectorAll(".dropdown__list__item"));
const filterSelected = document.querySelector(".filter__selected");
console.log(filterSelected)
function buildFilter(text) {
    const itemSelected = Array.from(document.querySelectorAll(".dropdown__list__item__selected")).find((el) => el.textContent === text);
    const filterSelectedRight = filterSelected.querySelector(".filter__selected__right");
    if (itemSelected) {
        const newSelected = document.createElement("div");
        newSelected.classList.add("badge");
        newSelected.classList.add("badge_blue");
        const img = document.createElement("img");
        img.src = "media/static/icons/close/close_white.svg";
        newSelected.textContent = text;
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
        const deselected = Array.from(filterSelectedRight.querySelectorAll(".badge")).find((el) => el.textContent === text);
        deselected.remove();
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

const resetFilter = document.querySelector(".filter__selected__reset");
resetFilter.onclick = () => {
    Array.from(filterSelected.querySelectorAll(".badge")).forEach((el) => el.remove());
    filterSelected.style.display = "none";
    Array.from(document.querySelectorAll(".dropdown__list__item__selected")).forEach((el) => el.classList.remove("dropdown__list__item__selected"));
}