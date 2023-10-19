import { TextWithAnimation } from 'features/animations/text'

const options: IntersectionObserverInit = {
  threshold: 0.2,
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return

    if (entry.target.classList.contains('text-appearing')) {
      (entry.target as TextWithAnimation).playAnimation()
    }

    entry.target.classList.add('_animation')
  })
}, options)

window.addEventListener('DOMContentLoaded', () => {
  if (matchMedia('(max-width: 1200px)').matches) return
    const animationElements = document.querySelectorAll('._with-animation, .text-appearing')

  animationElements.forEach(el => {
    el.classList.add('_init-animation')
    observer.observe(el)
  })
})