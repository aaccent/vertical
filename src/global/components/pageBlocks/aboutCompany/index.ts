import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NumbersWithAnimation } from 'features/animations/numbers'
import { alternateTextAnimation } from 'features/animations/text'

void function () {
  const aboutSection = document.querySelector('.about-company')
  if (!aboutSection || matchMedia('(max-width: 1200px)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const animation = gsap.timeline()
  alternateTextAnimation('.about-company__title span > span', animation, 0)
  animation
    .from('.about-company .title', {
      duration: 1,
      translateY: '100%',
      opacity: 0,
    }, 0)
    .from('.about-company__image', {
      duration: 1,
      opacity: 0,
    }, 1)
    .from('.about-company__image img', {
      duration: 1,
      scale: 1.4
    }, 1)
    .from('.about-company__text', {
      duration: 1,
      translateY: '30%',
      opacity: 0,
    }, 1)
    .from('.about-company__button', {
      duration: 1.4,
      translateY: '170%',
      opacity: 0,
    }, 1)

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: aboutSection,
    start: 'top+=35% bottom',
  })

  gsap.from('.about-company .benefits', {
    scrollTrigger: {
      scroller: '[data-scroll-container]',
      trigger: '.about-company .benefits',
      start: 'top+=35% bottom',
    },
    duration: 1,
    opacity: 0,
    translateY: '35%',
    onStart() {
      document
        .querySelectorAll<NumbersWithAnimation>('.about-company .benefits .number-animation')
        .forEach(i => i.playAnimation())
    }
  })
}()