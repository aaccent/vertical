import 'components/ui/quickFilter'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { afterLoader } from 'features/animations/page-loader'

// Animations
void function () {
  const pressCenter = document.querySelector('.press-center__header')
  if (!pressCenter) return

  const animation = gsap.timeline({ paused: true })
    .textAppearing('.press-center__title', {})
    .fadeUp('.press-center__quick-filter__desktop', { yPercent: 120 }, '<0')

  afterLoader(() => animation.resume())

  document.querySelectorAll('.press-center__month-divider').forEach(item => {
    const q = gsap.utils.selector(item)

    const animation = gsap.timeline({ paused: true })
      .fadeUp(q('.title'), { yPercent: 150 })
      .fadeUp(item, {
        duration: 1.5,
        yPercent: 10,
      }, '<0')
      .from(item, {
        duration: 2.5,
        '--before-width': '0%',
      }, '<0')
      .fade(q('.news-card__image'), {}, '<0.4')
      .from(q('.news-card__image img'), {
        duration: 1,
        scale: 1.3,
      }, '<0')
      .textAppearing(q('.news-card__title'), {}, '<0')
      .fadeUp(q('.news-card__date'), {}, '<0')
      .from(q('.news-card'), {
        duration: 1.2,
        '--after-width': '0%',
      }, '<0.4')
      .fadeUp(q('.news-card__text'), {}, '<0')

    afterLoader(() => {
      new ScrollTrigger({
        scroller: '[data-scroll-container]',
        animation,
        trigger: item,
        start: 'top+=10% center+=25%',
      })
    })
  })
}()