import Swiper, { Navigation } from 'swiper'

const leadSwiper = new Swiper('.lead-section__swiper', {
  navigation:{nextEl: ".page-viewer__right", prevEl: ".page-viewer__left"},
  modules: [Navigation]
})

let angle = 0
let stepAngle = 360 / leadSwiper.slides.length
let currentAngle = 360 / leadSwiper.slides.length

const pageViewer = document.querySelector('.page-viewer') as any

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

const circleNav = () => {
  renderArc(angle)

  leadSwiper.on('slideChange', (e: any) => {
    pageViewer.querySelector('p').textContent = e.activeIndex + 1

    currentAngle = stepAngle * (e.activeIndex + 1)
    renderArc(currentAngle)
  })
  let startX = 0
  leadSwiper.on('touchStart', (e) => {
    startX = e.touches.startX
  })
  leadSwiper.on('progress', (e) => {
    const diff = e.touches.currentX - startX
    const progress = diff / window.innerWidth
    angle = currentAngle - stepAngle * progress

    if (leadSwiper.activeIndex >= leadSwiper.slides.length - 1 && angle > 360) return
    if (leadSwiper.activeIndex === 0 && angle < stepAngle) return

    renderArc(angle)
  })
  window.addEventListener('mouseup', () => {
    if (leadSwiper.activeIndex === 0 && angle < stepAngle) {
      renderArc(stepAngle)
    }
    startX =0 
  })
}

const circleNavInit = () => {
  pageViewer.querySelector('.page-viewer__page p').textContent = leadSwiper.activeIndex + 1
  pageViewer.querySelector('.page-viewer__page span').textContent = leadSwiper.slides.length
}

circleNav()
circleNavInit()
