import { Swiper, Autoplay } from 'swiper'
import * as animation from './animation'
import * as navigation from './nav'

const setRelativeStyle = (target: HTMLElement, percent: number, translate = 'translateX', opacity = 0.7) => {
  target.style.transform = `${translate}(${150 * percent}px)`
  target.dataset.pos = (150 * percent).toString()

  if (Math.abs(percent * 100) > 25) {
    target.style.opacity = (opacity - opacity * Math.abs(percent)).toString() as string
  }
}

const swiperAnimEvents = (swiperAnim: any) => {
  document.addEventListener('DOMContentLoaded', () => {
    animation.playAnimation(animation.setupAnimation(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim))
  })

  swiperAnim.swiper.on('slideChange', (e: any) => {
    animation.playAnimation(animation.setupAnimation(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim))
  })

  window.addEventListener('mousedown', (e) => {
    e.preventDefault()
    swiperAnim.startX = e.clientX
    swiperAnim.isPressed = true
  })

  swiperAnim.parent.addEventListener('mousemove', (e: any) => {
    if (animation.checkAnimating(swiperAnim.isAnimating)) return
    if (!swiperAnim.isPressed) return

    const diff = e.clientX - swiperAnim.startX
    const percent = diff / window.innerWidth

    const elements = animation.getAnimationElements(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim)

    const progressEvent = new CustomEvent('progress', { detail: { progress: percent } })
    swiperAnim.parent.dispatchEvent(progressEvent)

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
    if (animation.checkAnimating(swiperAnim.isAnimating)) return

    const resetPos = () => {
      Object.values(elements).forEach((x: any) => {
        x.dataset.pos = ''
      })
    }

    const diff = e.clientX - swiperAnim.startX

    swiperAnim.isPressed = false

    if (Math.abs(diff) < 1) {
      return
    }

    swiperAnim.startX = 0

    let percent = Math.abs((diff / (window.innerWidth - swiperAnim.startX)) * 100)

    const elements = animation.getAnimationElements(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim)

    let firstPosEl = null as any

    Object.values(elements).forEach((el: any) => {
      if (el === null) return
      if (firstPosEl !== null) return
      firstPosEl = el.dataset.pos as string
      el.style.transform = ``
    })

    if (percent < 30) {
      animation.playAnimation(
        animation.setupAnimation(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim, 'return'),
      )
      resetPos()
      return
    } else {
      if (
        (swiperAnim.swiper.activeIndex === 0 && firstPosEl > 0) ||
        (swiperAnim.swiper.activeIndex === swiperAnim.swiper.slides.length - 1 && firstPosEl < 0)
      ) {
        animation.playAnimation(
          animation.setupAnimation(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim, 'return'),
        )
        resetPos()

        return
      }
      const animeEl = animation.setupAnimation(
        swiperAnim.swiper,
        swiperAnim.swiper.activeIndex,
        swiperAnim,
        'disappear',
      )
      animation.playAnimation(animeEl)

      Object.values(elements).forEach((_, index) => {
        if (animeEl[index] === undefined) return
        animeEl[index].finished.then(() => {
          if (animation.checkAnimating(swiperAnim.isAnimating)) return

          if (firstPosEl > 0) {
            swiperAnim.swiper.slidePrev(0)
          } else if (firstPosEl < 0) {
            swiperAnim.swiper.slideNext(0)
          }
          resetPos()
        })
      })
    }
  })
}

const initFancySwiper = (swiperBaseClass: string, options: any) => {
  const swiperAnim = {
    ...options.swiperAnim,
  }

  swiperAnim.swiper = new Swiper(`.${swiperBaseClass}__swiper`, {
    ...options.swiper,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    modules: [Autoplay],
    on: {
      init: (e) => {
        animation.resetAnimElements(e, swiperAnim)
      },
    },
  })



  swiperAnim.navEl = options.navigation

  swiperAnim.nav = {
    stepAngle: 360 / swiperAnim.swiper.slides.length,
    currentAngle: 360 / swiperAnim.swiper.slides.length,
    angle: 0,
  }

  swiperAnimEvents(swiperAnim)

  navigation.swiperNavEvents(swiperAnim)
  navigation.swiperNavInit(swiperAnim)
}

export default initFancySwiper
