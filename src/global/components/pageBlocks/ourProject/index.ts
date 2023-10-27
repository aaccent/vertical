import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void function() {
  const ourProjects = document.querySelector('.our-projects')
  if (!ourProjects || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .fadeUp('.our-projects .title', { yPercent: 100 }, 0)
    .textAppearing('.our-projects__title', {
    }, '<0.2')
    .fade('.our-projects__middle-image', {
      duration: .7,
      opacity: 0,
    }, '>-0.1')
    .from('.our-projects__right', {
      duration: .7,
      opacity: 0,
    }, '<0.3')

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: ourProjects,
    start: 'top+=35% bottom',
  })

  const parallax = gsap.timeline()
    .to('.our-projects__middle-image', { yPercent: 8 }, 0)
    .to('.our-projects__right', { yPercent: 35 }, 0)

  const fadeUp = gsap.timeline()
    .pause()
    .fadeUp('.our-projects__text', {}, 0)
    .fadeUp('.our-projects__button', { yPercent: 150 }, 0)

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