import { LngLatBounds, Map, Popup } from 'mapbox-gl'
import { isDesktop } from 'features/adaptive'

const propsList = [ 'img', 'name', 'address', 'coords', 'type', 'category', 'stage', 'price', 'date', 'link' ]

export type ProjectPropKeys = keyof ProjectElement['dataset']
export type ProjectProperties = Omit<ProjectElement['dataset'], 'coords' | 'id'> & {
  id: number
}

export function createPopup(coordinates: [ number, number ], props: { [p: string]: string }) {
  const price = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    notation: 'compact',
  }).format(parseInt(props.price))

  const formattedName = props.name.toLowerCase().includes('жк')
    ? props.name.toLowerCase().replace('жк', 'ЖК')
    : `${props.name.at(0)?.toUpperCase()}${props.name.slice(1)}`

  const htmlContent = `
    <span class="label-title">${formattedName}</span>
    <span> — </span>
    <span class="label-price">от ${price}</span>
  `;

  return new Popup({
      closeButton: false,
      className: 'project-list__map-popup',
      offset: 45,
      anchor: 'bottom',
      closeOnClick: false,
    })
    .setLngLat(coordinates)
    .setHTML(htmlContent)
}

export interface ProjectElement extends HTMLElement {
  dataset: {
    img: string
    name: string
    address: string
    coords: string
    type: string
    category: string
    stage: string
    price: string
    date: string
    link: string
    id: string
  }
}

export function getData() {
  const projectList = document.querySelectorAll<ProjectElement>('.map .project-list__item:not(.hidden)')
  const projects = Array.from(projectList).map((project, index) => {
    checkDataAttributes(project);

    project.dataset.id = String(index)

    const {
      coords,
      id: idStr,
      ...props
    } = project.dataset

    const properties: ProjectProperties = {
      id: index,
      ...props,
    }

    return {
      type: 'Feature',
      properties,
      geometry: {
        type: 'Point',
        coordinates: project.dataset.coords.trim().split(',').map(parseFloat).reverse() as [ number, number ],
      },
    } as const
  })

  return {
    type: 'FeatureCollection',
    features: projects,
  } as const
}

export type GeoData = ReturnType<typeof getData>

export const setBoundsToList = _setBoundsToList()

function _setBoundsToList() {
  let calculatedBound: LngLatBounds | null = null

  return function (map: Map) {
    if (!calculatedBound) {
      const bounds = new LngLatBounds()
      getData().features.forEach(point => bounds.extend(point.geometry.coordinates))
      calculatedBound = bounds
    }

    const mapContent = document.querySelector<HTMLElement>('.map__content')
    const left = mapContent && isDesktop ? mapContent.offsetLeft + mapContent.offsetWidth + 60 : 60
    map.fitBounds(calculatedBound, {
      padding: {
        left,
        top: 60,
        bottom: 60,
        right: 60,
      },
    })
  }
}

function checkDataAttributes(project: ProjectElement): void {
  const propsContainsList = Object.keys(project.dataset).map(prop => ({
    prop,
    exists: prop in project.dataset,
  }));

  if (propsContainsList.some(i => !i.exists)) {
    console.error(
      'One of [data-*] attributes does not exist or has no value in ".project-list__item"\n',
      'Element:\n', project, '\n',
      'Props list:\n', Object.fromEntries(propsContainsList.map(Object.values)),
    );

    throw new Error(
      'One of [data-*] attributes does not exist or has no value in ".project-list__item". Details above',
    );
  }
}