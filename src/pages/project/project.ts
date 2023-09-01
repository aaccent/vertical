import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'components/pageBlocks/map'
import { initPageViewer } from 'global/components/ui/pageViewer'
import { initOfferSwiper } from 'global/components/pageBlocks/offerSwiper'
import { renderArc } from 'global/features/arcProgress'

const gallerySwiper = new Swiper('.gallery__swiper', {
  navigation: { nextEl: '.page-viewer__right', prevEl: '.page-viewer__left' },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  modules: [Navigation, Autoplay],
})

initPageViewer(gallerySwiper)
initOfferSwiper('.offer__swiper')

const progressBar = document.querySelector('.building-summary__progress-indicator') as HTMLElement
const progress = progressBar.dataset.progress?.toString() as any

renderArc(progressBar.querySelector('#progress') as HTMLElement, 360 * (progress / 100), 120)
