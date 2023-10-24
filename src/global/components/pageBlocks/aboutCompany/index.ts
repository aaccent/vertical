import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NumbersWithAnimation } from 'features/animations/numbers'

function addTextAppearingAnimation(selector: string, tl: GSAPTimeline, pos?: number) {
  document.querySelectorAll(selector).forEach((line, index) => {
    tl.from(line, {
      duration: .8 + .3 * index,
      translateY: '100%',
    }, pos)
  })
}

void function () {
  const aboutSection = document.querySelector('.about-company')
  if (!aboutSection) return

  gsap.registerPlugin(ScrollTrigger)

  const animation = gsap.timeline()
  addTextAppearingAnimation('.about-company__title span > span', animation, 0)
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