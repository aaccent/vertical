import { renderArc } from 'global/features/arcProgress'

const initPageViewer = (swiper: any) => {
  const pageViewer = document.querySelector('.page-viewer') as any

  pageViewer.querySelector('.page-viewer__page p').textContent = swiper.activeIndex + 1
  pageViewer.querySelector('.page-viewer__page span').textContent = swiper.slides.length

  let angle = 0
  let stepAngle = 360 / swiper.slides.length
  let currentAngle = 360 / swiper.slides.length

  const arcRender = (angle: number) => {
    renderArc(document.querySelector('#progress') as HTMLElement, angle, 65)

  }

  const circleNav = () => {
    let startX = 0
    arcRender(angle)

    swiper.on('slideChange', (e: any) => {
      pageViewer.querySelector('p').textContent = e.activeIndex + 1

      currentAngle = stepAngle * (e.activeIndex + 1)
      arcRender( currentAngle)
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

      arcRender(angle)
    })

    swiper.on('autoplayTimeLeft', (e: any, _: any, progress: number) => {
      angle = currentAngle - stepAngle * progress
      arcRender(angle)
    })

    window.addEventListener('mouseup', () => {
      if (swiper.activeIndex === 0 && angle < stepAngle) {
        arcRender(stepAngle)
      }
      startX = 0
    })
  }
  circleNav()
}

export { initPageViewer }
