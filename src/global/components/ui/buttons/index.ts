import { scroll } from '@/global/features/animations/scroll'

void function () {
  const buttonSwitch = document.querySelector<HTMLElement>('.button-switch')
  const buttonSwitchMark = document.querySelector<HTMLElement>('.button-switch__mark')

  if (!buttonSwitch || !buttonSwitchMark) return

  initButtonSwitch(buttonSwitch, buttonSwitchMark)
}()

function initButtonSwitch(buttonSwitch: HTMLElement, buttonSwitchMark: HTMLElement) {
  const buttonWidth = buttonSwitch.getBoundingClientRect().width
  let isPressed = false
  let pos = 0
  let onButton = false

  buttonSwitch.addEventListener('mouseenter', () => {
    onButton = true
  })

  buttonSwitch.addEventListener('mouseleave', () => {
    onButton = false
  })

  buttonSwitch.addEventListener('mousedown', (e) => {
    isPressed = true
    e.preventDefault()
    console.log('fadsfsd')

  })

  buttonSwitch.addEventListener('mousemove', (e) => {
    if (!isPressed) return
    pos = e.clientX - buttonSwitch.getBoundingClientRect().x
    if (pos - 10 > 0 && pos + 30 < buttonWidth) {
      buttonSwitchMark.style.left = `${pos}px`
    }
  })

  window.addEventListener('mouseup', (e) => {
    const percent = (pos / buttonWidth) * 100
    if (!onButton) return
    if ((pos < 0.01 || pos === 0) && isPressed) {
      if (buttonSwitchMark.style.left === '') {
        buttonSwitchMark.style.left = `${buttonWidth - 30}px`
        buttonSwitch.dispatchEvent(new Event('buttonChecked'))
      } else {
        buttonSwitchMark.style.left = ''
        buttonSwitch.dispatchEvent(new Event('buttonUnchecked'))
      }
      pos = 0
      isPressed = false

      return
    }
    isPressed = false

    if (percent > 50) {
      buttonSwitchMark.style.left = `${buttonWidth - 30}px`
      buttonSwitch.dispatchEvent(new Event('buttonChecked'))
    } else {
      buttonSwitchMark.style.left = ''
      buttonSwitch.dispatchEvent(new Event('buttonUnchecked'))
    }
    pos = 0
  })
}

document.querySelectorAll<HTMLElement>('.button_circle').forEach(btn => {
  btn.onclick = () => btn.classList.add('_loading')
})