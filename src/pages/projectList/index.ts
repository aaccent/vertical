import 'components/ui/quickFilter'
import 'components/pageBlocks/filter'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { adaptiveValue } from 'features/adaptive'

void function () {
  const projects = document.querySelector('.project__list')
  if (!projects || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .fromTo('.project__list__row:nth-child(odd) .project__list__item:last-child, .project__list__row:nth-child(even) .project__list__item:first-child', {
      y: adaptiveValue(30) * -1,
    }, {
      y: adaptiveValue(30),
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