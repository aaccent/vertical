import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

void function () {
  const blog = document.querySelector('.blog')
  if (!blog || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .from('.blog .title', {
      duration: 0.7,
      opacity: 0,
      translateY: '150%',
    }, 0)
    .from('.blog__title', {
      duration: 0.7,
      opacity: 0,
      translateY: '70%',
    }, 0)
    .from('.blog__button', {
      duration: 0.7,
      opacity: 0,
      translateY: '150%',
    }, 0)

  blog.querySelectorAll('.news-card').forEach(card => {
    animation
      .from(card.querySelector('.news-card__line'), {
        duration: 1.2,
        width: 0,
      }, '>-0.3')
      .from(card.querySelector('img'), {
        duration: 1,
        scale: 1.5,
        opacity: 0,
        onComplete() {
          card.querySelector('img')!.style.transition = 'transform .3s linear'
        }
      }, '<0')
      .from(card.querySelector('.news-card__title span'), {
        duration: 1,
        translateY: '70%',
        opacity: 0,
      }, '<0')
      .from(card.querySelector('.news-card__date'), {
        duration: 1,
        translateY: '45%',
        opacity: 0,
      }, '<0')
      .from(card.querySelector('.news-card__text'), {
        duration: 1,
        translateY: '45%',
        opacity: 0,
      }, '<0.25')
  })

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: blog,
    start: `top+=35% bottom`,
  })

  const fadeUp = gsap.from('.blog .seo-block', {
    duration: 1,
    translateY: '35%',
    opacity: 0,
  })

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation: fadeUp,
    trigger: '.blog .seo-block',
    start: `center bottom`,
  })
}()