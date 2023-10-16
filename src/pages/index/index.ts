import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import { initOfferSwiper } from 'global/components/pageBlocks/offerSwiper'
import 'components/ui/quickFilter'
import 'components/pageBlocks/filter'
import 'components/pageBlocks/map'
import "features/popup"
import { initPageViewer } from 'global/components/ui/pageViewer'
import { renderFilledArc } from 'global/features/arcProgress'

const shownPages = 5
let pageOffset = 0

const mobilePageList = document.querySelector('.lead-section__mobile__page-list') as HTMLElement
let slideText = document.querySelector('.lead-section__slide__text') as HTMLElement

const renderMobilePages = (swiper: Swiper, pages = null) => {
  const pageItem = mobilePageList.children.item(0)?.cloneNode(true) as HTMLElement
  mobilePageList.innerHTML = ''
  let pagesArray = [] as any
  if (pages === null) {
    pagesArray = swiper.slides.slice(0, shownPages)
  } else {
    pagesArray = pages
  }
  pagesArray.forEach((_: any, index: number) => {
    const page = pageItem.cloneNode(true) as HTMLElement
    renderFilledArc(page.querySelector('#progress') as HTMLElement, 0, 1.75)

    if (index + 1 >= shownPages) {
      page.classList.add('lead-section__mobile_small')
    }
    mobilePageList.append(page)
  })

  mobilePageList.children.item(0)?.classList.add('lead-section__mobile_opaque')
}

const leadSwiper = new Swiper('.lead-section__swiper', {
  navigation: { nextEl: '.page-viewer__right', prevEl: '.page-viewer__left' },
  // autoplay: {
  //   delay: 3000,
  //   disableOnInteraction: false,
  // },
  on: {
    init: renderMobilePages,
    slideChange: (swiper: Swiper) => {
      mobilePageList.childNodes.forEach((mobilePage) => {
        ;(mobilePage as HTMLElement).classList.remove('lead-section__mobile_opaque')
        renderFilledArc((mobilePage as HTMLElement).querySelector('#progress') as HTMLElement, 0, 1.75)
      })

      mobilePageList.childNodes.forEach((mobilePage, index: number) => {
        if (index <= swiper.activeIndex) {
          ;(mobilePage as HTMLElement).classList.add('lead-section__mobile_opaque')
          if (swiper.activeIndex >= shownPages - 1) return
          ;(mobilePage as HTMLElement).classList.remove('lead-section__mobile_small')
        }
      })
      if (swiper.activeIndex >= shownPages - 1) {
        ;(mobilePageList.childNodes[shownPages - 1] as HTMLElement).classList.remove('lead-section__mobile_opaque')
      }
    },
    autoplayTimeLeft(swiper: Swiper, _: number, percent: number) {
      let currIndex = swiper.activeIndex

      if (currIndex >= shownPages - 1 && swiper.activeIndex !== swiper.slides.length - 1) {
        currIndex = shownPages - 2
      } else if (swiper.activeIndex === swiper.slides.length - 1 && swiper.slides.length > shownPages) {
        currIndex = shownPages - 1
      }
      const currItem = mobilePageList.childNodes[currIndex] as HTMLElement

      if (swiper.activeIndex === swiper.slides.length - 1) {
        currItem.classList.add('lead-section__mobile_opaque')
        currItem.classList.remove('lead-section__mobile_small')
      }

      renderFilledArc(currItem.querySelector('#progress') as HTMLElement, 360 * percent, 1.75)
    },
    activeIndexChange: (swiper: Swiper) => {
      slideText = swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__text') as HTMLElement
    },
    resize: () => {
      const windowWidth = window.innerWidth
      moveMobilePage(windowWidth)
    },
  },
  modules: [Navigation, Autoplay],
})

initPageViewer(leadSwiper)

initOfferSwiper('.offer__swiper')

const seoBlock = document.querySelector('.seo-block') as HTMLElement
const text = seoBlock.querySelector('.seo-block__text') as HTMLElement
let seoBlockParagraph = (seoBlock.querySelector('.seo-block__text p') as HTMLElement)

text.style.height = `${seoBlockParagraph.getBoundingClientRect().height}px`

window.addEventListener("resize", () => {
  text.style.height = `${seoBlockParagraph.getBoundingClientRect().height}px`
  seoBlock.classList.remove('seo-block_open')

})

const calcSeoBlockTextHeight = (seoBlock: any) => {
  let height = 0
  seoBlock.querySelectorAll('p').forEach((text: HTMLElement) => {
    height += text.getBoundingClientRect().height
  })
  return height
}


document.querySelector('.seo-block__expand')?.addEventListener('click', () => {
  if (seoBlock.classList.contains('seo-block_open')) {
    seoBlock.classList.remove('seo-block_open')
    text.style.height = `${seoBlockParagraph.getBoundingClientRect().height}px`
    return
  }
  const height = calcSeoBlockTextHeight(seoBlock)
  
  text.style.height = `${height}px`
  seoBlock.classList.add('seo-block_open')
})

const moveMobilePage = (width: number) => {
  let top = 0
  let left = 0
  if (width > 1200) return

  const table = window.matchMedia('(max-width: 1200px) and (min-width: 800px)')
  const mobile = window.matchMedia('(max-width: 800px)')

  if (table.matches) {
    top = slideText.getBoundingClientRect().top - 20
    left = slideText.getBoundingClientRect().x
  } else if (mobile.matches) {
    top = slideText.getBoundingClientRect().top + 7.5
    left = slideText.getBoundingClientRect().right
  }
  top += window.scrollY
  mobilePageList.style.top = `${top}px`
  mobilePageList.style.left = `${left}px`
}
moveMobilePage(window.innerWidth)
