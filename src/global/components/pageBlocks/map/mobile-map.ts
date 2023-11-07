import { toggleScroll } from 'features/scroll'
import { Map, Popup } from 'mapbox-gl'
import { Point } from 'geojson'
import { isDesktop } from 'features/adaptive'
import { createPopup, ProjectProperties, setBoundsToList } from 'components/pageBlocks/map/utils'
import { openPopup } from 'features/popup'

const map = document.querySelector('.map')

function mapToggle() {
  if (!map) return

  map.classList.toggle('visible')
  toggleScroll()
}

export function createMobilePointLabels(map: Map) {
  if (isDesktop) return

  const popups: { [index: number]: Popup } = {}
  let currentList: { [index: number]: Popup } = {}

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
      if (!currentList[props.id]) popup.addTo(map)
    })

    for (let id in currentList) {
      if (!newList[id]) currentList[id].remove()
    }

    currentList = newList
  })
}

type NotNullObject<TObj> = {
  [Key in keyof TObj]: Exclude<TObj[Key], null>
}

function isObjectWithoutNull<TObj extends object>(obj: TObj): obj is NotNullObject<TObj> {
  return !Object.values(obj).includes(null)
}

const selectors = {
  title: '.project-popup__title',
  text: '.project-popup__text',
  price: '.price-badge',
  img: '.project-popup__image img',
  link: 'a.button',
  infoType: '.badge[data-name="type"]',
  infoTime: '.badge[data-name="time"]',
}

function setProjectPopupInfo(props: ProjectProperties) {
  const popup = document.querySelector('.project-popup')
  if (!popup) {
    throw new Error('Page with map and project list should have element .project-popup')
  }

  const fields = {
    title: popup.querySelector(selectors.title),
    text: popup.querySelector(selectors.text),
    price: popup.querySelector(selectors.price),
    img: popup.querySelector<HTMLImageElement>(selectors.img),
    link: popup.querySelector<HTMLAnchorElement>(selectors.link),
    infoType: popup.querySelector(selectors.infoType),
    infoTime: popup.querySelector(selectors.infoTime),
  }

  if (!isObjectWithoutNull(fields)) {
    return console.error(
      'Some of elements for project data not exists in .project-popup.\n',
      'Element:\n', fields, '\n',
      'Selectors:\n', selectors,
    )
  }

  const price = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(parseInt(props.price))

  const typeList = document.querySelectorAll<HTMLElement>(
    '.building-filter .dropdown[data-name="type"] .dropdown__list__item')
  const type = Array.from(typeList)
    .find(i => i.dataset.id === props.type)
    ?.textContent

  fields.title.textContent = props.name
  fields.img.src = props.img
  fields.link.href = props.link
  fields.price.textContent = price
  fields.text.textContent = props.address
  fields.infoTime.textContent = String(type)
}

export function mobileClickHandler(map: Map, props: ProjectProperties, coordinates: [number, number]) {
  setProjectPopupInfo(props)
  map.flyTo({
    center: coordinates,
    essential: true,
    zoom: 13,
  })
  setTimeout(() => openPopup('project-popup'), 450)
  document.querySelector('.project-popup')?.addEventListener('closed', () => setBoundsToList(map), { once: true })
}

document.querySelectorAll('[data-action="map"]').forEach(i => i.addEventListener('click', mapToggle))