import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

interface OfferSlide {
  index: number
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
  
  const titleContainer = offer.querySelector('.offer__title')
  const textContainer = offer.querySelector('.offer__text')

  const animation = gsap
    .timeline({ paused: true })
    .addLabel('start')

  const lineAnimation = gsap.timeline()

  const slides = document.querySelectorAll<HTMLElement>('.offer__slide')
  const step = 1 / (slides.length)

  const order = Array.from(slides).map((slide, i) => {
    animation
      .from(slide, i === 0 ? {} : {
        duration: .8,
        scale: 0,
        rotate: 45 * Math.random() + 45,
      })
      .addLabel(`slide ${i}`)

    const pagination = renderOfferPagination(i + 1, i + 1 !== slides.length)

    lineAnimation.to(pagination.line, {
      '--after-width': '100%'
    })

    return {
      index: i,
      pos: (i) * step,
      played: false,
      title: String(slide.dataset.title),
      text: String(slide.dataset.text),
      pagination: pagination.div,
    }
  })

  function changeText(slide: OfferSlide, direction: number) {
    if (!titleContainer || !textContainer) return;
    
    if (slide.index === 0 && direction === 1) return

    titleContainer.textContent = slide.title ?? ''
    textContainer.textContent = slide.text ?? ''

    gsap.timeline().textAppearing(titleContainer, { delay: .8 })
    gsap.timeline().textAppearing(textContainer, { delay: .8 })
  }

  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    trigger: '.offer',
    animation: lineAnimation,
    scrub: 1,
    pin: true,
    start: 'center center',
    end: `+=${400 * slides.length} center`,
    onUpdate(self) {
      if (self.direction === 1) {
        console.log(order);
        
        const closest = order.findLast(i => self.progress >= i.pos && !i.played)
        if (!closest) return

        closest.played = true
        animation.tweenTo(animation.nextLabel())
        changeText(closest, self.direction)
        closest.pagination.classList.add('_active')
      } else {
        const closest = order.find(i => self.progress <= (order[i.index + 1] || order[i.index]).pos && i.played)
        if (!closest) return

        closest.played = false
        animation.tweenTo(animation.previousLabel())
        console.log(closest);
        
        changeText(closest, self.direction)

        
        order[closest.index + 1 >= order.length ? closest.index : closest.index + 1].pagination.classList.remove('_active')
      }
    },
  })

  ScrollTrigger.refresh()
}()