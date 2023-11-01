import { Map } from 'mapbox-gl'
import { scroll } from 'features/animations/scroll'

void function () {
  const mapContainer = document.querySelector<HTMLElement>('.map__view')
  if (!mapContainer) return

  new Map({
    container: mapContainer,
    style: 'mapbox://styles/seva-aaccent/clofebdm4004m01qs07pmdopg',
    center: [ 37.6170, 55.7554 ],
    zoom: 14,
    accessToken: 'pk.eyJ1Ijoic2V2YS1hYWNjZW50IiwiYSI6ImNsb2ZlNzR0NDByajUya3FwcmQ4bHdoZG8ifQ.2oZ5rpkSs2dKoP5a10lkcg',
  })

  let isHoverMapContainer: boolean = false

  mapContainer.addEventListener('mouseenter', (e) => {
    isHoverMapContainer = true
  })

  mapContainer.addEventListener('mouseleave', (e) => {
    isHoverMapContainer = false
  })

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Control' || !isHoverMapContainer) return
    scroll.stop()
  })

  window.addEventListener('keyup', (e) => {
    if (e.key !== 'Control') return
    scroll.start()
  })
}()
