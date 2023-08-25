const dropdownList = document.querySelectorAll<HTMLElement>('.dropdown')

const hideDropdown = (dropdown: HTMLElement) => {
  const dropdownContent = dropdown.querySelector('.dropdown__content') as HTMLElement

  setTimeout(() => {
    dropdown.classList.remove('dropdown_shown')
    dropdownContent.style.top = ''
  }, 250)
  dropdownContent.style.height = ''
  delete dropdownContent.dataset.onMouse 
}

dropdownList.forEach((dropdown) => {
  const dropdownContent = dropdown.querySelector('.dropdown__content') as HTMLElement
  const dropdownWrapper = dropdown.querySelector('.dropdown__content__wrapper') as HTMLElement

  dropdown.querySelector('.dropdown__title')?.addEventListener('click', () => {
    const dropdownBottom = dropdown?.getBoundingClientRect().bottom as number
    const dropdownHeight = dropdownWrapper.getBoundingClientRect().height as number

    if (dropdown.classList.contains('dropdown_shown')) {
      hideDropdown(dropdown)
      return
    }

    const toScreenEnd = document.documentElement.clientHeight - dropdownBottom

    if (toScreenEnd < dropdownHeight) {
      dropdownContent.style.top = `-${dropdownHeight + 20}px`
    }

    dropdownContent.style.height = `${dropdownHeight}px`
    setTimeout(() => {
      
      dropdownContent.dataset.onMouse = "false"
    }, (250));

    dropdown.classList.add('dropdown_shown')
  })

  dropdownContent.addEventListener('mouseenter', () => {
    dropdownContent.dataset.onMouse = 'true'
  })

  dropdownContent.addEventListener('mouseleave', () => {
    dropdownContent.dataset.onMouse = 'false'
  })
})

document.body.addEventListener('click', () => {
  document.querySelectorAll<HTMLElement>('.dropdown__content[data-on-mouse = false]').forEach((shownDropdown) => {
    hideDropdown(shownDropdown.parentElement as HTMLElement)
    console.log(shownDropdown.parentElement);
    
  })
})
