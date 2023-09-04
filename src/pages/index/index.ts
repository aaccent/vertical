import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import { initOfferSwiper } from 'global/components/pageBlocks/offerSwiper'
import 'components/ui/quickFilter'
import 'components/pageBlocks/filter'
import 'components/pageBlocks/map'
import { initPageViewer } from 'global/components/ui/pageViewer'

const leadSwiper = new Swiper('.lead-section__swiper', {
  navigation: { nextEl: '.page-viewer__right', prevEl: '.page-viewer__left' },
  // autoplay: {
  //   delay: 3000,
  //   disableOnInteraction: false,
  // },
  modules: [Navigation, Autoplay],
})

initPageViewer(leadSwiper)

initOfferSwiper('.offer__swiper')

const seoBlock = document.querySelector('.seo-block') as HTMLElement
const seoBlockParagraph = (seoBlock.querySelector('.seo-block__text') as HTMLElement).getBoundingClientRect().height
;(seoBlock.querySelector('.seo-block__text') as HTMLElement).style.height = `${seoBlockParagraph}px`

const calcSeoBlockTextHeight = (seoBlock: any) => {
  let height = 0
  seoBlock.querySelectorAll('p').forEach((text: HTMLElement) => {
    height += text.getBoundingClientRect().height
  })
  return height
}

document.querySelector('.seo-block__expand')?.addEventListener('click', () => {
  const text = seoBlock.querySelector('.seo-block__text') as HTMLElement
  if (seoBlock.classList.contains('seo-block_open')) {
    seoBlock.classList.remove('seo-block_open')
    text.style.height = `${seoBlockParagraph}px`

    return
  }
  const height = calcSeoBlockTextHeight(seoBlock)
  text.style.height = `${height}px`
  seoBlock.classList.add('seo-block_open')
})
const mobilePageList = document.querySelector('.lead-section__mobile__page-list') as HTMLElement
const slideText = document.querySelector('.lead-section__slide__text') as HTMLElement

const moveMobilePage = (width: number) => {
  if (width > 1200) return
  if (width > 800) {
    mobilePageList.style.top = `${slideText.getBoundingClientRect().y - 20}px`
    mobilePageList.style.left = `${slideText.getBoundingClientRect().x}px`
  } else if (width < 800) {
    const middle = slideText.getBoundingClientRect().height / 2 - mobilePageList.getBoundingClientRect().height / 2
    mobilePageList.style.top = `${slideText.getBoundingClientRect().top + middle}px`
    mobilePageList.style.left = `${slideText.getBoundingClientRect().right}px`
  }
}
moveMobilePage(window.innerWidth)

window.addEventListener('resize', (e) => {
  const windowWidth = (e.currentTarget as any).innerWidth
  moveMobilePage(windowWidth)
})
