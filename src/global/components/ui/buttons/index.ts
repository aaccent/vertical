const buttonSwitch = document.querySelector('.button-switch') as HTMLElement
const buttonSwitchMark = document.querySelector('.button-switch__mark') as HTMLElement
const buttonWidth = buttonSwitch.getBoundingClientRect().width

let isPressed = false
let pos = 0

buttonSwitch.addEventListener('mousedown', (e) => {
  isPressed = true
  e.preventDefault()
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
  if (pos === 0 && isPressed) {
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
