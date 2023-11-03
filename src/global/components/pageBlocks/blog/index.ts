import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { isMobile } from 'features/adaptive'

void function () {
  const blog = document.querySelector('.blog')
  if (!blog || isMobile) return

  const animation = gsap.timeline()
    .fadeUp('.blog .title', { yPercent: 150 }, 0)
    .textAppearing('.blog__title', {}, 0)
    .fadeUp('.blog__button', { yPercent: 150 }, 0)
    .from('.blog__header', {
      duration: 1.2,
      '--after-width': '0%',
    }, '<0')

  blog.querySelectorAll('.news-card').forEach(card => {
    animation
      .from(card.querySelector('.news-card'), {
        duration: 1.2,
        '--after-width': '0%',
      }, '>-0.3')
      .from(card.querySelector('img'), {
        duration: 1,
        scale: 1.5,
        opacity: 0,
        onComplete() {
          card.querySelector('img')!.style.transition = 'transform .3s linear'
        }
      }, '<0')
      .fadeUp(card.querySelector('.news-card__title span'), { yPercent: 70 }, '<0')
      .fadeUp(card.querySelector('.news-card__date'), {}, '<0')
      .fadeUp(card.querySelector('.news-card__text'), {}, '<0.25')
  })

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: blog,
    start: `top+=35% bottom`,
  })

  const fadeUp = gsap.timeline().fadeUp('.blog .seo-block', {})

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation: fadeUp,
    trigger: '.blog .seo-block',
    start: `center bottom`,
  })
}()