import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'components/ui/buttons'
import gsap from 'gsap'
import { scroll } from 'features/animations/scroll'

new Swiper('.history__swiper', {
  navigation: {
    nextEl: '.arrow-button_right',
    prevEl: '.arrow-button_left',
  },
  spaceBetween: 60,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  modules: [ Navigation, Autoplay ],
})

void function () {
  const aboutHeader = document.querySelector('.about-header')
  if (!aboutHeader || matchMedia('(max-width: 1200px)').matches) return

  gsap.timeline()
    .textAppearing('.about-header__title', { duration: 1 })
    .textAppearing('.about-header__text', { alternate: true })
    .fadeUp('.about-header .arrow-button', { yPercent: 140 }, '<0')
    .from('.about-header__bottom', { duration: 1.3, '--before-width': '0%' }, '<0.4')

  const nextSection = document.querySelector<HTMLElement>('.about-header + *')
  document.querySelector('.about-header [data-action="scroll"]')?.addEventListener('click', () => {
    if (nextSection) scroll.scrollTo(nextSection)
  })
}()