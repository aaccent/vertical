export interface TextWithAnimation extends HTMLElement {
  playAnimation: () => void
  replayAnimation: () => void
  prepareAnimation: () => void
  dataset: {
    played: string
  } & {
    [index: string]: string
  }
}

export function initTextAnimation(textEl: HTMLElement) {
  if (matchMedia('(max-width: 1200px)').matches) return

  const innerHTML = textEl.innerHTML
  const byWords = innerHTML
    .trim()
    .replace('<br>', ' | ')
    .replaceAll(/<\w+>(.+)<\/\w+>/g, '$1')
    .split(' ')
    .filter(Boolean)
    .map(i => `<span>${i}</span>`)
    .map(i => i.replace('<span>|</span>', '<br>'))
    .join(' ')

  textEl.innerHTML = String(byWords)

  const byLinesRaw: {
    [index: string]: string[]
  } = {}

  textEl.querySelectorAll('span').forEach(word => {
    byLinesRaw[word.offsetTop] ?
      byLinesRaw[word.offsetTop].push(word.innerHTML) :
      byLinesRaw[word.offsetTop] = [ word.innerHTML ]
  })

  const byLines = Object.values(byLinesRaw)
    .map(line => line
      .map(word => {
        const nextIsBR = new RegExp(`(?:<\\w+>(${word})<\\/\\w+> |${word} )<br>`).test(textEl.innerHTML)
        return nextIsBR ? `${word.trim()}<br>` : word.trim()
      })
      .join(' '))
    .map(line => `<span><span>${line}</span></span>`.replace('<br></span></span>', '</span></span><br>'))
    .join(' ')

  textEl.innerHTML = String(byLines)

  textEl.querySelectorAll<HTMLSpanElement>('span > span').forEach(line => {
    line.style.translate = '0 100%'
    textEl.dataset.played = '0'
    setTimeout(() => line.style.transition = 'translate 1300ms ease-in-out', 5)
  })
}

document.querySelectorAll<TextWithAnimation>('.text-appearing').forEach(text => {
  if (matchMedia('(max-width: 1200px)').matches) return

  initTextAnimation(text)

  text.prepareAnimation = function () {
    text.querySelectorAll<HTMLSpanElement>('span > span').forEach(line => {
      line.classList.add('without-animations')

      setTimeout(() => {
        line.style.translate = '0 100%'
        text.dataset.played = '0'

        setTimeout(() => line.classList.remove('without-animations'), 15)
      }, 5)
    })
  }

  text.playAnimation = function () {
    text
      .querySelectorAll<HTMLSpanElement>('span > span')
      .forEach(line => {
        line.style.translate = '0'
        text.dataset.played = '1'
      })
  }


  text.replayAnimation = function () {
    if (!Boolean(+text.dataset.played)) return text.playAnimation()

    text.prepareAnimation()
    setTimeout(text.playAnimation, 35)
  }
})