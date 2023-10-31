interface TextAppearingFilterConfig {
  duration?: number
  yPercent?: number
  alternate?: boolean
  lineDelay?: number
  delay?: number
  onStart?(): void
  onComplete?(): void
}

interface FadeUpFilterConfig {
  duration: number
  yPercent: number
  opacity: number
}

interface FadeFilterConfig {
  duration: number
  opacity: number
}