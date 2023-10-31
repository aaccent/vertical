import gsap from 'gsap'
import 'components/ui/accordion'
import { afterLoader } from 'features/animations/page-loader'

const header = document.querySelector('.header') as HTMLElement
const headerContainer = document.querySelector('.header__container') as HTMLElement
const headerHeight = headerContainer.getBoundingClientRect().height
let lastScrollPos = 0
window.addEventListener('scroll', (e) => {
  if (document.documentElement.scrollTop > lastScrollPos || document.documentElement.scrollTop < headerHeight) {
    header.classList.remove('header_scrolled')
  } else if (document.documentElement.scrollTop < lastScrollPos) {
    header.classList.add('header_scrolled')

    header.style.transform = "translateY(0)"
  }
  lastScrollPos = document.documentElement.scrollTop
})

void function() {
  const animation = gsap.timeline({ paused: true })
    .fadeUp('.header__content, .breadcrumb', {}, 0)
    .from('.header__content', {
      duration: 2.2,
      '--after-width': '0%'
    }, '<0')

  afterLoader(() => animation.resume())
}()