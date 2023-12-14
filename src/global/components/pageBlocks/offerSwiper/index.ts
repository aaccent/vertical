import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

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
  const offer = document.querySelector<HTMLElement>('.offer')
  const offerBody = document.querySelector('.offer__body') as HTMLElement
  if (!offer) return
  
  const titleContainer = offer.querySelector('.offer__title')
  const textContainer = offer.querySelector('.offer__text')

  const lineAnimation = gsap.timeline()

  const slides = document.querySelectorAll<HTMLElement>('.offer__slide')
  const step = 400

  let addStartText = true;
  const firstAppearAnimation = gsap.timeline({paused: true})
    .fadeUp('.offer__pagination', { yPercent: 100, delay: .5 }, 0)
    .textAppearing(titleContainer, {  delay: .3 }, 0)
    .textAppearing(textContainer, {  delay: .3 }, 0)
  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    animation: firstAppearAnimation,
    trigger: offerBody,
    start: `top center`,
    end: `top center`,
    onEnter: () =>  { 
      if (!addStartText) return
      changeText(0)
      firstAppearAnimation.play()
      addStartText = false
    }
  })
  Array.from(slides).map((slide, i) => {
    const animation = gsap.timeline().from(slide, i === 0 ? {} : {
      duration: .8,
      scale: 0,
      rotate: 45 * Math.random() + 45,
    })

    const isLastSlide = i + 1 !== slides.length
    
    const pagination = renderOfferPagination(i + 1, isLastSlide)

    lineAnimation.to(pagination.line, {
      '--after-width': '100%',
    })
    new ScrollTrigger({
      scroller: '[data-scroll-container]',
      animation,
      trigger: offerBody,
      start: `+=${offerBody.offsetHeight / 2 + i * step} center`,
      end: `+=${offerBody.offsetHeight / 2 + i * step} center`,
      onEnter: () =>  { 
        if (i === 0) return
        
        togglePaginationActive(i)

        changeText(i)
      },
      onEnterBack() {
        animation.reverse()
        
        if (i === 0) return
        togglePaginationActive(i-1)
        changeText(i-1)
      }
    })
  })

  function togglePaginationActive(number: number) {
    const paginations = document.querySelectorAll<HTMLDivElement>('.offer .offer__pagination-item')
    
    paginations.forEach((paginationItem, index) => {
      const isActive = index <= number;
      paginationItem.classList.toggle('_active', isActive);
    });
  }

  function changeText(index: number) {
    if (!titleContainer || !textContainer) return;

    const slide = slides[index];
    const title = String(slide.dataset.title);
    const text = String(slide.dataset.text);

    titleContainer.textContent = title;
    textContainer.textContent = text;

    gsap.timeline().textAppearing(titleContainer, { delay: 0.8 });
    gsap.timeline().textAppearing(textContainer, { delay: 0.8 });
  }
  new ScrollTrigger({
    scroller: '[data-scroll-container]',
    trigger: offer,
    animation: lineAnimation,
    scrub: 1,
    pin: true,
    start: 'center center',
    end: `+=${step * slides.length} center`,
  })
  
  setTimeout(ScrollTrigger.refresh, 200)
}()
