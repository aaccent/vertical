import { circleNav, circleNavInit } from './circle'

const swiperNavEvents = (swiperAnim: any) => {
  circleNav(swiperAnim)
}

const swiperNavInit = (swiperAnim: any) => {
  circleNavInit(swiperAnim)
}

export { swiperNavInit, swiperNavEvents }
