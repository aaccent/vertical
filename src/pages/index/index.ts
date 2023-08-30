import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import { initOfferSwiper } from 'global/components/pageBlocks/offerSwiper'
import 'components/ui/quickFilter'
import 'components/pageBlocks/filter'
import 'components/pageBlocks/map'
import { initPageViewer } from 'global/components/ui/pageViewer'

const leadSwiper = new Swiper('.lead-section__swiper', {
  navigation: { nextEl: '.page-viewer__right', prevEl: '.page-viewer__left' },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
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
