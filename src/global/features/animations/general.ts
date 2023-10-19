import { TextWithAnimation } from 'features/animations/text'
import { NumbersWithAnimation } from 'features/animations/numbers'

const options: IntersectionObserverInit = {
  threshold: 0.2,
}

type ElementWithAnimation = NumbersWithAnimation | TextWithAnimation

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return

    if (/(number-animation|text-appearing)/.test(entry.target.className)) {
      (entry.target as ElementWithAnimation).playAnimation()
    }

    entry.target.classList.add('_animation')
  })
}, options)

window.addEventListener('DOMContentLoaded', () => {
  if (matchMedia('(max-width: 1200px)').matches) return
    const animationElements = document.querySelectorAll('._with-animation, .text-appearing, .number-animation')

  animationElements.forEach(el => {
    el.classList.add('_init-animation')
    observer.observe(el)
  })
})