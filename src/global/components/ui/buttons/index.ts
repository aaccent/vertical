// Import statements
import { scroll } from 'features/animations/scroll'

// Add loading class to button_circle elements
document.querySelectorAll<HTMLElement>('.button_circle').forEach(btn => {
  btn.onclick = () => btn.classList.add('_loading');
});

void function() {
  // Selecting elements
  const buttonSwitch = document.querySelector<HTMLDivElement>('.button-switch');
  const labelSwitch = buttonSwitch?.parentNode?.querySelectorAll<HTMLElement>('span');

  // Click event on buttonSwitch
  buttonSwitch?.addEventListener('click', () => {
    if(labelSwitch) {
      labelSwitch.forEach(item => {
        item.classList.toggle('active');
      });
      buttonSwitch.classList.toggle('_active');
      setTimeout(() => {scroll.update()}, 100)
      scroll.start()
    }
  });

  // Click event on labelSwitch elements
  labelSwitch?.forEach(label => {
    label.addEventListener('click', () => {
      if(buttonSwitch && !label.classList.contains('active')) {
        buttonSwitch.click();
      }
    });
  });
}();
