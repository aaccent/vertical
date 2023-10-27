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
    .textAppearing('.contact-form__title', {
      onStart() {
        contactForm.classList.add('_gsap-animation')
      }
    })
    .from('.contact-form__container', {
      duration: .8,
      width: 0,
    }, '<0.4')
    .from('.contact-form__container .span', {
      duration: .8,
      opacity: 0,
      yPercent: 100,
      onComplete() {
        contactForm.classList.remove('_gsap-animation')
      }
    }, '<+=0.1')
    .fadeUp('.contact-form__bottom', {}, '<.6')

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    trigger: contactForm,
    start: `top top`,
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
    .textAppearing('.footer__title', {})
    .fadeUp('.footer__logo', {}, '>-0.35')
    .fadeUp('.footer__content__middle p', {}, '<0')
    .fadeUp('.footer__link', {}, '<0')
    .fadeUp('.footer__content__middle span', {
      yPercent: 100,
    }, '<0.4')
    .fadeUp('.footer__bottom', {}, '<0.4')
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