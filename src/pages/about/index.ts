import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'components/ui/buttons'
import gsap from 'gsap'
import { scroll } from 'features/animations/scroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

// About-header animations
void function () {
  const aboutHeader = document.querySelector('.about-header')
  if (!aboutHeader || matchMedia('(max-width: 1200px)').matches) return

  gsap.timeline()
    .textAppearing('.about-header__title', { duration: 1 })
    .textAppearing('.about-header__text', { alternate: true })
    .fadeUp('.about-header .arrow-button', { yPercent: 140 }, '<0')
    .from('.about-header__bottom', {
      duration: 1.3,
      '--before-width': '0%',
    }, '<0.4')

  const nextSection = document.querySelector<HTMLElement>('.about-header + *')
  document.querySelector('.about-header [data-action="scroll"]')?.addEventListener('click', () => {
    if (nextSection) scroll.scrollTo(nextSection)
  })
}()

// Company-worth animations
void function () {
  const companyWorth = document.querySelector('.company-worth')
  if (!companyWorth || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .textAppearing('.company-worth__title', {})
    .textAppearing('.company-worth__item__title', {})
    .fadeUp('.company-worth__item__text', {}, '<0.4')
    .fadeUp('.company-worth__item__image', {}, '<0')
    .from('.company-worth__item', {
      duration: 1.2,
      '--after-height': '0%',
    }, '<0')

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: companyWorth,
    start: 'top+=20% bottom',
  })
}()