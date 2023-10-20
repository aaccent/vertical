export interface Slide extends HTMLElement {
  position: number
}

export interface Slider<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide> {
  options: SliderOptions<TRawSlide, TSlide>
  container: HTMLElement | null
  previousSlide: TSlide | null
  currentSlide: TSlide | null
  slideProgress: number
  slides: TSlide[]
  init: () => void
  initSlide: (rawSlide: TRawSlide, index: number) => void
  calcIndex: (newIndex: number) => number
  setSlide: (index: number) => void
  slideNext: () => void
  slideBack: () => void
  startAutoplay: () => void
}

export interface SliderEvents<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide> {
  beforeInitSlide?: (slide: TRawSlide) => void
  afterInit?: (slider: Slider<TRawSlide, TSlide>) => void
  onSlideChange?: (slider: Slider<TRawSlide, TSlide>) => void
  afterSlideChange?: (slider: Slider<TRawSlide, TSlide>, relativeNextSlide: TSlide) => void
  onProgress?: (slider: Slider<TRawSlide, TSlide>) => void
}

export interface SliderOptions<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide> {
  container: string | HTMLElement
  autoplayTime?: number
  handlers?: SliderEvents<TRawSlide, TSlide>
  transitionTime?: number
}

export function createSlider<TRawSlide extends HTMLElement = HTMLElement, TSlide extends Slide = Slide>(options: SliderOptions<TRawSlide, TSlide>) {
  const slider: Slider<TRawSlide, TSlide> = {
    options: options,
    container: null,
    previousSlide: null,
    currentSlide: null,
    slides: [],
    slideProgress: 0,

    initSlide(rawSlide, index) {
      options.handlers?.beforeInitSlide?.(rawSlide)

      const slide: TSlide = rawSlide as unknown as TSlide
      slide.position = index

      this.slides.push(slide)
    },

    init() {
      const slider = this
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
        .forEach((rawSlide, i) => this.initSlide.call(slider, rawSlide, i))

      options.handlers?.afterInit?.(slider)
      this.setSlide(0)
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

    startAutoplay() {
      if (!this.options.autoplayTime) return
      const slider = this
      const STEP = 1 / this.options.autoplayTime * 3

      const autoplayInterval = setInterval(() => {
        if (this.slideProgress >= 1) {
          clearInterval(autoplayInterval)
          this.slideProgress = 0
          this.slideNext()
        }

        this.options.handlers?.onProgress?.(slider)
        this.slideProgress += STEP
      }, 1)
    },
  }
  slider.init()
  return slider
}