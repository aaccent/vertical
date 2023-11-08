import { LngLatBounds, Map } from 'mapbox-gl'
import { scroll } from 'features/animations/scroll'
import { isDesktop } from 'features/adaptive'

interface InfrastructureElement extends HTMLElement {
  dataset: {
    name: string
    icon: string
    coords: string
    type: string
  }
}

type InfrastructureProperties = Omit<InfrastructureElement['dataset'], 'coords'>

const propsList = [ 'name', 'icon', 'coords', 'type' ]

interface InfrastructureCategory {
  type: 'FeatureCollection',
  features: {
    readonly type: 'Feature',
    readonly properties: InfrastructureProperties,
    readonly geometry: { readonly type: 'Point', readonly coordinates: [ number, number ] }
  }[]
}

function getData() {
  const list = document.querySelectorAll<InfrastructureElement>('.project-list__data-item')
  return Array.from(list).map(item => {
    const propsContainsList = propsList.map(prop => ({
      prop,
      exists: prop in item.dataset,
    }))

    if (propsContainsList.map(i => i.exists).includes(false)) {
      console.error(
        'One of [data-*] attributes doesnt exists or has no value in ".project-list__data-item"\n',
        'Element:\n', item, '\n',
        'Props list:\n', Object.fromEntries(propsContainsList.map(Object.values)),
      )

      throw new Error(
        'One of [data-*] attributes doesnt exists or has no value in ".project-list__data-item". Details above')
    }

    const {
      coords,
      ...props
    } = item.dataset

    const properties: InfrastructureProperties = {
      ...props,
    }

    return {
      type: 'Feature',
      properties,
      geometry: {
        type: 'Point',
        coordinates: item.dataset.coords.trim().split(',').map(parseFloat).reverse() as [ number, number ],
      },
    } as const
  })
    .reduce<InfrastructureCategory[]>((result, item) => {
      const targetIndex = result.findIndex(i => i.features[0].properties.type === item.properties.type)
      if (targetIndex === -1) {
        result.push({
          type: 'FeatureCollection',
          features: [ item ],
        })
      } else {
        result[targetIndex].features.push(item)
      }

      return result
    }, [])
}

function generateInfrastructureList() {
  const listContainer = document.querySelector('.infrastructure-list__content')
  if (!listContainer) return

  getData().forEach(category => {
    const itemEl = document.createElement('div')
    itemEl.className = 'project-list__item infrastructure-list__item'
    itemEl.innerHTML = `
      <img src="${category.features[0].properties.icon}" alt="" />
      <div class="infrastructure-list__item__content project-list__item__content">
        <span class="infrastructure-list__item-title">${category.features[0].properties.type}</span>
        <span class="infrastructure-list__item-num">${category.features.length}</span>
      </div>
    `

    listContainer.append(itemEl)
  })
}

function createLayers(map: Map) {
  const bounds = new LngLatBounds()

  getData().forEach(category => {
    category.features.forEach(i => bounds.extend(i.geometry.coordinates))

    let imgUrl = category.features[0].properties.icon
    imgUrl = `${window.location.origin}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`
    map.loadImage(imgUrl, (error, image) => {
        if (error || !image) throw error

        map.addImage(`${category.features[0].properties.type} icon`, image)
      },
    )

    map.addSource(`${category.features[0].properties.type} source`, {
      type: 'geojson',
      data: category,
    })

    map.addLayer({
      id: `${category.features[0].properties.type} bg`,
      type: 'circle',
      source: `${category.features[0].properties.type} source`,
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': 28,
      },
    })

    map.addLayer({
      id: category.features[0].properties.type,
      type: 'symbol',
      source: `${category.features[0].properties.type} source`,
      layout: {

        'icon-image': `${category.features[0].properties.type} icon`,
      },
    })
  })

  const mapContent = document.querySelector<HTMLElement>('.map__content')
  const left = mapContent && isDesktop ? mapContent.offsetLeft + mapContent.offsetWidth + 60 : 60
  map.fitBounds(bounds, {
    padding: {
      left,
      top: 60,
      bottom: 60,
      right: 60,
    },
  })
}

export function createInfrastructureList(map: Map) {
  document.querySelector('.infrastructure-list')?.addEventListener('scroll', (e) => {
    scroll.stop()
    e.preventDefault()
  }, true)

  generateInfrastructureList()
  createLayers(map)
}