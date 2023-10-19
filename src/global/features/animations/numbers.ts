export interface NumbersWithAnimation extends HTMLElement {
  playAnimation: () => void
}

document.querySelectorAll<NumbersWithAnimation>('.number-animation').forEach(el => {
  el.style.width = `${el.offsetWidth}px`
  const num = parseInt(String(el.textContent))
  let iterator = num < 10 ? 0 : num + 20
  let animationPlayed = false

  el.innerText = `${iterator}`

  function playAnimation() {
    if (animationPlayed) return
    const interval = setInterval(() => {
      iterator += num < 10 ? 1 : -1

      el.innerText = String(iterator)
      if (iterator === num) {
        clearInterval(interval)
        animationPlayed = true
      }
    }, num < 10 ? 250 : 100)
  }

  el.playAnimation = playAnimation
})