document.querySelectorAll('.accordion').forEach((accordion) => {
  const bodyWrapper = accordion.querySelector('.accordion__body__wrapper') as HTMLElement
  const body = accordion.querySelector('.accordion__body') as HTMLElement
  const header = accordion.querySelector(".accordion__header")

  if (accordion.classList.contains('accordion_active')) {
    body.style.height = `${bodyWrapper.getBoundingClientRect().height}px`
  }
  header?.addEventListener("click", () => {
    if (accordion.classList.contains('accordion_active')) {
      body.style.height = ``
      accordion.classList.remove("accordion_active")
      return
    }
    body.style.height = `${bodyWrapper.getBoundingClientRect().height}px`
    accordion.classList.add("accordion_active")

  })
})
