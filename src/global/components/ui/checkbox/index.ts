document.querySelectorAll('.radio__list').forEach((radioParent) => {
  const radioList = radioParent.querySelectorAll<HTMLElement>('.radio')

  radioList.forEach((radio) => {
    if (radio.classList.contains('radio_active')) {
      const input = radio.querySelector('input') as HTMLInputElement
      input.setAttribute('name', radio.dataset.name as string)
      input.setAttribute('value', radio.dataset.value as string)
    }
  })

  radioList.forEach((radio, index: number) => {
    radio.addEventListener('click', () => {
      radioList.forEach((anotherRadio, index: number) => {
        const input = anotherRadio.querySelector('input') as HTMLInputElement
        if (radio.isEqualNode(anotherRadio)) {
          radio.classList.add('radio_active')
          input.setAttribute('name', anotherRadio.dataset.name as string)
          input.setAttribute('value', anotherRadio.dataset.value as string)
        } else {
          anotherRadio.classList.remove('radio_active')
          input.removeAttribute('value')
          input.removeAttribute('name')
        }
      })
    })
  })
})

document.querySelectorAll<HTMLElement>('.checkbox').forEach((checkbox) => {
  const input = checkbox.querySelector('input') as HTMLInputElement

  if (checkbox.classList.contains('checkbox_active')) {
    input.setAttribute('name', checkbox.dataset.name as string)
    input.setAttribute('value', checkbox.dataset.value as string)
  }

  checkbox.addEventListener('click', () => {
    if (checkbox.classList.contains('checkbox_active')) {
      checkbox.classList.remove('checkbox_active')
      input.removeAttribute('value')
      input.removeAttribute('name')
      return
    }
    checkbox.classList.add('checkbox_active')

    input.setAttribute('name', checkbox.dataset.name as string)
    input.setAttribute('value', checkbox.dataset.value as string)
  })
})
