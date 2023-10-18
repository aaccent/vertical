interface RawSlide extends HTMLElement {
  dataset: {
    subtitle?: string
    title?: string
    link?: string
    linkText?: string
  } & {
    [index: string]: string
  }
}

interface Slide extends RawSlide {
  img: HTMLImageElement
  position: number
  dataset: RawSlide['dataset'] & {
    maxWidth: string
  }
  startSlideAnimation: () => void
}

const subtitleContainer = document.querySelector('.hero-index__text-subtitle')
const titleContainer = document.querySelector('.hero-index__text-title')
const link = document.querySelector<HTMLAnchorElement>('a.hero-index__link')

function setSlideText(slide: RawSlide | Slide) {
  if (!subtitleContainer || !titleContainer || !link) return

  if (!slide.dataset.title) {
    return console.error('Slide on main page must have [data-title]. Slide:\n', slide)
  }

  titleContainer.innerHTML = slide.dataset.title

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
}

function createSlider() {
  const slidesEls = document.querySelectorAll<RawSlide>('.hero-index__img-wrapper')
  let previousSlide: Slide
  let activeSlide: Slide
  const slides: Slide[] = []

  const SCALE_ANIMATION = 1500
  const MAX_WIDTH_ANIMATION = 700
  const SCALE = '1.4'

  const AUTOPLAY_TIME = 3000
  const STEP = 1 / AUTOPLAY_TIME * 3
  let slideProgress = 0
  let autoplayInterval: number

  function init() {
    setSlideText(slidesEls[0])

    slidesEls.forEach((slide, index) => {
      const img = slide.querySelector('img') as HTMLImageElement

      img.style.scale = SCALE
      setTimeout(() => img.style.transition = `scale ${SCALE_ANIMATION}ms ease-in-out`, 5)
      const maxWidth = `${slide.offsetWidth}px`
      slide.dataset.maxWidth = maxWidth
      slide.style.maxWidth = index < 2 ? maxWidth : '0px'

      function startSlideAnimation() {
        slide.style.maxWidth = '0'
        setTimeout(() => (img.style.scale = SCALE), MAX_WIDTH_ANIMATION)
      }

      const _slide: Slide = slide as Slide
      _slide.img = img
      _slide.position = index
      _slide.startSlideAnimation = startSlideAnimation

      slides.push(_slide)
    })

    Array
      .from(slidesEls)
      .reverse()
      .forEach((slide, i) => slide.style.zIndex = String(i))

    previousSlide = slides[0]
    activeSlide = slides[0]
    setTimeout(() => {
      slides[0].img.style.scale = '1'
      startAutoplay()
    }, MAX_WIDTH_ANIMATION)
  }

  function checkNewIndex(newIndex: number) {
    if (newIndex > slides.length - 1) return 0
    if (newIndex < 0) return slides.length - 1
    return newIndex
  }

  function setSlide(index: number) {
    activeSlide = slides[index]
    previousSlide.startSlideAnimation()
    previousSlide = slides[index]

    setTimeout(() => {
      slides[index].img.style.scale = '1'
      setSlideText(slides[index])
      setTimeout(startAutoplay, SCALE_ANIMATION)
    }, MAX_WIDTH_ANIMATION)

    const nextIndex = checkNewIndex(index + 1)

    slides[nextIndex].style.maxWidth = slides[nextIndex].dataset.maxWidth
  }

  function nextSlide() {
    setSlide(checkNewIndex(activeSlide.position + 1))
  }

  function prevSlide() {
    setSlide(checkNewIndex(activeSlide.position - 1))
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      if (slideProgress >= 1) {
        clearInterval(autoplayInterval)
        slideProgress = 0
        nextSlide()
      }

      slideProgress += STEP
    }, 1)
  }

  return {
    init,
    setSlide,
    slides,
    nextSlide,
    prevSlide,
  }
}

const slider = createSlider()
slider.init()