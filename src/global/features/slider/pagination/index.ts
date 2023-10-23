import { createCircleSVG, renderArc } from 'features/arcProgress'

import { adaptiveValue } from 'features/adaptive'
import { Slider } from 'features/slider'

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

export function createPagination(slider: Slider<any, any>) {
  if (!slider.container) return null

  let container: SliderPagination | null

  if (slider.options.pagination && typeof slider.options.pagination === 'object') {
    container = document.querySelector<SliderPagination>(slider.options.pagination.el)
  } else {
    container = slider.container.querySelector<SliderPagination>('.slider-pagination')
  }

  if (!container) throw new Error('For creating pagination need add .slider-pagination element')

  const { inner, count, current } = createInner()
  const circle = createCircleSVG('slider-pagination__svg')

  container.append(inner)

  inner.prepend(circle.svg)
  renderArc(circle.path, 0, adaptiveValue(63))
  container.changeCircle = function (angle: number) {
    requestAnimationFrame(() => {
      renderArc(circle.path, angle, adaptiveValue(63))
    })
  }

  count.innerText = String(slider.slides.length)
  current.innerText = '1'

  container.setCount = function (num: number) {
    count.innerText = String(num)
  }

  container.setCurrentNum = function (value: number) {
    current.innerText = String(value)

    current.classList.remove('_animation')
    current.classList.add('_init-animation')
    setTimeout(() => current.classList.add('_animation'), 25)
  }

  container.prepend(createBtn('slide-prev', () => slider.slideBack.call(slider)))
  container.append(createBtn('slide-next', () => slider.slideNext.call(slider)))

  return container
}