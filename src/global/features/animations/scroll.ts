import Lenis from '@studio-freight/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export const lenis = new Lenis({
  duration: 2.5,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

const buttonScrollToForm = document.querySelectorAll<HTMLElement>('.header__phone__button, .mobile-header__button')
const form = document.querySelector<HTMLElement>('#contact-form')


if (buttonScrollToForm && form) {
  buttonScrollToForm.forEach(btn => {
    btn.addEventListener('click', () => {
      lenis.scrollTo(form, { immediate: true })
    })
  })
}