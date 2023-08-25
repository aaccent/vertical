import "components/ui/dropdown"
import "components/ui/buttons"


const toggleLabel = (index: number) => {
  const labels = document.querySelectorAll(".filter__right span")
  labels.forEach((label, _index) => {
    if(index === _index){
      label.classList.add("active")
      return
    }
    label.classList.remove("active")
  })
}

document.querySelector(".button-switch")?.addEventListener("buttonChecked", () => {
  toggleLabel(1)
})

document.querySelector(".button-switch")?.addEventListener("buttonUnchecked", () => {
  toggleLabel(0)

})