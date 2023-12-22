import { createCircleSVG, renderArc,renderArcNew, animateSvgArc, renderFilledArc, createCircleSVGNews } from 'features/arcProgress'
import { adaptiveValue } from 'features/adaptive'
import { Slider } from 'features/slider'
import { CustomSwiper } from 'features/slider/customSwiper'

export interface SliderPagination extends HTMLElement {
  changeCircle: (angle: number, autoplayTime: number) => void
  setCount: (num: number) => void
  setCurrentNum: (value: number) => void
}

function createBtn(action: string, handler: () => void) {
  const btn = document.createElement('button')
  btn.className = 'slider-pagination__btn'
  btn.type = 'button'
  btn.dataset.action = action
  btn.onclick = handler
  return btn
}

function createInner() {
  const inner = document.createElement('div')
  inner.className = 'slider-pagination__inner'

  const count = document.createElement('span')
  count.className = 'slider-pagination__all-pages'

  const current = document.createElement('span')
  current.className = 'slider-pagination__current-num'

  inner.append(count, current)

  return { inner, count, current }
}

function createDesktopPagination(slidesCount: number) {
  const { inner, count, current } = createInner()
  const circle = createCircleSVGNews('slider-pagination__svg')

  inner.prepend(circle.svg)
  // renderArc(circle.path, 0, adaptiveValue(63))
  // renderArcNew(circle.path, 0)

  count.innerText = String(slidesCount)
  current.innerText = '1'

  function circleHandler(angle: number, time: number) {
    requestAnimationFrame(() => {
      animateSvgArc(circle.path,'stroke-dashoffset', angle.toString()+";0", time, "1")
    })
  }

  function countHandler(num: number) {
    count.innerText = String(num)
  }

  function numHandler(value: number) {
    current.innerText = String(value)

    current.classList.remove('_animation')
    current.classList.add('_init-animation')
    setTimeout(() => current.classList.add('_animation'), 25)
  }

  return { inner, countHandler, numHandler, circleHandler }
}


function createMobilePagination(slides: any[]) {
  const DOTS_LIMIT = 5
  let isFirstCircleAdded = false,
      isRemoveLast = true;
  
  const mobileContainer = document.createElement('div')
  mobileContainer.className = 'slider-pagination__mobile-list'
  
  // Добавляет точки
  function createDot(isEndPosition = true) {
    const circle = createCircleSVG('slider-pagination__mobile-dot');
    renderFilledArc(circle.path, 0, adaptiveValue(1.75))
    
    isEndPosition ? mobileContainer.append(circle.svg)
                  : mobileContainer.prepend(circle.svg);
                  
    return circle
  }

  // Удаляет точки
  function removeDot(position: number) {
    const item = mobileContainer.children.item(position)
    if(item) { mobileContainer.removeChild(item); }
  }

  function circleHandler(angle: number, currentSlidePos: number) {
    const currentIsLast = currentSlidePos + 1 > DOTS_LIMIT
    const currentIndex = currentIsLast ? DOTS_LIMIT - 1 : currentSlidePos
    const targetItem = mobileContainer.children.item(currentIndex)

    if (!targetItem) return

    renderFilledArc(targetItem.firstElementChild as HTMLElement, angle, 1.75)

  }

  function updateCircleClass(previousIndex: number, currentIndex: number) {
    const targetItem = mobileContainer.children.item(currentIndex) as HTMLElement;
    const prevItem = mobileContainer.children.item(previousIndex) as HTMLElement;

    if (!targetItem) return;
    
    targetItem.classList.add('_white');
    
    if (prevItem !== targetItem) {
        prevItem.classList.remove('_white');
        renderFilledArc(prevItem.firstElementChild as HTMLElement, 0, 1.75);
    }

    renderFilledArc(targetItem.firstElementChild as HTMLElement, 0, 1.75);
  }

  function numHandler(value: number, previousPos: number) {
    const previousIndex = Math.min(previousPos, DOTS_LIMIT-2);
    const currentIndex = Math.min(value, DOTS_LIMIT) - 1
    
    if (slides.length >= DOTS_LIMIT) {
      const isFirstPageWithOverflow = value === 1
      const isAddCircleFirst = value === DOTS_LIMIT;
      const isRemoveCircleLast = value === slides.length;
    
      isFirstCircleAdded = manageDot(isAddCircleFirst, isFirstPageWithOverflow, 0, isFirstCircleAdded)
      isRemoveLast = manageDot(isFirstPageWithOverflow, isRemoveCircleLast, mobileContainer.children.length-1, isRemoveLast)
    }

    updateCircleClass(previousIndex, currentIndex);
  }

  function manageDot(shouldAdd: boolean, shouldRemove: boolean, position: number, currentState: boolean) : boolean {
    if (shouldAdd && !currentState) { 
      const circle = createDot(position != 0)
      circle.svg.classList.add('_small');
      return true;
    } else if (shouldRemove && currentState) {
      removeDot(position)
      return false
    }

    return currentState
  }

  slides.slice(0, DOTS_LIMIT).forEach((_, index) => {
    const circle = createDot()
    if (index + 1 === DOTS_LIMIT) {
      circle.svg.classList.add('_small')
    }
  })

  return { mobileContainer, numHandler, circleHandler }
}

interface SliderForPagination {
  slides: any[]
  get currentSlidePos(): number
  get previousSlidePos(): number
  slideBack: () => void
  slideNext: () => void
}

export function createPagination(container: HTMLElement, slider: SliderForPagination) {
  const pagination = container as SliderPagination
  const desktopPagination = createDesktopPagination(slider.slides.length)
  const mobilePagination = createMobilePagination(slider.slides)
  const slidePrev = createBtn('slide-prev', () => slider.slideBack())
  const slideNext = createBtn('slide-next', () => slider.slideNext())
  function Device () {
    return window.innerWidth <= 1200
  }
  function updatePaginationView() {
    if (window.innerWidth < 1201) {
      // Если мобильная пагинация еще не вставлена в DOM
      if (!pagination.contains(mobilePagination.mobileContainer)) {
          // Удаляем десктопную пагинацию из DOM
          if (pagination.contains(desktopPagination.inner)) {
            pagination.removeChild(desktopPagination.inner);
            pagination.removeChild(createBtn('slide-prev', () => slider.slideBack()))
            pagination.removeChild(createBtn('slide-next', () => slider.slideNext()))
          }
          // Добавляем мобильную пагинацию в DOM
          pagination.appendChild(mobilePagination.mobileContainer);
      }
    } else {
      // Если десктопная пагинация еще не вставлена в DOM
      if (!pagination.contains(desktopPagination.inner)) {
          // Удаляем мобильную пагинацию из DOM
          if (pagination.contains(mobilePagination.mobileContainer)) {
              pagination.removeChild(mobilePagination.mobileContainer);
          }
          // Добавляем десктопную пагинацию в DOM
          pagination.appendChild(slidePrev);
          pagination.appendChild(desktopPagination.inner);
          pagination.appendChild(slideNext);
      }
    }
  }

  // Инициализация пагинации
  updatePaginationView();

  // Обработчик изменения размера экрана
  window.addEventListener('resize', updatePaginationView);

  pagination.changeCircle = function (angle: number, autoplayTime: number) {
    mobilePagination.circleHandler(angle, slider.currentSlidePos)
    desktopPagination.circleHandler(angle, autoplayTime)
  }

  pagination.setCount = function (num: number) {
    desktopPagination.countHandler(num)
  }

  pagination.setCurrentNum = function (value: number) {
    mobilePagination.numHandler(value, slider.previousSlidePos)
    desktopPagination.numHandler(value)
  }

  return pagination
}

export function createSliderPagination(slider: Slider<any, any>) {
  if (!slider.container) return null

  let container: SliderPagination | null

  if (slider.options.pagination && typeof slider.options.pagination === 'object') {
    container = document.querySelector<SliderPagination>(slider.options.pagination.el)
  } else {
    container = slider.container.querySelector<SliderPagination>('.slider-pagination')
  }

  if (!container) throw new Error('For creating pagination need add .slider-pagination element')

  const sliderForPagination: SliderForPagination = {
    slides: slider.slides,
    get currentSlidePos() {
      return slider.currentSlide?.position || 0
    },
    get previousSlidePos() {
      // return slider.previousSlide?.position || slider.slides.length - 1;
      return slider.currentSlide?.position > 0 ? slider.currentSlide?.position - 1 : slider.slides.length - 1;
    },
    slideBack: () => slider.slideBack.call(slider),
    slideNext: () => slider.slideNext.call(slider),
  }

  return createPagination(container, sliderForPagination)
}

export function createSwiperPagination(container: HTMLElement | null, swiper: CustomSwiper) {
  
  if (!container) return

  const sliderForPagination: SliderForPagination = {
    slides: swiper.slides,
    get currentSlidePos() {
      return swiper.realIndex + 1
    },
    get previousSlidePos() {
      return swiper.realPreviousIndex + 1
    },
    slideBack: () => swiper.slidePrev.call(swiper),
    slideNext: () => swiper.slideNext.call(swiper),
  }
  const pagination = createPagination(container, sliderForPagination)
  
  swiper.on('slideChange', (swiper) => {
    pagination.setCurrentNum(swiper.realIndex + 1)
  })
  swiper.on('autoplayTimeLeft', (_, percent) => {
    pagination.changeCircle(360, swiper.autoplay.timeLeft)
  })
}