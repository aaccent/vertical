import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import 'components/pageBlocks/offerSwiper'
import 'components/ui/quickFilter'
import 'components/pageBlocks/mapBlock'
import 'components/pageBlocks/blog'
import './sections/hero-index'
import './sections/partners'

void function () {
  const seoBlock = document.querySelector<HTMLElement>('.seo-block')
  const seoBlockExpand = seoBlock?.querySelector<HTMLElement>('.seo-block__expand')
  const seoBlockExpandSpan = seoBlockExpand?.querySelector<HTMLElement>('span')

  if (!seoBlock) return

  const text = seoBlock.querySelector<HTMLElement>('.seo-block__text')
  let seoBlockParagraph = seoBlock.querySelector<HTMLElement>('.seo-block__text p')

  if (!text || !seoBlockParagraph) return

  const calcSeoBlockTextHeight = (seoBlock: any) => {
    let height = 0
    seoBlock.querySelectorAll('p').forEach((text: HTMLElement) => {
      height += text.getBoundingClientRect().height
    })
    return height
  }
}()


void function () {
  const animation = gsap.timeline()
    .to('.our-projects__middle-image', { y: 50 })
    .to('.our-projects__right', { y: 40 })

  new ScrollTrigger({
    animation, 
    trigger: '.our-projects', 
    start: 'center center', 
    end: '+=500 center', 
    scrub: 2,
  })
}