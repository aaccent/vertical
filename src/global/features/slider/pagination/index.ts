import { createCircleSVG, renderArc, renderFilledArc } from 'features/arcProgress'
import { adaptiveValue } from 'features/adaptive'
import { Slider } from 'features/slider'
import { CustomSwiper } from 'features/slider/customSwiper'

export interface SliderPagination extends HTMLElement {
  changeCircle: (angle: number) => void
  setCount: (num: number) => void
  setCurrentNum: (value: number) => void
}

function createBtn(action: string, handler: () => void) {
  const btn = document.createElement('button')
  btn.className = 'slider-pagination__btn'
  btn.type = 'button'
  btn.dataset.action = action
  btn.onclick = handler
  return btn
}

function createInner() {
  const inner = document.createElement('div')
  inner.className = 'slider-pagination__inner'

  const count = document.createElement('span')
  count.className = 'slider-pagination__all-pages'

  const current = document.createElement('span')
  current.className = 'slider-pagination__current-num'

  inner.append(count, current)

  return { inner, count, current }
}

function createDesktopPagination(slidesCount: number) {
  const { inner, count, current } = createInner()
  const circle = createCircleSVG('slider-pagination__svg')

  inner.prepend(circle.svg)
  renderArc(circle.path, 0, adaptiveValue(63))

  count.innerText = String(slidesCount)
  current.innerText = '1'

  function circleHandler(angle: number) {
    requestAnimationFrame(() => {
      renderArc(circle.path, angle, adaptiveValue(63))
    })
  }

  function countHandler(num: number) {
    count.innerText = String(num)
  }

  function numHandler(value: number) {
    current.innerText = String(value)

    current.classList.remove('_animation')
    current.classList.add('_init-animation')
    setTimeout(() => current.classList.add('_animation'), 25)
  }

  return { inner, countHandler, numHandler, circleHandler }
}

const MOBILE_PAGES_LIMIT = 5

function createMobilePagination(slides: any[]) {
  const mobileContainer = document.createElement('div')
  mobileContainer.className = 'slider-pagination__mobile-list'

  slides.slice(0, MOBILE_PAGES_LIMIT).forEach((_, index) => {
    const circle = createCircleSVG('slider-pagination__mobile-dot')
    renderFilledArc(circle.path, 0, adaptiveValue(1.75))

    if (index === 0) {
      circle.svg.classList.add('_white')
    }

    if (index + 1 === MOBILE_PAGES_LIMIT) {
      circle.svg.classList.add('_small')
    }

    mobileContainer.append(circle.svg)
  })

  function circleHandler(angle: number, currentSlidePos: number) {
    const currentIsLast = currentSlidePos + 1 > MOBILE_PAGES_LIMIT
    const currentIndex = currentIsLast ? MOBILE_PAGES_LIMIT - 1 : currentSlidePos
    const targetItem = mobileContainer.children.item(currentIndex)

    if (!targetItem) return

    renderFilledArc(targetItem.firstElementChild as HTMLElement, angle, 1.75)

  }

  function numHandler(value: number, previousSlidePos: number) {
    const currentIsLast = value + 1 > MOBILE_PAGES_LIMIT
    const previousIsLast = previousSlidePos + 1 > MOBILE_PAGES_LIMIT
    const currentIndex = currentIsLast ? MOBILE_PAGES_LIMIT - 1 : value
    const previousIndex = previousIsLast ? MOBILE_PAGES_LIMIT - 1 : previousSlidePos

    const targetItem = mobileContainer.children.item(currentIndex)
    const prevItem = mobileContainer.children.item(previousIndex)

    if (!targetItem) return

    targetItem.classList.add('_white')

    if (prevItem && targetItem !== prevItem && (!currentIsLast || !previousIsLast)) {
      prevItem.classList.remove('_white')
      renderFilledArc(prevItem.firstElementChild as HTMLElement, 0, 1.75)
    }

    renderFilledArc(targetItem.firstElementChild as HTMLElement, 0, 1.75)
  }

  return { mobileContainer, numHandler, circleHandler }
}

interface SliderForPagination {
  slides: any[]
  get currentSlidePos(): number
  get previousSlidePos(): number
  slideBack: () => void
  slideNext: () => void
}

export function createPagination(container: HTMLElement, slider: SliderForPagination) {
  const pagination = container as SliderPagination

  const desktopPagination = createDesktopPagination(slider.slides.length)
  const mobilePagination = createMobilePagination(slider.slides)

  pagination.append(desktopPagination.inner, mobilePagination.mobileContainer)

  pagination.changeCircle = function (angle: number) {
    desktopPagination.circleHandler(angle)
    mobilePagination.circleHandler(angle, slider.currentSlidePos)
  }

  pagination.setCount = function (num: number) {
    desktopPagination.countHandler(num)
  }

  pagination.setCurrentNum = function (value: number) {
    desktopPagination.numHandler(value)
    mobilePagination.numHandler(value, slider.previousSlidePos)
  }

  pagination.prepend(createBtn('slide-prev', () => slider.slideBack()))
  pagination.append(createBtn('slide-next', () => slider.slideNext()))

  return pagination
}

export function createSliderPagination(slider: Slider<any, any>) {
  if (!slider.container) return null

  let container: SliderPagination | null

  if (slider.options.pagination && typeof slider.options.pagination === 'object') {
    container = document.querySelector<SliderPagination>(slider.options.pagination.el)
  } else {
    container = slider.container.querySelector<SliderPagination>('.slider-pagination')
  }

  if (!container) throw new Error('For creating pagination need add .slider-pagination element')

  const sliderForPagination: SliderForPagination = {
    slides: slider.slides,
    get currentSlidePos() {
      return slider.currentSlide?.position || -1
    },
    get previousSlidePos() {
      return slider.previousSlide?.position || -1
    },
    slideBack: () => slider.slideBack.call(slider),
    slideNext: () => slider.slideNext.call(slider),
  }

  return createPagination(container, sliderForPagination)
}

export function createSwiperPagination(container: HTMLElement | null, swiper: CustomSwiper) {
  if (!container) return

  const sliderForPagination: SliderForPagination = {
    slides: swiper.slides,
    get currentSlidePos() {
      return swiper.realIndex
    },
    get previousSlidePos() {
      return swiper.realPreviousIndex
    },
    slideBack: () => swiper.slidePrev.call(swiper),
    slideNext: () => swiper.slideNext.call(swiper),
  }

  const pagination = createPagination(container, sliderForPagination)

  swiper.on('slideChange', (swiper) => {
    pagination.setCurrentNum(swiper.realIndex)
  })

  swiper.on('autoplayTimeLeft', (swiper, _, percent) => {
    pagination.changeCircle(360 - 360 * percent)
  })
}