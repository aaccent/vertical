import { createSliderPagination, SliderPagination} from 'src/global/features/slider/pagination'

export interface Slide extends HTMLElement {
  position: number
}

export interface SliderEvents<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide> {
  beforeInitSlide?: (slide: TRawSlide, index: number) => void
  beforeInit?: (slider: Slider<TRawSlide, TSlide>) => void
  afterInit?: (slider: Slider<TRawSlide, TSlide>) => void
  afterFirstInitSlide?: (slider: Slider<TRawSlide, TSlide>) => void
  onSlideChange?: (slider: Slider<TRawSlide, TSlide>) => void
  afterSlideChange?: (slider: Slider<TRawSlide, TSlide>, relativeNextSlide: TSlide) => void
  onProgress?: (slider: Slider<TRawSlide, TSlide>) => void
}

export interface Slider<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide> {
  options: SliderOptions<TRawSlide, TSlide>
  container: HTMLElement | null
  previousSlide: TSlide | null
  currentSlide: TSlide | null
  slideProgress: number
  slides: TSlide[]
  _intervalId: number
  pagination: SliderPagination | null
  
  init: () => void
  initSlide: (rawSlide: TRawSlide, index: number) => void
  calcIndex: (newIndex: number) => number
  setSlide: (index: number) => void
  slideNext: () => void
  slideBack: () => void
  clearAutoplay: () => void
  startAutoplay: () => void
}

export interface SliderOptions<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide> {
  container: string | HTMLElement
  autoplayTime?: number
  handlers?: SliderEvents<TRawSlide, TSlide>
  transitionTime?: number
  pagination?: boolean | {
    el: string
  }
}

export function createSlider<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide>(options: SliderOptions<TRawSlide, TSlide>) {
  const slider: Slider<TRawSlide, TSlide> = {
    options: options,
    container: null,
    previousSlide: null,
    currentSlide: null,
    slides: [],
    slideProgress: 0,
    _intervalId: -1,
    pagination: null,

    initSlide(rawSlide, index) {
      options.handlers?.beforeInitSlide?.(rawSlide, index)

      const slide: TSlide = rawSlide as unknown as TSlide
      slide.position = index

      this.slides.push(slide)
    },

    init() {
      const slider = this

      options.handlers?.beforeInit?.(slider)

      const _container = options.container instanceof HTMLElement
        ? options.container
        : document.querySelector<HTMLElement>(options.container)

      if (!_container) {
        const isSelector = typeof options.container === 'string'
        const text = isSelector
          ? `Element for slider by selector ${options.container} doesnt exists in DOM`
          : 'Element for slider not exists in DOM. Element:\n'
        return console.warn(text, !isSelector ? options.container : '')
      }

      this.container = _container

      _container
        .querySelectorAll<TRawSlide>('.slider-slide')
        .forEach((rawSlide, i) => this.initSlide(rawSlide, i))

      if (options.pagination) this.pagination = createSliderPagination(slider)

      options.handlers?.afterInit?.(slider)
      this.setSlide(0)
      options.handlers?.afterFirstInitSlide?.(slider)
    },

    calcIndex(newIndex: number) {
      if (newIndex > this.slides.length - 1) return 0
      if (newIndex < 0) return this.slides.length - 1
      return newIndex
    },

    setSlide(index: number) {
      if (!this.container) return

      const slider = this

      this.currentSlide = this.slides[index]

      this.pagination?.setCurrentNum(index + 1, this.options.autoplayTime || 0)
      options.handlers?.onSlideChange?.(slider)
      
      setTimeout(() => this.startAutoplay.call(slider), options.transitionTime || 0)

      this.currentSlide.classList.add('active-slide')
      
      this.container.querySelector('.previous-slide')?.classList.remove('previous-slide')
      this.previousSlide?.classList.add('previous-slide')
      this.previousSlide?.classList.remove('active-slide')

      const relativeNextSlide = this.slides[this.calcIndex(this.currentSlide.position + 1)]
      const relativePrevSlide = this.slides[this.calcIndex(this.currentSlide.position - 1)]

      this.container.querySelector('.relative-next-slide')?.classList.remove('relative-next-slide')
      this.container.querySelector('.relative-prev-slide')?.classList.remove('relative-prev-slide')

      relativeNextSlide.classList.add('relative-next-slide')
      relativePrevSlide.classList.add('relative-prev-slide')

      this.previousSlide = this.slides[index]
      
      options.handlers?.afterSlideChange?.(slider, relativeNextSlide)
    },

    slideNext() {
      this.setSlide(this.calcIndex(this.currentSlide!.position + 1))
    },

    slideBack() {
      this.setSlide(this.calcIndex(this.currentSlide!.position - 1))
    },

    clearAutoplay() {
      clearInterval(this._intervalId)
      this.slideProgress = 0
    },

    startAutoplay() {

      if (!this.options.autoplayTime) return
      const STEP = 1 / this.options.autoplayTime * 3
      this.clearAutoplay()
      this._intervalId = setInterval(()=> {
        this.slideNext()
        setInterval(() => {
          this.options.handlers?.onProgress?.(this)
        }, 1)
      }, this.options.autoplayTime)
      this.pagination?.changeCircle(this.options.autoplayTime || 0)
    },
  }
  slider.init()
  return slider
}