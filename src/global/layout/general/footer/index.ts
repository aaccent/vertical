import "features/popup/index"
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

void function () {
  const contactForm = document.querySelector<HTMLElement>('.contact-form')
  if (!contactForm || matchMedia('(max-width: 1200px)').matches) return

  const contactFormBg = contactForm.querySelector('.contact-form__bg') as HTMLElement

  contactForm.style.translate = '0% -100%'
  contactFormBg.style.scale = '1.1'

  const animation = gsap.timeline()
    .pause()
    .from('.contact-form__title span > span', {
      duration: 1,
      opacity: 0,
      translateY: '70%',
      onStart() {
        contactForm.classList.add('_gsap-animation')
      }
    })
    .from('.contact-form__container', {
      duration: 1,
      width: 0,
    })
    .from('.contact-form__container .span', {
      duration: 1,
      opacity: 0,
      translateY: '100%',
      onComplete() {
        contactForm.classList.remove('_gsap-animation')
      }
    }, '<+=0.1')
    .from('.contact-form__bottom', {
      duration: 1,
      opacity: 0,
      translateY: '35%',
    })

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    trigger: contactForm,
    start: `bottom-=${contactForm.offsetHeight} top`,
    end: `bottom top`,
    scrub: 0,
    onUpdate (self) {
      contactForm.style.translate = `0% -${100 - 100 * self.progress}%`
      contactFormBg.style.scale = String(1.1 - self.progress / 10)
      if (self.progress >= 0.84) animation.play()
    },
  })
}()

void function () {
  const footer = document.querySelector('.footer')
  if (!footer || matchMedia('(max-width: 1200px)').matches) return

  const animation = gsap.timeline()
    .from('.footer__title span', {
      duration: 1,
      translateY: '70%',
      opacity: 0,
    })
    .from('.footer__logo', {
      duration: .7,
      translateY: '35%',
      opacity: 0,
    }, '>-0')
    .from('.footer__content__middle p', {
      duration: .7,
      translateY: '45%',
      opacity: 0,
    }, '<0')
    .from('.footer__link', {
      duration: .7,
      translateY: '35%',
      opacity: 0,
    }, '<0')
    .from('.footer__content__middle span', {
      duration: .7,
      translateY: '100%',
      opacity: 0,
    }, '>-0')
    .from('.footer__bottom', {
      duration: .7,
      translateY: '35%',
      opacity: 0,
    }, '<0.4')
    .from('.footer__line', {
      duration: 1.3,
      width: 0,
    }, '<0')

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation,
    trigger: footer,
    start: `top+=35% bottom`,
  })
}()