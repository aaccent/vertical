import gsap from 'gsap'
import { alternateTextAnimation } from 'features/animations/text'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void function() {
  const ourProjects = document.querySelector('.our-projects')
  if (!ourProjects || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .from('.our-projects .title', {
      duration: 1,
      opacity: 0,
      translateY: '100%',
    }, 0)

  alternateTextAnimation('.our-projects__title span > span', animation, 0.5, .5)

  animation
    .from('.our-projects__middle-image', {
      duration: 1,
      opacity: 0,
    }, 1)
    .from('.our-projects__right', {
      duration: 1,
      opacity: 0,
    }, 1.3)

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: ourProjects,
    start: 'top+=35% bottom',
  })

  const parallax = gsap.timeline()
    .to('.our-projects__middle-image', {
      translateY: '8%',
    }, 0)
    .to('.our-projects__right', {
      translateY: '35%',
    }, 0)

  const fadeUp = gsap.timeline()
    .pause()
    .from('.our-projects__text', {
      duration: 1,
      opacity: 0,
      translateY: '30%',
    }, 0)
    .from('.our-projects__button', {
      duration: 1,
      opacity: 0,
      translateY: '150%',
    }, 0)

  new ScrollTrigger({
    animation: parallax,
    scroller: '[data-scroll-container]',
    trigger: ourProjects,
    scrub: 1.8,
    start: 'center center',
    end: '+=800 top',
    onUpdate(scroll) {
      if (scroll.progress >= 0.15) fadeUp.resume()
    }
  })
}()