import Swiper from 'swiper'
import {Navigation, Autoplay} from 'swiper/modules'
import 'components/pageBlocks/map'
import {initPageViewer} from 'global/components/ui/pageViewer'
import {initOfferSwiper} from 'global/components/pageBlocks/offerSwiper'
import {renderArc} from 'global/features/arcProgress'
import 'components/pageBlocks/filterPopup'
import {initCustomSwiper} from 'features/slider/customSwiper'
import {createSwiperPagination} from 'features/slider/pagination'

const _gallerySwiper = new Swiper('.gallery__swiper', {
  navigation: {nextEl: '.page-viewer__right', prevEl: '.page-viewer__left'},
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  modules: [Navigation, Autoplay],
})

createSwiperPagination(document.querySelector('.gallery .slider-pagination'), initCustomSwiper(_gallerySwiper))

// initOfferSwiper('.offer__swiper')

// const progressBar = document.querySelector('.building-summary__progress-indicator') as HTMLElement
// const progress = progressBar?.dataset.progress?.toString() as any

// renderArc(progressBar.querySelector('#progress') as HTMLElement, 360 * (progress / 100), 120)

const galleryPopupDesktop = new Swiper('.gallery-popup__swiper', {
  navigation: {nextEl: '.gallery-popup__right', prevEl: '.gallery-popup__left'},

  modules: [Navigation, Autoplay],
})

const galleryPopupMobile = new Swiper('.gallery-popup__mobile-swiper', {})