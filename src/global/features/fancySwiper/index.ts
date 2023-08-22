import Swiper from 'swiper'
import * as animation from './animation'

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
        animation.setupAnimation(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim, 'return', firstPosEl),
      )
      return
    } else {
      if (
        (swiperAnim.swiper.activeIndex === 0 && firstPosEl > 0) ||
        (swiperAnim.swiper.activeIndex === swiperAnim.swiper.slides.length - 1 && firstPosEl < 0)
      ) {
        animation.playAnimation(
          animation.setupAnimation(swiperAnim.swiper, swiperAnim.swiper.activeIndex, swiperAnim, 'return', firstPosEl),
        )
        return
      }
      const animeEl = animation.setupAnimation(
        swiperAnim.swiper,
        swiperAnim.swiper.activeIndex,
        swiperAnim,
        'disappear',
        firstPosEl,
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
        })
      })
    }
  })
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  var start = polarToCartesian(x, y, radius, endAngle - 0.0001)
  var end = polarToCartesian(x, y, radius, startAngle)

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ')

  return d
}

const swiperNavEvents = (swiperAnim: any) => {
  const el = swiperAnim.navEl.el
  const swiper = swiperAnim.swiper

  const showAnimation = (callback: any) => {
    const animeEl = animation.setupAnimation(swiper, swiper.activeIndex, swiperAnim, 'disappear')
    animation.playAnimation(animeEl)
    Array(swiperAnim.el.length)
      .fill('')
      .forEach((_: any, index: number) => {
        if (animeEl[index] === undefined) return
        animeEl[index].finished.then(() => {
          if (animation.checkAnimating(swiperAnim.isAnimating)) return
          callback()
        })
      })
  }

  const renderArc = (angle: number) => {
    document.querySelector('#progress')?.setAttribute('d', describeArc(65, 65, 63, 360 - angle, 360))
  }

  el.querySelector('.page-viewer__left').addEventListener('click', () => {
    if (swiper.activeIndex === 0) return
    showAnimation(() => swiper.slidePrev(0))
  })
  el.querySelector('.page-viewer__right').addEventListener('click', () => {
    if (swiper.activeIndex >= swiper.slides.length - 1) return
    showAnimation(() => swiper.slideNext(0))
  })

  swiper.on('slideChange', (e: any) => {
    el.querySelector('.page-viewer__page p').textContent = e.activeIndex + 1

    swiperAnim.nav.currentAngle = swiperAnim.nav.stepAngle * (e.activeIndex + 1)
    renderArc(swiperAnim.nav.currentAngle)
  })

  renderArc(swiperAnim.nav.currentAngle)

  swiperAnim.parent.addEventListener('progress', (e: any) => {
    let progress = e.detail.progress
    const angle = swiperAnim.nav.currentAngle - swiperAnim.nav.stepAngle * progress
    if (swiper.activeIndex >= swiper.slides.length - 1 && angle > 360) {
      return
    }
    if (swiper.activeIndex === 0 && angle < swiperAnim.nav.stepAngle) {
      return
    }
    renderArc(angle)
  })

  window.addEventListener('mouseup', () => {
    if (swiperAnim.swiper.activeIndex === 0) {
      renderArc(swiperAnim.nav.stepAngle)
    }
  })
}

const swiperNavInit = (swiperAnim: any) => {
  const el = swiperAnim.navEl.el
  const swiper = swiperAnim.swiper
  el.querySelector('.page-viewer__page p').textContent = swiper.activeIndex + 1
  el.querySelector('.page-viewer__page span').textContent = swiper.slides.length
}

const initFancySwiper = (swiperBaseClass: string, options: any) => {
  const swiperAnim = {
    ...options.swiperAnim,
  }
  swiperAnim.swiper = new Swiper(`.${swiperBaseClass}__swiper`, {
    ...options.swiper,
    on: {
      init: (e) => {
        e.slides.forEach((_, index) => {
          const elements = Object.values(animation.getAnimationElements(e, index, swiperAnim))

          elements.forEach((el: any) => {
            el.style.opacity = (0).toString()
            el.style.transform = `translateY(0px)`
          })
        })
      },
    },
  })
  ;(swiperAnim.navEl = options.navigation),
    (swiperAnim.nav = {
      stepAngle: 360 / swiperAnim.swiper.slides.length,
      currentAngle: 360 / swiperAnim.swiper.slides.length,
    })
  swiperAnimEvents(swiperAnim)
  swiperNavEvents(swiperAnim)
  swiperNavInit(swiperAnim)
}

export default initFancySwiper
