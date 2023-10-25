type RawCSSVariables = '--init-width'

interface CSSVariables {
  _initWidth: () => number,
  get initWidth(): number,
  set initWidth(value),
  _screenDiff: () => number,
  get screenDiff(): number,
}

declare interface CSSStyleDeclaration {
  getPropertyValue: (property: string | RawCSSVariables) => string
}

const computedStyles = () => getComputedStyle(document.documentElement) as CSSStyleDeclaration

const cssVars: CSSVariables = {
  _initWidth: () => parseInt(computedStyles().getPropertyValue('--init-width')),
  get initWidth() {
    return this._initWidth()
  },
  _screenDiff: function () {
    return (window.innerWidth - this.initWidth) / (this.initWidth / 100) / 100
  },
  get screenDiff() {
    return this._screenDiff()
  }
}

export function adaptiveValue(initialValue: number, mod = 1) {
  return initialValue * mod * cssVars.screenDiff! + initialValue
}