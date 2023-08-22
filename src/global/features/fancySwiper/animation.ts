import anime from 'animejs/lib/anime.es.js'

const getAnimationElements = (swiper: any, index: number, swiperAnim: any): any => {
  const animEl = {} as any

  swiperAnim.el.forEach((el: any) => {
    animEl[el.name] = swiper.slides[index].querySelector(`.${el.class}`)
  })

  return animEl
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

export { playAnimation, blockDrag, setRelativeAnimation, setupAnimation, checkAnimating, getAnimationElements }
