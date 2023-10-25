import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import 'components/ui/quickFilter'
import 'components/pageBlocks/filter'
import 'components/pageBlocks/map'
import './sections/hero-index'

void function () {
  if (window.matchMedia('(max-width: 1200px)').matches) return
}()

const seoBlock = document.querySelector('.seo-block') as HTMLElement
const text = seoBlock.querySelector('.seo-block__text') as HTMLElement
let seoBlockParagraph = (seoBlock.querySelector('.seo-block__text p') as HTMLElement)

text.style.height = `${seoBlockParagraph.getBoundingClientRect().height}px`

window.addEventListener('resize', () => {
  text.style.height = `${seoBlockParagraph.getBoundingClientRect().height}px`
  seoBlock.classList.remove('seo-block_open')
})

const calcSeoBlockTextHeight = (seoBlock: any) => {
  let height = 0
  seoBlock.querySelectorAll('p').forEach((text: HTMLElement) => {
    height += text.getBoundingClientRect().height
  })
  return height
}


document.querySelector('.seo-block__expand')?.addEventListener('click', () => {
  if (seoBlock.classList.contains('seo-block_open')) {
    seoBlock.classList.remove('seo-block_open')
    text.style.height = `${seoBlockParagraph.getBoundingClientRect().height}px`
    return
  }
  const height = calcSeoBlockTextHeight(seoBlock)

  text.style.height = `${height}px`
  seoBlock.classList.add('seo-block_open')
})

void function () {
  const animation = gsap.timeline()
    .to('.our-projects__middle-image', { translateY: 50 })
    .to('.our-projects__right', { translateY: 50 })

  new ScrollTrigger({
    animation,
    trigger: '.our-projects',
    start: 'center center',
    end: '+=500 center',
    scrub: 2,
  })
}