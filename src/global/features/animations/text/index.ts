import gsap from 'gsap'

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

function fixBr(text: string) {
  return text.replace(/<br>((?:<\/span>)+)/, '$1<br>')
}

export function splitTextOnLines(textEl: HTMLElement) {
  if (matchMedia('(max-width: 1200px)').matches) return

  textEl.classList.add('text-appearing')

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
    .map(line => fixBr(`<span class="text-line"><span>${line}</span></span>`))
    .join(' ')

  textEl.classList.remove('by-words')
  textEl.classList.add('by-lines')

  textEl.innerHTML = String(byLines)

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

gsap.registerEffect({
  name: 'textAppearing',
  effect(targets: HTMLElement[], config: Required<TextAppearingFilterConfig>) {
    targets.forEach(splitTextOnLines)

    const timeline = gsap.timeline({ paused: true })

    if (config.alternate) {
      targets.forEach(target => {
        gsap.utils.toArray('span > span', target).forEach((line, index) => {
            timeline.from(line as Element, {
              duration: config.duration + config.lineDelay * index,
              yPercent: config.yPercent,
              opacity: 0,
            }, 0)
          },
        )
      })
    } else {
      targets.forEach(target => {
        const q = gsap.utils.selector(target)
        timeline.from(q('span > span'), {
          duration: config.duration,
          yPercent: config.yPercent,
          opacity: 0,
        }, 0)
      })
    }

    return gsap.from(targets, {
      delay: config.delay,
      duration: timeline.duration(),
      onStart() {
        timeline.play()
        config.onStart?.()
      },
      onComplete() {
        config.onComplete?.()
      }
    })
  },
  defaults: {
    duration: 0.7,
    alternate: false,
    yPercent: 70,
    lineDelay: .4,
  },
  extendTimeline: true,
})