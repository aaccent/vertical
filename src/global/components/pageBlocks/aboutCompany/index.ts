import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NumbersWithAnimation } from 'features/animations/numbers'

void function () {
  const aboutSection = document.querySelector('.about-company')
  if (!aboutSection) return

  gsap.registerPlugin(ScrollTrigger)

  const animation = gsap.timeline()
    .textAppearing('.about-company__title', {
      alternate: true,
    }, '<0.2')
    .fadeUp('.about-company .title', { yPercent: 100 }, 0)
    .fade('.about-company__image', {}, 1)
    .from('.about-company__image img', {
      duration: 1,
      scale: 1.4
    }, 1)
    .fadeUp('.about-company__text', {}, 1)
    .fadeUp('.about-company__button', {
      duration: 1.4,
      yPercent: 170,
    }, 1)

  new ScrollTrigger({
    
    animation,
    trigger: aboutSection,
    start: 'top+=35% bottom',
  })

  gsap.from('.about-company .benefits', {
    scrollTrigger: {
      
      trigger: '.about-company .benefits',
      start: 'top+=35% bottom',
    },
    duration: 1,
    opacity: 0,
    yPercent: 35,
    onStart() {
      document
        .querySelectorAll<NumbersWithAnimation>('.about-company .benefits .number-animation')
        .forEach(i => i.playAnimation?.())
    }
  })
}()