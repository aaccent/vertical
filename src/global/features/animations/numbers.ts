export interface NumbersWithAnimation extends HTMLElement {
  playAnimation: () => void
}

document.querySelectorAll<NumbersWithAnimation>('.number-animation').forEach(el => {
  const num = parseInt(String(el.textContent))

  el.innerText = '0'

  let iterator = 0
  const timeout = num > 100 ? 15 : 100

  function playAnimation() {
    const interval = setInterval(() => {
      iterator += 1

      if (iterator > num) return clearInterval(interval)

      el.innerText = String(iterator)
    }, timeout)
  }

  el.playAnimation = playAnimation
})