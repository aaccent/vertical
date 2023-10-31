import gsap from 'gsap'
import { disableScroll, enableScroll } from 'features/scroll'

disableScroll()
window.addEventListener('load', () => {
  const loaderEvent = new CustomEvent('loader-gone')
  const pageLoader = document.querySelector<HTMLElement>('.page-loader')
  if (!pageLoader) return

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
      }
    })
})

export function afterLoader(fn: (...props: any) => any) {
  document.addEventListener('loader-gone', fn)
}