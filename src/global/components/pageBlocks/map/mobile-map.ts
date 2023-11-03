import { toggleScroll } from 'features/scroll'
import { Map, Popup } from 'mapbox-gl'
import { Point } from 'geojson'
import { isDesktop } from 'features/adaptive'
import { createPopup } from 'components/pageBlocks/map/utils'

const map = document.querySelector('.map')

function mapToggle() {
  if (!map) return

  map.classList.toggle('visible')
  toggleScroll()
}

export function createMobilePointLabels(map: Map) {
  if (isDesktop) return

  const popups: { [index: number]: Popup } = {}
  let previousList: { [index: number]: Popup } = {}

  map.on('render', () => {
    if (!map.isSourceLoaded('projects')) return

    const newList: { [index: number]: Popup } = {}
    const features = map.querySourceFeatures('projects')

    features.forEach(feature => {
      const coordinates = (feature.geometry as Point).coordinates.slice() as [ number, number ]
      const props = feature.properties
      if (!props || props?.cluster) return

      let popup = popups[props.id]
      if (!popup) {
        while (Math.abs(coordinates[1] - coordinates[0]) > 180) {
          coordinates[0] += coordinates[1] > coordinates[0] ? 360 : -360
        }

        popup = popups[props.id] = createPopup(coordinates, props)
      }

      newList[props.id] = popup
      if (!previousList[props.id]) popup.addTo(map)
    })

    for (let id in previousList) {
      if (!newList[id]) previousList[id].remove()
    }

    previousList = newList
  })
}

document.querySelectorAll('[data-action="map"]').forEach(i => i.addEventListener('click', mapToggle))