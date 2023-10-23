import { initTextAnimation, TextWithAnimation } from 'features/animations/text'
import { createSlider, Slide } from 'features/slider'

interface RawImgSlide extends HTMLElement {
  dataset: {
    subtitle?: string
    title?: string
    link?: string
    linkText?: string
  } & {
    [index: string]: string
  }
}

interface ImgSlide extends RawImgSlide, Slide {
  img: HTMLImageElement
  dataset: RawImgSlide['dataset'] & {
    maxWidth: string
  }
  startSlideAnimation: () => void
}

const textBlock = document.querySelector('.hero-index__text-block') as HTMLElement

const subtitleContainer = document.querySelector('.hero-index__text-subtitle')
const titleContainer = document.querySelector<TextWithAnimation>('.hero-index__text-title')
const link = document.querySelector<HTMLAnchorElement>('a.hero-index__link')

function setSlideText(slide: RawImgSlide | ImgSlide) {
  if (!subtitleContainer || !titleContainer || !link) return

  if (!slide.dataset.title) {
    return console.error('Slide on main page must have [data-title]. Slide:\n', slide)
  }

  titleContainer.innerHTML = slide.dataset.title
  initTextAnimation(titleContainer)
  textBlock.classList.add('_animation-prepare')
  textBlock.classList.remove('_animation-start')

  if (slide.dataset.subtitle) subtitleContainer.innerHTML = slide.dataset.subtitle

  if ((slide.dataset.link || slide.dataset.linkText) && (!slide.dataset.link || !slide.dataset.linkText)) {
    const prop = Boolean(slide.dataset.link) ? '[data-link]' : '[data-link-text]'
    const otherProp = !Boolean(slide.dataset.link) ? '[data-link]' : '[data-link-text]'
    return console.error(`Slide has ${prop}, but doesnt have ${otherProp}. Slide: \n`, slide)
  }

  if (slide.dataset.link && slide.dataset.linkText) {
    link.href = slide.dataset.link
    link.innerHTML = slide.dataset.linkText
  }

  setTimeout(() => {
    titleContainer!.playAnimation?.()
    textBlock.classList.add('_animation-start')
  }, 25)
}

createSlider<RawImgSlide, ImgSlide>({
  container: '.hero-index__images',
  autoplayTime: 3000,
  pagination: {
    el: '.hero-index .slider-pagination'
  },
  handlers: {
    beforeInitSlide(rawSlide) {
      (rawSlide as ImgSlide).dataset.maxWidth = `${rawSlide.offsetWidth}px`
      rawSlide.style.maxWidth = `${rawSlide.offsetWidth}px`
    },
    afterInit(slider) {
      setSlideText(slider.slides[0])
    },
    onSlideChange(slider) {
      setSlideText(slider.currentSlide!)
    },
  }
})