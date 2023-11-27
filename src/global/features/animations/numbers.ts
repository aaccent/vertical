export interface NumbersWithAnimation extends HTMLElement {
  playAnimation: () => void
}

window.addEventListener('load', () => {
  document.querySelectorAll<NumbersWithAnimation>('.number-animation').forEach(el => {
    //el.style.width = `${el.offsetWidth}px`
    const num = parseInt(String(el.textContent))
    const isIncr = num < 10
    let iterator = isIncr ? 0 : num + 20
    let animationPlayed = false

    el.innerText = `${iterator}`

    function playAnimation() {
      if (animationPlayed) return
      const interval = setInterval(() => {
        iterator += isIncr ? 1 : -1

        el.innerText = String(iterator)
        if ((isIncr && iterator >= num) || (!isIncr && iterator <= num)) {
          clearInterval(interval)
          animationPlayed = true
        }
      }, isIncr ? 250 : 100)
    }

    el.playAnimation = playAnimation
  })
})