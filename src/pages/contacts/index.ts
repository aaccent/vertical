import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { afterLoader } from 'features/animations/page-loader'

// Animations
void function () {
  const contacts = document.querySelector('.contacts')
  if (!contacts) return

  const animation = gsap.timeline({ paused: true })
    .textAppearing('.contacts__title', {})
    .from('.contacts__title', {
      duration: 3,
      '--after-width': '0%',
    }, '<0.4')
    .fadeUp('.contacts__image', {
      yPercent: 15,
      opacity: 0,
      onComplete() {
        const animation = gsap.to('.contacts__image', {
          yPercent: 10,
        })

        new ScrollTrigger({
          
          animation,
          trigger: contacts,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        })
      },
    }, '<0')
    .fadeUp('.contacts__info', {}, '<0.4')
    .fadeUp('.contacts__position__button', { yPercent: 120 }, '<0')
    .fadeUp('.contacts__call__phone', {}, '<0.2')
    .fadeUp('.contacts__call__email', {}, '<0.2')

  afterLoader(() => animation.resume())
}()