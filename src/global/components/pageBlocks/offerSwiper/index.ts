import Swiper from 'swiper'
import { Pagination, Autoplay } from 'swiper/modules'

const getPaginationItem = (page: string) => {
  const pageItem = document.createElement('div')
  pageItem.textContent = page
  pageItem.classList.add('offer__pagination__item')
  return pageItem
}

const getProgressItem = () => {
  const progressParent = document.createElement('div')
  const progressIndicator = document.createElement('div')
  const progressBg = document.createElement('div')

  progressBg.classList.add('offer__pagination__progress__bg')
  progressIndicator.classList.add('offer__pagination__progress__indicator')
  progressParent.classList.add('offer__pagination__progress')

  progressParent.append(progressIndicator)
  progressParent.append(progressBg)
  return progressParent
}

const initOfferSwiper = (className: string) => {
  const swiper = new Swiper(className, {
    modules: [Autoplay],
    allowTouchMove: false,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      afterInit: (e: any) => {
        Array(e.slides.length)
          .fill('')
          .forEach((_, page: number) => {
            const pagination = document.querySelector('.offer__pagination') as HTMLElement
            pagination.append(getPaginationItem((page + 1).toString()))
            if (page + 1 === e.slides.length) return
            pagination.append(getProgressItem())
          })
        const pageItem = document.querySelector<HTMLElement>('.offer__pagination__item') as HTMLElement
        pageItem.style.opacity = '1'
      },
    },
  })

  swiper.on('slideChange', (e: any) => {
    const pages = document.querySelectorAll('.offer__pagination__item')

    pages.forEach((page: any, index: number) => {
      page.style.opacity = '0.6'

      if (index !== e.activeIndex) return
      page.style.opacity = '1'
    })
  })

  swiper.on('autoplayTimeLeft', (s: any, _: any, progress: number) => {
    const pages = document.querySelectorAll('.offer__pagination__progress__indicator') as any
    
    pages.forEach((page: any, index: number) => {
      page.style.width = null

      if (index !== swiper.activeIndex) return
      page.style.width = `${100 * (1 - progress)}%`
    })
  })

  const pages = document.querySelectorAll<HTMLElement>('.offer__pagination__item')
  pages.forEach((page, index) => {
    page.addEventListener('click', () => {
      swiper.slideTo(index)
      // swiper.autoplay.start()
    })
  })
}

export { initOfferSwiper }
