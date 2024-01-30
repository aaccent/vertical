import Swiper from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import 'components/ui/buttons'
import 'components/pageBlocks/mapBlock'
import gsap from 'gsap'
import { lenis } from 'features/animations/scroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { afterLoader } from 'features/animations/page-loader'
import { isDesktop } from 'features/adaptive'

// About-header animations
void function () {
  const aboutHeader = document.querySelector('.about-header')
  if (!aboutHeader) return

  const animation = gsap.timeline({ paused: true })
    .textAppearing('.about-header__title', { duration: 1 })
    .textAppearing('.about-header__text', { alternate: true })
    .fadeUp('.about-header .arrow-button', { yPercent: 140 }, '<0')
    .from('.about-header__bottom', {
      duration: 1.3,
      '--before-width': '0%',
    }, '<0.4')

  afterLoader(() => animation.resume())

  const nextSection = document.querySelector<HTMLElement>('.about-header + *')
  document.querySelector('.about-header [data-action="scroll"]')?.addEventListener('click', () => {
    if (nextSection) lenis.scrollTo(nextSection)
  })
}()

// Company-worth animations
void function () {
  const companyWorth = document.querySelector('.company-worth')
  if (!companyWorth) return

  const animation = gsap.timeline()
    .textAppearing('.company-worth__title', {})
    .textAppearing('.company-worth__item__title', {})
    .fadeUp('.company-worth__item__image', {}, '<0.4')
    .fadeUp('.company-worth__item__text', {}, '<0')
    .from('.company-worth__item', {
      duration: 1.2,
      '--after-height': '0%',
    }, '<0')

  new ScrollTrigger({
    
    animation,
    trigger: companyWorth,
    start: 'top+=35% center',
  })
}()

// History animations
interface HistorySlide extends HTMLElement {
  dataset: {
    year: string
    title: string
  } & {
    [index: string]: string
  }
}

function setSlideData(slide: HistorySlide) {
  if (!slide.dataset.title || !slide.dataset.year) {
    return console.error('Slide of .history__swiper should have [data-year] and [data-title]')
  }
  const yearContainer = document.querySelector('.history__year-view__year')
  const titleContainer = document.querySelector('.history__title')

  if (!yearContainer || !titleContainer) return

  titleContainer.textContent = slide.dataset.title

  let year = Number(yearContainer.textContent)
  const newYear = Number(slide.dataset.year)
  const isIncr = newYear > year

  if (!year || newYear === year) return yearContainer.textContent = `${newYear}`

  const interval = setInterval(() => {
    year = isIncr ? year + 1 : year - 1
    yearContainer.textContent = `${year}`

    if ((isIncr && year >= newYear) || (!isIncr && year <= newYear)) clearInterval(interval)
  }, 100)
}

void function () {
  const history = document.querySelector('.history')

  if (!history) return

  const slider = new Swiper('.history__swiper', {
    navigation: {
      nextEl: '.arrow-button_right',
      prevEl: '.arrow-button_left',
    },
    spaceBetween: 60,
    modules: [ Navigation, Autoplay ],
    on: {
      init(swiper) {
        setSlideData(swiper.slides[0] as HistorySlide)
      },
      slideChange(swiper) {
        if (isDesktop) return

        setSlideData(swiper.slides[swiper.activeIndex] as HistorySlide)
      },
    },
  })

  const animation = gsap.timeline()
    .fadeUp('.history .title', { yPercent: 140 }, 0)
    .textAppearing('.history__title', { alternate: true }, 0)
    .fadeUp('.history__nav', {}, '<0.4')
    .fade('.history__swiper', {
      duration: 1,
      onStart() {
        slider.slideTo(0)
        slider.on('slideChange', (swiper) => {
          setSlideData(swiper.slides[swiper.activeIndex] as HistorySlide)

          gsap.timeline()
            .textAppearing('.history__title', { alternate: true })
        })
      },
    }, '<0')
    .fadeUp('.history__year-view', {}, '<0')

  new ScrollTrigger({
    
    animation,
    trigger: history,
    start: 'top+=30% center',
  })
}()

// Awards animations
void function () {
  const awards = document.querySelector('.awards')

  const animation = gsap.timeline()
    .fadeUp('.awards .title', { yPercent: 150 })
    .textAppearing('.awards__title', {}, '<0')
    .fadeUp('.awards__table__header__item', { yPercent: 150 })
    .from('.awards__table__header', {
      duration: 1.2,
      '--after-width': '0%',
    }, '<0.4')
    .fadeUp('.awards__table__item', {}, '<0')
    .from('.awards__table__row', {
      duration: 1.2,
      '--after-width': '0%',
    }, '<0.2')

  new ScrollTrigger({
    
    animation,
    trigger: awards,
    start: 'top+=35% bottom',
  })
}()