import { LngLatBounds, Map, Marker, Popup } from 'mapbox-gl'
import { isDesktop, isMobile } from 'features/adaptive'
import { Point } from 'geojson'

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

function _getData() {
  let cache: InfrastructureCategory[]

  return function () {
    const list = document.querySelectorAll<InfrastructureElement>('.project-list__data-item')
    cache = cache || Array.from(list).map(item => {
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

    return cache
  }
}

const getData = _getData()

function setInfrastructureCount() {
  const items = document.querySelectorAll('.infrastructure-list__content .infrastructure-list__item')
  const activeItems = document.querySelectorAll('.infrastructure-list__content .infrastructure-list__item._active')
  const textContainer = document.querySelector<HTMLElement>(isMobile
    ? '.popup[data-popup="infrastructure-popup"] .filter-popup__project-count'
    : '.project-list__title')

  if (!textContainer) return

  const isFilterSelected = !!activeItems.length

  let count = 0

  items.forEach(item => {
    const countEl = item.querySelector<HTMLDivElement>('.infrastructure-list__item-num')
    const itemCount = Number(countEl?.innerText)

    if (isFilterSelected) {
      count += item.classList.contains('_active') ? itemCount : 0
    } else {
      count += itemCount
    }
  })

  textContainer.innerText = isMobile ? `показать ${count} объектов` : `${count} объектов найдено`
}

function generateInfrastructureList(map: Map) {
  const listContainer = document.querySelector('.infrastructure-list__content')
  const popupListContainer = document.querySelector(
    '.popup[data-popup="infrastructure-popup"] [data-filter-name="infrastructure"]')

  if (!listContainer) return

  const filterList: { [index: string]: boolean } = {}

  const resetButton = document.querySelector(isMobile
    ? '.popup[data-popup="infrastructure-popup"] .filter-popup__reset'
    : '.infrastructure-list button[data-action="reset-infrastructure"]'
  )

  resetButton?.addEventListener('click', function () {
    const activeItems = document.querySelectorAll('.infrastructure-list__item._active, [data-filter-name="infrastructure"] .checkbox_active')

    for (const item in filterList) {
      filterList[item] = false
    }

    activeItems.forEach(item => {
      item.classList.remove('_active', 'checkbox_active')
    })

    getData().forEach(category => {
      map.setLayoutProperty(`${category.features[0].properties.type}`, 'visibility', 'visible')
      map.setLayoutProperty(`${category.features[0].properties.type} bg`, 'visibility', 'visible')
    })

    setInfrastructureCount()
  })

  getData().forEach(category => {
    filterList[category.features[0].properties.type] = false

    const checkbox = document.createElement('div')
    checkbox.className = 'checkbox'
    checkbox.innerHTML = `
      <div class="checkbox__mark"></div><span>${category.features[0].properties.type} (${category.features.length})</span><input hidden="">
    `

    const itemEl = document.createElement('div')
    itemEl.className = 'project-list__item infrastructure-list__item'
    itemEl.innerHTML = `
      <div class="infrastructure-list__item-icon">
        <img src="${category.features[0].properties.icon}" alt="" loading="lazy"/>
      </div>
      <div class="infrastructure-list__item__content project-list__item__content">
        <span class="infrastructure-list__item-title">${category.features[0].properties.type}</span>
        <span class="infrastructure-list__item-num">${category.features.length}</span>
      </div>
    `

    function clickHandler() {
      itemEl.classList.toggle('_active')
      checkbox.classList.toggle('checkbox_active')

      setInfrastructureCount()
      filterList[category.features[0].properties.type] = !filterList[category.features[0].properties.type]
      const isNoActiveEls = !Object.values(filterList).includes(true)

      if (isNoActiveEls) {
        return Object.keys(filterList).forEach(layoutId => {
          map.setLayoutProperty(`${layoutId}`, 'visibility', 'visible')
          map.setLayoutProperty(`${layoutId} bg`, 'visibility', 'visible')
        })
      }

      Object.entries(filterList).filter(([ _, value ]) => !value).forEach(([ layoutId ]) => {
        map.setLayoutProperty(`${layoutId}`, 'visibility', 'none')
        map.setLayoutProperty(`${layoutId} bg`, 'visibility', 'none')
      })

      Object.entries(filterList).filter(([ _, value ]) => value).forEach(([ layoutId ]) => {
        map.setLayoutProperty(`${layoutId}`, 'visibility', 'visible')
        map.setLayoutProperty(`${layoutId} bg`, 'visibility', 'visible')
      })

    }

    itemEl.onclick = clickHandler
    checkbox.onclick = clickHandler

    popupListContainer?.append(checkbox)
    listContainer.append(itemEl)
  })

  setInfrastructureCount()
}

function createLayers(map: Map) {
  const bounds = new LngLatBounds()

  let activePopup: Popup | null = null
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

    map.on('mouseenter', `${category.features[0].properties.type} bg`, (e) => {
      if (isMobile) return

      map.getCanvas().style.cursor = 'pointer'
      if (!e.features?.[0].properties) return

      const coordinates = (e.features[0].geometry as Point).coordinates.slice() as [ number, number ]
      const props = (e.features[0].properties as InfrastructureProperties)

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      activePopup = new Popup({
        closeButton: false,
        className: 'project-list__map-popup',
        offset: 35,
        anchor: 'bottom',
        closeOnClick: false,
      })
        .setLngLat(coordinates)
        .setHTML(`${props.name}`).addTo(map)
    })

    map.on('mouseleave', `${category.features[0].properties.type} bg`, () => {
      if (isMobile) return

      map.getCanvas().style.cursor = ''

      activePopup?.remove()
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
  generateInfrastructureList(map)
  createLayers(map)
}