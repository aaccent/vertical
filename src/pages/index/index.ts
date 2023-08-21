import anime from 'animejs/lib/anime.es.js'
import Swiper from 'swiper'

const swiper = new Swiper('.lead-section__swiper', {
  allowTouchMove: false,
  initialSlide: 2,
})

let startX = 0 as number
let isAnimating = [false]
let isPressed = false
const leadSection = document.querySelector('.lead-section') as HTMLElement

const setRelativeStyle = (target: HTMLElement, percent: number, translate = 'translateX', opacity = 0.7) => {
  target.style.transform = `${translate}(${150 * percent}px)`
  target.dataset.pos = (50 * percent).toString()

  if (Math.abs(percent * 100) > 25) {
    target.style.opacity = (opacity - opacity * Math.abs(percent)).toString() as string
  }
}

const setRelativeAnimation = (target: HTMLElement, animeProps: object) => {
  target.style.transform = ''
  const animation = anime({ targets: target, duration: 150, easing: 'easeOutQuad', ...animeProps })
  return animation
}

const checkAnimating = (animating: any) => animating.some((v: any) => v === true)

console.log(document.body)

leadSection.addEventListener('mousedown', (e) => {
  e.preventDefault()
  startX = e.clientX
  isPressed = true
})

leadSection.addEventListener('mousemove', (e) => {
  if (checkAnimating(isAnimating)) return
  if (!isPressed) return

  const diff = e.clientX - startX
  const percent = diff / (window.innerWidth)
  console.log(percent);
  
  const text = swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__text') as HTMLElement
  const title = swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__title') as HTMLElement
  const button = swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__button') as HTMLElement
  const image = swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__image') as HTMLElement

  setRelativeStyle(title, percent)
  if (percent * 100 > 20) {
    setRelativeStyle(text, percent - 20 / 100)
  } else if (percent * 100 < -20) {
    setRelativeStyle(text, percent + 20 / 100)
  }
  setRelativeStyle(button, Math.abs(percent), 'translateY', 1)
  setRelativeStyle(image, Math.abs(percent), 'translateY', 1)
})

leadSection.addEventListener('mouseup', (e) => {
  if (checkAnimating(isAnimating)) return

  const diff = e.clientX - startX

  isPressed = false
  if (Math.abs(diff) < 1) {
    return
  }
  startX = 0

  let percent = Math.abs((diff / (window.innerWidth - startX)) * 100)

  const elements = {
    text: swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__text') as HTMLElement,
    title: swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__title') as HTMLElement,
    button: swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__button') as HTMLElement,
    image: swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__image') as HTMLElement,
  }
  Object.values(elements).forEach((el) => {
    el.style.transform = ``
  })

  const animeEl = [] as any

  animeEl.push(setRelativeAnimation(elements.text, { translateX: [elements.text.dataset.pos, 0], opacity: 0.7 }))
  animeEl.push(setRelativeAnimation(elements.title, { translateX: [elements.title.dataset.pos, 0], opacity: 1 }))
  animeEl.push(setRelativeAnimation(elements.button, { translateY: [elements.button.dataset.pos, 0], opacity: 1 }))
  animeEl.push(setRelativeAnimation(elements.image, { translateY: [elements.image.dataset.pos, 0], opacity: 1 }))

  if (percent > 80) {
    isAnimating = Array(Object.values(elements).length).fill(true)
    Object.values(elements).forEach((_, index) => {
      if (animeEl[index] === undefined) return
      animeEl[index].play()
      animeEl[index].finished.then(() => {
        isAnimating[index] = false
      })
    })
    return
  }
})
