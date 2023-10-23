import LocomotiveScroll from 'locomotive-scroll'

new LocomotiveScroll({
  el: document.querySelector<HTMLElement>('[data-scroll-container]') || undefined,
  smooth: true,
  getDirection: true,
})