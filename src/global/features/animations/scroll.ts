import LocomotiveScroll from 'locomotive-scroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export const scroll = new LocomotiveScroll({
  multiplier: 0.6,
  el: document.querySelector<HTMLElement>('[data-scroll-container]') || undefined,
  smooth: true,
  getDirection: true,
})

interface LocoScroll {
  scroll: {
    instance: {
      scroll: {
        y: number
      }
    }
  }
}

ScrollTrigger.scrollerProxy('[data-scroll-container]',  {
  scrollTop(value) {
    return arguments.length
      ? void scroll.scrollTo(value!, { disableLerp: true })
      : (scroll as unknown as LocoScroll).scroll.instance.scroll.y
  },
  getBoundingClientRect() {
    return {
      top:0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  },
  pinType: document.querySelector<HTMLElement>('[data-scroll-container]')?.style.transform ? 'transform' : 'fixed',
})

scroll.on('scroll', ScrollTrigger.update)

// @ts-ignore
ScrollTrigger.addEventListener('refresh', () => scroll.update())

window.onbeforeunload = function () {
  scroll.scrollTo(0,
    {
      disableLerp: true,
      duration: 0,
    })
  window.scrollTo({ top: 0, behavior: 'instant' })
}

const buttonScrollToForm = document.querySelectorAll<HTMLElement>('.header__phone__button, .header__mobile__phone');
const form = document.querySelector<HTMLElement>('#contact-form');


if (buttonScrollToForm && form) {
  buttonScrollToForm.forEach(btn => {
    btn.addEventListener('click', () => {
      scroll.scrollTo(form.getBoundingClientRect().bottom)
    })
  })
}