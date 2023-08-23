import * as animation from '../animation'

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

const renderArc = (angle: number) => {
  document.querySelector('#progress')?.setAttribute('d', describeArc(65, 65, 63, 360 - angle, 360))
}

const circleNav = (swiperAnim: any) => {
  const el = swiperAnim.navEl.el
  const swiper = swiperAnim.swiper

  renderArc(swiperAnim.nav.currentAngle)

  el.querySelector('.page-viewer__left').addEventListener('click', () => {
    if (swiper.activeIndex === 0) return
    animation.showAnimation(swiperAnim, () => swiper.slidePrev(0))
  })

  el.querySelector('.page-viewer__right').addEventListener('click', () => {
    if (swiper.activeIndex >= swiper.slides.length - 1) return
    animation.showAnimation(swiperAnim, () => swiper.slideNext(0))
  })

  swiper.on('slideChange', (e: any) => {
    el.querySelector('.page-viewer__page p').textContent = e.activeIndex + 1

    swiperAnim.nav.currentAngle = swiperAnim.nav.stepAngle * (e.activeIndex + 1)
    renderArc(swiperAnim.nav.currentAngle)
  })

  swiperAnim.parent.addEventListener('progress', (e: any) => {
    swiperAnim.nav.angle = swiperAnim.nav.currentAngle - swiperAnim.nav.stepAngle * e.detail.progress

    if (swiper.activeIndex >= swiper.slides.length - 1 && swiperAnim.nav.angle > 360) return
    if (swiper.activeIndex === 0 && swiperAnim.nav.angle < swiperAnim.nav.stepAngle) return

    renderArc(swiperAnim.nav.angle)
  })

  window.addEventListener('mouseup', () => {
    if (swiperAnim.swiper.activeIndex === 0 && swiperAnim.nav.angle < swiperAnim.nav.stepAngle) {
      renderArc(swiperAnim.nav.stepAngle)
    }
  })
}

const circleNavInit = (swiperAnim: any) => {
  const el = swiperAnim.navEl.el
  const swiper = swiperAnim.swiper
  el.querySelector('.page-viewer__page p').textContent = swiper.activeIndex + 1
  el.querySelector('.page-viewer__page span').textContent = swiper.slides.length
}
export { circleNav, circleNavInit }
