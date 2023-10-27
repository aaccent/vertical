import Swiper from 'npm/swiper'

export interface CustomSwiper extends Swiper {
  realPreviousIndex: number
}

export function initCustomSwiper(swiper: Swiper): CustomSwiper {
  const customSwiper = swiper as CustomSwiper

  swiper.on('beforeSlideChangeStart', swiper => {
    customSwiper.realPreviousIndex = swiper.realIndex
  })

  return customSwiper
}