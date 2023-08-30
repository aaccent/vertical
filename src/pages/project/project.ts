import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'components/pageBlocks/map'
import { initPageViewer } from 'global/components/ui/pageViewer'
import { initOfferSwiper } from 'global/components/pageBlocks/offerSwiper'

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

