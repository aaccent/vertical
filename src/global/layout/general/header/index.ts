const header = document.querySelector('.header') as HTMLElement
const headerContainer = document.querySelector('.header__container') as HTMLElement
const headerHeight = headerContainer.getBoundingClientRect().height

window.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > headerHeight ) {
    header.classList.add('header_scrolled')
  } else if (document.documentElement.scrollTop < headerHeight) {    
    header.classList.remove('header_scrolled')
  }
})
