import { renderArc } from 'features/arcProgress'

import { createCircleSVG } from 'pages/index/createSVGCircle'

export interface CirclePagination extends HTMLElement {
  changeCircle: (angle: number) => void
  setCount: (num: number) => void
  setCurrentNum: (value: number) => void
}

export function initCirclePagination(item: CirclePagination) {
  const inner = item.querySelector('.circle-pagination__inner') as HTMLElement
  const svg = createCircleSVG('circle-pagination__svg')
  inner.prepend(svg.svg)
  renderArc(svg.path, 0, 63)

  item.changeCircle = function (angle: number) {
    renderArc(svg.path, angle, 63)
  }

  const count = item.querySelector('.circle-pagination__all-pages') as HTMLElement
  const currentNum = item.querySelector('.circle-pagination__current-num') as HTMLElement

  count.innerText = '1'
  currentNum.innerText = '1'

  item.setCount = function (num: number) {
    count.innerText = String(num)
  }

  item.setCurrentNum = function (value: number) {
    currentNum.innerText = String(value)

    currentNum.classList.remove('_animation')
    currentNum.classList.add('_init-animation')
    setTimeout(() => currentNum.classList.add('_animation'), 25)
  }
}