import gsap from 'gsap'

gsap.registerEffect({
  name: 'fadeUp',
  effect(targets: HTMLElement[], config: Required<FadeUpFilterConfig>) {
    return gsap.from(targets, config)
  },
  defaults: {
    duration: 0.7,
    yPercent: 35,
    opacity: 0,
  },
  extendTimeline: true,
})

gsap.registerEffect({
  name: 'fade',
  effect(targets: HTMLElement[], config: Required<FadeFilterConfig>) {
    return gsap.from(targets, config)
  },
  defaults: {
    duration: 0.7,
    opacity: 0,
  },
  extendTimeline: true,
})