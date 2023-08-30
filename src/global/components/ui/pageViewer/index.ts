const initPageViewer = (swiper: any, ) => {
  const pageViewer = document.querySelector('.page-viewer') as any

  pageViewer.querySelector('.page-viewer__page p').textContent = swiper.activeIndex + 1
  pageViewer.querySelector('.page-viewer__page span').textContent = swiper.slides.length

  let angle = 0
  let stepAngle = 360 / swiper.slides.length
  let currentAngle = 360 / swiper.slides.length

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
    let startX = 0
    renderArc(angle)

    swiper.on('slideChange', (e: any) => {
      pageViewer.querySelector('p').textContent = e.activeIndex + 1

      currentAngle = stepAngle * (e.activeIndex + 1)
      renderArc(currentAngle)
    })
    swiper.on('touchStart', (e: any) => {
      startX = e.touches.startX
    })
    swiper.on('progress', (e: any) => {
      const diff = e.touches.currentX - startX
      const progress = diff / window.innerWidth
      angle = currentAngle - stepAngle * progress

      if (swiper.activeIndex >= swiper.slides.length - 1 && angle > 360) return
      if (swiper.activeIndex === 0 && angle < stepAngle) return

      renderArc(angle)
    })

    swiper.on('autoplayTimeLeft', (e: any, _: any, progress: number) => {
      angle = currentAngle - stepAngle * progress
      renderArc(angle)
    })

    window.addEventListener('mouseup', () => {
      if (swiper.activeIndex === 0 && angle < stepAngle) {
        renderArc(stepAngle)
      }
      startX = 0
    })
  }
  circleNav()
}

export {initPageViewer}