import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'


const leadSwiper = new Swiper('.history__swiper', {
  navigation: { nextEl: '.arrow-button_right', prevEl: '.arrow-button_left' },
  spaceBetween: 60,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  modules: [Navigation, Autoplay],
})