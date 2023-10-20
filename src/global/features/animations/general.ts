import { TextWithAnimation } from 'features/animations/text'
import { NumbersWithAnimation } from 'features/animations/numbers'

const options: IntersectionObserverInit = {
  threshold: 0.2,
}

type ElementWithAnimation = NumbersWithAnimation | TextWithAnimation

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return

    entry.target.querySelectorAll('.text-appearing, .number-animation').forEach(item => {
      (item as ElementWithAnimation).playAnimation()
    })

    if ((entry.target as HTMLElement).dataset.delay) {
      const delay = Number((entry.target as HTMLElement).dataset.delay || 0)
      setTimeout(() => entry.target.classList.add('_animation'), delay)
      return
    }

    entry.target.classList.add('_animation')
  })
}, options)

window.addEventListener('DOMContentLoaded', () => {
  if (matchMedia('(max-width: 1200px)').matches) return
    const animationElements = document.querySelectorAll('._with-animation')

  animationElements.forEach(el => {
    el.classList.add('_init-animation')
    observer.observe(el)
  })
})