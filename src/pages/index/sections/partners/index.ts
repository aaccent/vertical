import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void function () {
  const partners = document.querySelector('.partners')
  if (!partners || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .from('.partners__title span > span', {
      duration: 1,
      translateY: '80%',
      opacity: 0,
    }, 0)
    .from('.partners .title', {
      duration: 1,
      translateY: '130%',
      opacity: 0,
    }, 0)
    .from('.partners__desktop__container', {
      duration: 1,
      opacity: 0,
      translateY: '35%',
    }, 1)
    .from('.partners__desktop__line', {
      duration: 2.6,
      scaleX: 0,
      ease: 'power1.out'
    }, 1.2)

  const bordersTop = partners.querySelectorAll('.border.border__top')
  partners.querySelectorAll('.border.border__bottom').forEach((bottomLine, index) => {
    animation
      .from(bordersTop[index], {
        duration: .3,
        scaleY: 0,
      }, '<+=0.05')
      .from(bottomLine, {
        duration: .3,
        height: 0
      }, '>-0')
  })

  new ScrollTrigger({
    animation,
    scroller: '[data-scroll-container]',
    trigger: partners,
    start: 'top+=35% bottom',
  })
}()