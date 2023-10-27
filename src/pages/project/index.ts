import gsap from 'gsap'
import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'components/pageBlocks/map'
import 'components/pageBlocks/filterPopup'
import { initCustomSwiper } from 'features/slider/customSwiper'
import { createSwiperPagination } from 'features/slider/pagination'

void function () {
  const gallerySwiperEl = document.querySelector('.gallery__swiper')
  if (!gallerySwiperEl) return

  createSwiperPagination(
    document.querySelector('.gallery .slider-pagination'),
    initCustomSwiper(
      new Swiper('.gallery__swiper', {
        navigation: {
          nextEl: '.page-viewer__right',
          prevEl: '.page-viewer__left',
        },
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        modules: [ Navigation, Autoplay ],
      })
    ),
  )
}()

void function () {
  const animation = gsap.timeline()
    .from('.project-header__image img', {
      duration: 5,
      scale: 1.4,
    }, 0)
    .textAppearing('.project-header__title', {
    }, 0)
    .fadeUp('.project-header__actions', { yPercent: 120 }, '<0.4')
    .fadeUp('.project-header__list__item', {}, '<0.4')
    .from('.project-header__list', {
      duration: 1.5,
      '--before-width': '0%',
    }, '<0.4')

  gsap.utils.toArray('.project-header__list__item').forEach(item => {
    animation.from(item as HTMLElement, {
      '--after-height': '0%',
    }, '<0.15')
  })
}()

// initOfferSwiper('.offer__swiper')

// const progressBar = document.querySelector('.building-summary__progress-indicator') as HTMLElement
// const progress = progressBar?.dataset.progress?.toString() as any

// renderArc(progressBar.querySelector('#progress') as HTMLElement, 360 * (progress / 100), 120)

const galleryPopupDesktop = new Swiper('.gallery-popup__swiper', {
  navigation: {
    nextEl: '.gallery-popup__right',
    prevEl: '.gallery-popup__left',
  },

  modules: [ Navigation, Autoplay ],
})

const galleryPopupMobile = new Swiper('.gallery-popup__mobile-swiper', {})