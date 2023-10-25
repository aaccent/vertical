import { renderArc } from 'global/features/arcProgress'
import Swiper from 'swiper'

const initPageViewer = (swiper: Swiper) => {
  const pageViewer = document.querySelector<HTMLDivElement>('.page-viewer')

  if (!pageViewer) return

  pageViewer.querySelector('.page-viewer__page p')!.textContent = `${swiper.activeIndex + 1}`
  pageViewer.querySelector('.page-viewer__page span')!.textContent = `${swiper.slides.length}`

  let angle = 0
  let stepAngle = 360 / swiper.slides.length
  let currentAngle = 360 / swiper.slides.length

  const arcRender = (angle: number) => {
    renderArc(document.querySelector('#progress') as HTMLElement, angle, 65)

  }

  const circleNav = () => {
    let startX = 0
    arcRender(angle)

    swiper.on('slideChange', (swiper) => {
      pageViewer.querySelector('p')!.textContent = `${swiper.activeIndex + 1}`

      currentAngle = stepAngle * (swiper.activeIndex + 1)
      arcRender( currentAngle)
    })
    swiper.on('touchStart', (swiper) => {
      startX = swiper.touches.startX
    })
    swiper.on('progress', (swiper) => {
      const diff = swiper.touches.currentX - startX
      const progress = diff / window.innerWidth
      angle = currentAngle - stepAngle * progress

      if (swiper.activeIndex >= swiper.slides.length - 1 && angle > 360) return
      if (swiper.activeIndex === 0 && angle < stepAngle) return

      arcRender(angle)
    })

    swiper.on('autoplayTimeLeft', (swiper, _, progress) => {
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
