import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

interface OfferSlide {
  pos: number
  played: boolean
  title: string
  text: string
  pagination: HTMLElement
}

function renderOfferPagination(num: number, needLine = true) {
  const container = document.querySelector('.offer__pagination') as HTMLElement

  const div = document.createElement('div')
  div.classList.add('offer__pagination-item')
  if (num === 1) div.classList.add('_active')
  div.innerText = `${num}`

  const line = document.createElement('div')
  line.className = 'offer__pagination-line'

  container.append(div)
  if (needLine) container.append(line)

  return { div, line }
}

void function () {
  const offer = document.querySelector('.offer')
  if (!offer) return

  const animation = gsap
    .timeline({ paused: true })
    .addLabel('start')

  const lineAnimation = gsap.timeline()

  const slides = document.querySelectorAll<HTMLElement>('.offer__slide:not(:first-child)')
  const step = 1 / (slides.length + 1)

  const firstPagination = renderOfferPagination(1, slides.length !== 1)
  lineAnimation.to(firstPagination.line, {
    '--after-width': '100%'
  })

  const order = Array.from(slides).map((slide, i) => {
    animation
      .from(slide, {
        duration: .8,
        scale: 0,
        rotate: 45 * Math.random() + 45,
      })
      .addLabel(`slide ${i}`)

    const pagination = renderOfferPagination(i + 2, i + 1 !== slides.length)

    lineAnimation.to(pagination.line, {
      '--after-width': '100%'
    })

    return {
      pos: (i + 1) * step,
      played: false,
      title: String(slide.dataset.title),
      text: String(slide.dataset.text),
      pagination: pagination.div,
    }
  })

  const titleContainer = offer.querySelector('.offer__title')
  const textContainer = offer.querySelector('.offer__text')

  function changeText(slide: OfferSlide) {
    if (!titleContainer || !textContainer) return

    titleContainer.textContent = slide.title
    textContainer.textContent = slide.text
  }

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    trigger: '.offer',
    animation: lineAnimation,
    scrub: 1,
    pin: true,
    start: 'center center',
    end: `+=${800 * slides.length} center`,
    onUpdate(self) {
      if (self.direction === 1) {
        const closest = order.findLast(i => self.progress >= i.pos && !i.played)
        if (!closest) return

        closest.played = true
        animation.tweenTo(animation.nextLabel())
        changeText(closest)
        closest.pagination.classList.add('_active')
      } else {
        const closest = order.find(i => self.progress <= i.pos && i.played)
        if (!closest) return

        closest.played = false
        animation.tweenTo(animation.previousLabel())
        changeText(closest)
        closest.pagination.classList.remove('_active')
      }
    },
  })
}()