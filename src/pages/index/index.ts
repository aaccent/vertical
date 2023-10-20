import Swiper from 'swiper'
import { Navigation, Autoplay, EffectFade } from 'swiper/modules'
import { initOfferSwiper } from 'global/components/pageBlocks/offerSwiper'
import 'components/ui/quickFilter'
import 'components/pageBlocks/filter'
import 'components/pageBlocks/map'
import 'features/popup'
import './sections/hero-index'
import { initPageViewer } from 'global/components/ui/pageViewer'
import { renderFilledArc } from 'global/features/arcProgress'
import { createSlider } from 'features/slider'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const PAGES_CIRCLES = 5
const mobilePagination = document.querySelector('.lead-section__mobile__page-list') as HTMLDivElement
let slideText = document.querySelector('.lead-section__slide__text') as HTMLDivElement

function createPaginationDot() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('lead-section__mobile__page')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.style.strokeWidth = '3.5'
  path.style.stroke = '#fff'
  path.style.fill = 'none'

  svg.append(path)

  return {
    svg, path,
  }
}

function initMobileSliderDots(swiper: Swiper) {
  mobilePagination.innerHTML = ''

  swiper.slides.slice(0, PAGES_CIRCLES).forEach((_: any, index: number) => {
    const circle = createPaginationDot()
    renderFilledArc(circle.path, 0, 1.75)

    if (index === 0) {
      circle.svg.classList.add('lead-section__mobile_opaque')
    }

    if (index + 1 === PAGES_CIRCLES) {
      circle.svg.classList.add('lead-section__mobile_small')
    }

    mobilePagination.append(circle.svg)
  })
}

function initSlidesAnimation(swiper: Swiper) {
  swiper.slides.forEach((slide, index) => {
    const img = slide.querySelector('.lead-section__slide__image img') as HTMLElement
    img.dataset.maxWidth = String(img.offsetWidth) + 'px'
    img.style.maxWidth = index < 2 ? img.dataset.maxWidth : '0px'
  })
}

interface SwiperInfo {
  currentIsLast: boolean
  previousIsLast: boolean
  currentIndex: number
  previousIndex: number
}

function withSwiperInfo(fn: (swiper: Swiper,
  getInfo: (swiper: Swiper) => SwiperInfo,
) => void): (swiper: Swiper) => void {
  let realPreviousIndex: number = 0

  function getInfo(swiper: Swiper) {
    const currentIsLast = swiper.realIndex + 1 > PAGES_CIRCLES
    const previousIsLast = realPreviousIndex + 1 > PAGES_CIRCLES
    const currentIndex = currentIsLast ? PAGES_CIRCLES - 1 : swiper.realIndex
    const previousIndex = previousIsLast ? PAGES_CIRCLES - 1 : realPreviousIndex

    return {
      currentIsLast, previousIsLast, currentIndex, previousIndex,
    }
  }

  return function (swiper: Swiper) {
    fn(swiper, getInfo)
    realPreviousIndex = swiper.realIndex
  }
}

const updateMobileSliderDot = withSwiperInfo(function (swiper: Swiper, getInfo) {
  const {
    currentIsLast, previousIsLast, currentIndex, previousIndex,
  } = getInfo(swiper)

  const targetItem = mobilePagination.children.item(currentIndex)
  const prevItem = mobilePagination.children.item(previousIndex)

  if (!targetItem) return

  targetItem.classList.add('lead-section__mobile_opaque')

  if (prevItem && targetItem !== prevItem && (!currentIsLast || !previousIsLast)) {
    prevItem.classList.remove('lead-section__mobile_opaque')
    renderFilledArc(prevItem.firstElementChild as HTMLElement, 0, 1.75)
  }

  renderFilledArc(targetItem.firstElementChild as HTMLElement, 0, 1.75)
})

const playSlideAnimation = withSwiperInfo(function (swiper: Swiper, getInfo) {
  const { currentIndex, previousIndex } = getInfo(swiper)
  const img = swiper.slides[previousIndex].querySelector('.lead-section__slide__image img') as HTMLElement
  img.style.maxWidth = '0px'

  const nextSlide = swiper.slides[currentIndex + 1].querySelector<HTMLElement>('.lead-section__slide__image img')
  if (!nextSlide) return
  nextSlide.style.maxWidth = nextSlide.dataset.maxWidth || '0px'
})

const leadSwiper = new Swiper('.lead-section__swiper', {
  navigation: {
    nextEl: '.page-viewer__right', prevEl: '.page-viewer__left',
  }, loop: true, // autoplay: {
  //   delay: 3000,
  //   disableOnInteraction: false,
  // },
  effect: 'fade', fadeEffect: {
    crossFade: true,
  }, on: {
    init: (swiper) => {
      initMobileSliderDots(swiper)
      initSlidesAnimation(swiper)
    }, slideChange: (swiper: Swiper) => {
      updateMobileSliderDot(swiper)
      playSlideAnimation(swiper)
    }, autoplayTimeLeft(swiper: Swiper, _: number, percent: number) {
      const isLast = swiper.realIndex + 1 > PAGES_CIRCLES
      const targetIndex = isLast ? PAGES_CIRCLES - 1 : swiper.realIndex

      const targetItem = mobilePagination.children.item(targetIndex)
      if (!targetItem) return

      renderFilledArc(targetItem.firstElementChild as HTMLElement, 360 * percent, 1.75)
    }, activeIndexChange: (swiper: Swiper) => {
      // slideText = swiper.slides[swiper.activeIndex].querySelector('.lead-section__slide__text') as HTMLElement
    },
  }, modules: [ Navigation, Autoplay, EffectFade ],
})

// initPageViewer(leadSwiper)

void function () {
  if (window.matchMedia('(max-width: 1200px)').matches) return

  const offerSlides = document.querySelectorAll('.offer__slide')

  offerSlides.forEach((slide, index) => {
    if (index === 0) return

    // new ScrollTrigger({
    //   trigger: '.offer',
    //   start: 'center top',
    //   end: `+=1500 top`,
    //   pin: true,
    //   markers: true
    // })
  })
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

const moveMobilePage = (width: number) => {
  let top = 0
  let left = 0
  if (width > 1200) return

  const table = window.matchMedia('(max-width: 1200px) and (min-width: 800px)')
  const mobile = window.matchMedia('(max-width: 800px)')

  if (table.matches) {
    top = slideText.getBoundingClientRect().top - 20
    left = slideText.getBoundingClientRect().x
  } else if (mobile.matches) {
    top = slideText.getBoundingClientRect().top + 7.5
    left = slideText.getBoundingClientRect().right
  }
  top += window.scrollY
  mobilePagination.style.top = `${top}px`
  mobilePagination.style.left = `${left}px`
}
moveMobilePage(window.innerWidth)

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
    markers: true
  })
}()