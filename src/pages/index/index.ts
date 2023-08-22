import anime from 'animejs/lib/anime.es.js'
import Swiper from 'swiper'
import initFancySwiper from 'global/features/fancySwiper'

initFancySwiper('lead-section', {
  swiperAnim: {
    startX: 0,
    isAnimating: [false],
    isPressed: false,
    parent: document.querySelector('.lead-section') as HTMLElement,
    el: [
      {
        name: 'text',
        class: 'lead-section__slide__text',
        animations: {
          appear: { translateX: [150, 0], opacity: 0.7 },
          disappear: (currentPos: number) => {
            return { translateX: [currentPos, 0], opacity: 0 }
          },
          return: (currentPos: number) => {
            return { translateX: [currentPos, 0], opacity: 1 }
          },
        },
      },
      {
        name: 'title',
        class: 'lead-section__slide__title',
        animations: {
          appear: { translateX: [-25, 0], opacity: 1 },
          disappear: (currentPos: number) => {
            return { translateX: [currentPos, 0], opacity: 0 }
          },
          return: (currentPos: number) => {
            return { translateX: [currentPos, 0], opacity: 1, easing: 'easeOutCubic' }
          },
        },
      },
      {
        name: 'button',
        class: 'lead-section__slide__button',
        animations: {
          appear: { translateY: [150, 0], opacity: 1 },
          disappear: (currentPos: number) => {
            return { translateY: [currentPos, 0], opacity: 0 }
          },
          return: (currentPos: number) => {
            return { translateY: [currentPos, 0], opacity: 1, easing: 'easeInQuad', duration: 150 }
          },
        },
      },
      {
        name: 'image',
        class: 'lead-section__slide__image',
        animations: {
          appear: { translateY: [50, 0], opacity: 1, easing: 'easeOutQuad' },
          disappear: (currentPos: number) => {
            currentPos = Math.abs(currentPos)

            return { translateY: [currentPos, 0], opacity: 0 }
          },
          return: (currentPos: number) => {
            currentPos = Math.abs(currentPos)
            return { translateY: [currentPos, 0], opacity: 1 }
          },
        },
      },
    ],
  },
  swiper: {
    allowTouchMove: false,
    speed: 0,
  },
  navigation: {
    el: document.querySelector(".lead-section__page"),
  }
})
