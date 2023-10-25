import { createCircleSVG, renderArc, renderFilledArc } from 'features/arcProgress'

import { adaptiveValue } from 'features/adaptive'
import { Slider } from 'features/slider'
import Swiper from 'npm/swiper'

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

function createDesktopPagination(slider: Slider<any, any>) {
  const { inner, count, current } = createInner()
  const circle = createCircleSVG('slider-pagination__svg')

  inner.prepend(circle.svg)
  renderArc(circle.path, 0, adaptiveValue(63))

  count.innerText = String(slider.slides.length)
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

const PAGES_CIRCLES = 5

function createMobilePagination(slider: Slider<any, any>) {
  const mobileContainer = document.createElement('div')
  mobileContainer.className = 'slider-pagination__mobile-list'

  slider.slides.slice(0, PAGES_CIRCLES).forEach((_: any, index: number) => {
    const circle = createCircleSVG('slider-pagination__mobile-dot')
    renderFilledArc(circle.path, 0, adaptiveValue(1.75))

    if (index === 0) {
      circle.svg.classList.add('_white')
    }

    if (index + 1 === PAGES_CIRCLES) {
      circle.svg.classList.add('_small')
    }

    mobileContainer.append(circle.svg)
  })

  function circleHandler(angle: number) {
    const currentIsLast = slider.currentSlide.position + 1 > PAGES_CIRCLES
    const currentIndex = currentIsLast ? PAGES_CIRCLES - 1 : slider.currentSlide.position
    const targetItem = mobileContainer.children.item(currentIndex)

    if (!targetItem) return

    renderFilledArc(targetItem.firstElementChild as HTMLElement, angle, 1.75)

  }

  function numHandler(value: number) {
    const currentIsLast = slider.currentSlide.position + 1 > PAGES_CIRCLES
    const previousIsLast = slider.previousSlide?.position + 1 > PAGES_CIRCLES
    const currentIndex = currentIsLast ? PAGES_CIRCLES - 1 : slider.currentSlide.position
    const previousIndex = previousIsLast ? PAGES_CIRCLES - 1 : slider.previousSlide?.position

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

export function createPagination(slider: Slider<any, any>) {
  if (!slider.container) return null

  let container: SliderPagination | null

  if (slider.options.pagination && typeof slider.options.pagination === 'object') {
    container = document.querySelector<SliderPagination>(slider.options.pagination.el)
  } else {
    container = slider.container.querySelector<SliderPagination>('.slider-pagination')
  }

  if (!container) throw new Error('For creating pagination need add .slider-pagination element')

  const desktopPagination = createDesktopPagination(slider)
  const mobilePagination = createMobilePagination(slider)

  container.append(desktopPagination.inner, mobilePagination.mobileContainer)

  container.changeCircle = function (angle: number) {
    desktopPagination.circleHandler(angle)
    mobilePagination.circleHandler(angle)
  }

  container.setCount = function (num: number) {
    desktopPagination.countHandler(num)
  }

  container.setCurrentNum = function (value: number) {
    desktopPagination.numHandler(value)
    mobilePagination.numHandler(value)
  }

  container.prepend(createBtn('slide-prev', () => slider.slideBack.call(slider)))
  container.append(createBtn('slide-next', () => slider.slideNext.call(slider)))

  return container
}