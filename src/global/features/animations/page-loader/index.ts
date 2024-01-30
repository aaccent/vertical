import gsap from 'gsap'
import { disableScroll, enableScroll } from 'features/scroll'
import { lenis } from 'features/animations/scroll'

disableScroll()
window.addEventListener('load', () => {
  const loaderEvent = new CustomEvent('loader-gone')
  const pageLoader = document.querySelector<HTMLElement>('.page-loader')
  if (!pageLoader) {
    document.dispatchEvent(loaderEvent)
    enableScroll()

    lenis.resize();
    return
  }
  
  gsap.timeline()
    .to(pageLoader, {
      duration: 1.4,
      '--after-height': '100%',
      ease: 'power1.out'
    }, 1.6)
    .to(pageLoader, {
      duration: 0.7,
      opacity: 0,
      onComplete() {
        pageLoader.style.visibility = 'hidden'
        document.dispatchEvent(loaderEvent)
        enableScroll()
        lenis.resize();
      }
    })
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'KeyY') return
    console.log('scroll updated')
  })
})

export function afterLoader(fn: (...props: any) => any) {
  document.addEventListener('loader-gone', fn)
}