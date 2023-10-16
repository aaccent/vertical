import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

document.querySelectorAll('.article__media-block__video').forEach((videoBlock) => {
  videoBlock.querySelector('.article__media-block__play-button')?.addEventListener('click', () => {
    videoBlock.classList.add('article__media-block__video_active')
    const video = videoBlock.querySelector('video') as HTMLVideoElement
    video.play()
  })
})

document.querySelectorAll('.article__carousel').forEach((carousel) => {
  new Swiper(carousel.querySelector('.swiper') as HTMLElement, {
    navigation: {
      nextEl: carousel.querySelector('.article__carousel__nav__right') as HTMLElement,
      prevEl: carousel.querySelector('.article__carousel__nav__left') as HTMLElement,
    },
    spaceBetween: 12,
    modules: [Navigation],
  })
})
