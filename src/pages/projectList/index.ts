import 'components/ui/quickFilter'
import 'components/pageBlocks/filter'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

void function () {
  const projects = document.querySelector('.project__list')
  if (!projects || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .fromTo('.project__list__row:nth-child(even) .project__list__item:last-child, .project__list__row:nth-child(odd) .project__list__item:first-child', {
      width: '52%',
    }, {
      width: '100%',
      height: 485,
    }, 0)
    .to('.project__list__row:nth-child(odd) .project__list__item:last-child, .project__list__row:nth-child(even) .project__list__item:first-child', {
      width: '100%',
      height: 485,
    }, 0)

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: projects,
    start: 'top center',
    end: 'bottom+=25% center',
    scrub: 1,
  })
}()