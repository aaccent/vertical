export interface TextWithAnimation extends HTMLElement {
  playAnimation: () => void
  replayAnimation: () => void
  dataset: {
    played: string
  } & {
    [index: string]: string
  }
}

document.querySelectorAll<TextWithAnimation>('.text-appearing').forEach(text => {
  const innerHTML = text.innerHTML
  const byWords = innerHTML
    .trim()
    .replace('<br>', ' |')
    .replaceAll(/<\w+>(.+)<\/\w+>/g, '$1')
    .split(' ')
    .filter(Boolean)
    .map(i => `<span>${i}</span>`)
    .map(i => i.replace('<span>|</span>', '<br>'))
    .join(' ')

  text.innerHTML = String(byWords)

  const byLinesRaw: {
    [index: string]: string[]
  } = {}

  text.querySelectorAll('span').forEach(word => {
    byLinesRaw[word.offsetTop] ?
      byLinesRaw[word.offsetTop].push(word.innerHTML) :
      byLinesRaw[word.offsetTop] = [ word.innerHTML ]
  })

  const byLines = Object.values(byLinesRaw)
    .map(line => line
      .map(word => {
        const nextIsBR = new RegExp(`(?:<\\w+>(${word})<\\/\\w+> |${word} )<br>`).test(text.innerHTML)
        return nextIsBR ? `${word.trim()}<br>` : word.trim()
      })
      .join(' '))
    .map(line => `<span><span>${line}</span></span>`.replace('<br></span></span>', '</span></span><br>'))
    .join(' ')

  text.innerHTML = String(byLines)

  text.querySelectorAll<HTMLSpanElement>('span > span').forEach(line => {
    line.style.translate = '0 100%'
    text.dataset.played = '0'
    setTimeout(() => line.style.transition = 'translate 800ms ease-in-out', 5)
  })

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

    text.querySelectorAll<HTMLSpanElement>('span > span').forEach(line => {
      line.style.transition = ''
      setTimeout(() => {
        line.style.translate = '0 100%'

        setTimeout(() => {
          line.style.transition = 'translate 800ms ease-in-out'

          setTimeout(text.playAnimation, 25)
        }, 15)
      }, 5)


    })
  }
})