import anime from 'animejs/lib/anime.es.js'
import Swiper from 'swiper'

const getAnimationElements = (swiper: any, index: number, swiperAnim: any): any => {
  const animEl = {} as any

  swiperAnim.el.forEach((el: any) => {
    animEl[el.name] = swiper.slides[index].querySelector(`.${el.class}`)
  })

  return animEl
}
const setRelativeStyle = (target: HTMLElement, percent: number, translate = 'translateX', opacity = 0.7) => {
  target.style.transform = `${translate}(${150 * percent}px)`
  target.dataset.pos = (150 * percent).toString()

  if (Math.abs(percent * 100) > 25) {
    target.style.opacity = (opacity - opacity * Math.abs(percent)).toString() as string
  }
}

const setRelativeAnimation = (target: HTMLElement, animeProps: object) => {
  target.style.transform = ''
  const animation = anime({ targets: target, duration: 250, autoplay: false, easing: 'easeOutQuad', ...animeProps })
  return animation
}

const checkAnimating = (animating: any) => animating.some((v: any) => v === true)

const blockDrag = (swiperAnim: any, elementsLength: number, animeEl: any[]) => {
  swiperAnim.isAnimating = Array(elementsLength).fill(true)

  Array(elementsLength)
    .fill('')
    .forEach((_, index) => {
      if (animeEl[index] === undefined) return
      animeEl[index].finished.then(() => {
        swiperAnim.isAnimating[index] = false
      })
    })
}

const setupAnimation = (swiper: any, currentIndex: number, swiperAnim: any, animationType = 'appear', pos = null) => {
  const elements = getAnimationElements(swiper, currentIndex, swiperAnim)
  const animeEl = swiperAnim.el.map((el: any) => {
    if (typeof el.animations[animationType] === 'function') {
      const animation = el.animations[animationType](pos)
      return setRelativeAnimation(elements[el.name], animation)
    } else {
      return setRelativeAnimation(elements[el.name], el.animations[animationType])
    }
  })

  blockDrag(swiperAnim, Object.values(elements).length, animeEl)
  return animeEl
}

const playAnimation = (animation: any[]) => {
  animation.forEach((el) => {
    el.play()
  })
}

const swiperAnim = {
  startX: 0,
  isAnimating: [false],
  isPressed: false,
  leadSection: document.querySelector('.lead-section') as HTMLElement,
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
}
const swiper = new Swiper('.lead-section__swiper', {
  allowTouchMove: false,
  speed: 0,
  on: {
    init: (e) => {
      e.slides.forEach((_, index) => {
        const elements = Object.values(getAnimationElements(e, index, swiperAnim))

        elements.forEach((el: any) => {
          el.style.opacity = (0).toString()
          el.style.transform = `translateY(0px)`
        })
      })
    },
  },
})

document.addEventListener('DOMContentLoaded', () => {
  playAnimation(setupAnimation(swiper, swiper.activeIndex, swiperAnim))
})

swiper.on('slideChange', (e) => {
  playAnimation(setupAnimation(swiper, swiper.activeIndex, swiperAnim))
})

window.addEventListener('mousedown', (e) => {
  e.preventDefault()
  swiperAnim.startX = e.clientX
  swiperAnim.isPressed = true
})

swiperAnim.leadSection.addEventListener('mousemove', (e) => {
  if (checkAnimating(swiperAnim.isAnimating)) return
  if (!swiperAnim.isPressed) return

  const diff = e.clientX - swiperAnim.startX
  const percent = diff / window.innerWidth

  const elements = getAnimationElements(swiper, swiper.activeIndex, swiperAnim)
  if (percent * 100 > 30) {
    setRelativeStyle(elements.text, percent - 20 / 100)
  } else if (percent * 100 < -30) {
    setRelativeStyle(elements.text, percent + 20 / 100)
  }

  setRelativeStyle(elements.title, percent)
  setRelativeStyle(elements.button, Math.abs(percent), 'translateY', 1)
  setRelativeStyle(elements.image, Math.abs(percent), 'translateY', 1)
})

window.addEventListener('mouseup', (e) => {
  if (checkAnimating(swiperAnim.isAnimating)) return

  const diff = e.clientX - swiperAnim.startX

  swiperAnim.isPressed = false

  if (Math.abs(diff) < 1) {
    return
  }

  swiperAnim.startX = 0

  let percent = Math.abs((diff / (window.innerWidth - swiperAnim.startX)) * 100)

  const elements = getAnimationElements(swiper, swiper.activeIndex, swiperAnim)

  let firstPosEl = null as any

  Object.values(elements).forEach((el: any) => {
    if (el === null) return
    if (firstPosEl !== null) return
    firstPosEl = el.dataset.pos as string
    el.style.transform = ``
  })

  if (percent < 30) {
    playAnimation(setupAnimation(swiper, swiper.activeIndex, swiperAnim, 'return', firstPosEl))
    return
  } else {
    if (
      (swiper.activeIndex === 0 && firstPosEl > 0) ||
      (swiper.activeIndex === swiper.slides.length - 1 && firstPosEl < 0)
    ) {
      playAnimation(setupAnimation(swiper, swiper.activeIndex, swiperAnim, 'return', firstPosEl))
      return
    }
    const animeEl = setupAnimation(swiper, swiper.activeIndex, swiperAnim, 'disappear', firstPosEl)
    playAnimation(animeEl)

    Object.values(elements).forEach((_, index) => {
      if (animeEl[index] === undefined) return
      animeEl[index].finished.then(() => {
        if (checkAnimating(swiperAnim.isAnimating)) return

        if (firstPosEl > 0) {
          swiper.slidePrev(0)
        } else if (firstPosEl < 0) {
          swiper.slideNext(0)
        }
      })
    })
  }
})
