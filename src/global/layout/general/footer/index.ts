import 'features/popup/index'
import { isMobile } from 'features/adaptive'
import { scroll } from 'features/animations/scroll'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

void function () {
  const contactForm = document.querySelector<HTMLElement>('.contact-form')
  const blog = document.querySelector<HTMLElement>('.blog')
  if (!contactForm || !blog || document.querySelector('.project')) return

  const contactFormBg = contactForm.querySelector('.contact-form__bg') as HTMLElement
  blog.style.marginBottom = `${contactForm.offsetHeight * -1}px`
  contactFormBg.style.scale = '1.1'

  window.addEventListener('load', () => {
    const animation = gsap.timeline()
      .pause()
      .textAppearing('.contact-form__title', {
        onStart() {
          contactForm.classList.add('_gsap-animation')
        },
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
        },
      }, '<+=0.1')
      .fadeUp('.contact-form__bottom', {}, '<.6')

    new ScrollTrigger({
      trigger: contactForm,
      start: `center center`,
      end: `+=${contactForm.offsetHeight} center`,
      pin: true,
      scrub: 0,
      markers: true,
      onUpdate(self) {
        if (self.progress >= 0.84) animation.play()
      },
    })

    const targetElement = document.querySelector('[data-scroll-container]')

    if (targetElement) {
      const resizeObserver = new ResizeObserver(entries => {
        requestAnimationFrame(() => {
          for (let entry of entries) {
            ScrollTrigger.refresh()
          }
        })
      })

      resizeObserver.observe(targetElement)
    }
  })
}

void function () {
  const footer = document.querySelector('.footer')
  if (!footer) return

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

    animation,
    trigger: footer,
    start: `top+=35% bottom`,
  })
}()