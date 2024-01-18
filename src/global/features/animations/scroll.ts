import Lenis from '@studio-freight/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export const scroll = new Lenis({
  // content: document.querySelector<HTMLElement>('[data-scroll-container]') || document.documentElement
})

function raf(time: number) {
  scroll.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

scroll.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  scroll.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

const buttonScrollToForm = document.querySelectorAll<HTMLElement>('.header__phone__button, .mobile-header__button');
const form = document.querySelector<HTMLElement>('#contact-form');


if (buttonScrollToForm && form) {
  buttonScrollToForm.forEach(btn => {
    btn.addEventListener('click', () => {
      scroll.scrollTo(form, { immediate: true })
    })
  })
}