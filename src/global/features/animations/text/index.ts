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

export function splitTextOnLines(textEl: HTMLElement) {
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

  textEl.classList.add('by-words')

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
    .map(line => `<span class="text-line"><span>${line}</span></span>`.replace('<br></span></span>', '</span></span><br>'))
    .join(' ')

  textEl.classList.remove('by-words')
  textEl.classList.add('by-lines')

  textEl.innerHTML = String(byLines)

  const test = document.createElement('div')
  test.style.display = 'none'
  test.innerHTML = String(byWords)
  textEl.prepend(test)

  const lines = textEl.querySelectorAll<HTMLSpanElement>('.text-line')
  const linesGap = lines[1] ? lines[0].getBoundingClientRect().bottom - lines[1].getBoundingClientRect().top : -15

  lines.forEach(line => line.style.marginBottom = `${linesGap}px`)
}

document.querySelectorAll<TextWithAnimation>('.text-appearing').forEach(text => {
  if (matchMedia('(max-width: 1200px)').matches) return

  splitTextOnLines(text)

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

export function alternateTextAnimation(selector: string, tl: GSAPTimeline, pos?: number | string, delay = .3) {
  document.querySelectorAll(selector).forEach((line, index) => {
    tl.from(line, {
      duration: .8 + delay * index,
      translateY: '60%',
      opacity: 0,
    }, pos)
  })
}