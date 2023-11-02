import { Map, type GeoJSONSource, LngLatBounds, Popup, MapboxGeoJSONFeature, EventData, MapMouseEvent } from 'mapbox-gl'
import { scroll } from 'features/animations/scroll'
import type { Point } from 'geojson'

// Creating map
void function () {
  const mapContainer = document.querySelector<HTMLElement>('.map__view')
  if (!mapContainer) return

  const map = new Map({
    container: mapContainer,
    style: 'mapbox://styles/seva-aaccent/clofebdm4004m01qs07pmdopg',
    center: [ 37.6170, 55.7554 ],
    zoom: 14,
    accessToken: 'pk.eyJ1Ijoic2V2YS1hYWNjZW50IiwiYSI6ImNsb2ZlNzR0NDByajUya3FwcmQ4bHdoZG8ifQ.2oZ5rpkSs2dKoP5a10lkcg',
    dragRotate: false,
    cooperativeGestures: true,
  })

  map.on('load', () => loadHandler(map, mapContainer))
}()

interface ProjectElement extends HTMLElement {
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

type ProjectProperties = Omit<ProjectElement['dataset'], 'coords' | 'id'> & {
  id: number
}

const propsList = [ 'img', 'name', 'address', 'coords', 'type', 'category', 'stage', 'price', 'date', 'link' ]

function loadHandler(map: Map, mapContainer: HTMLElement) {
  mapContainer.addEventListener('wheel', (e) => {
    scroll.start()
    if (!e.ctrlKey) return

    scroll.stop()
    e.preventDefault()
  }, true)

  if (document.querySelector('.map .project-list')) createProjectsList(map)
}

function getData() {
  const projectList = document.querySelectorAll<ProjectElement>('.project-list__item')
  const projects = Array.from(projectList).map((project, index) => {
    const propsContainsList = propsList.map(prop => ({
      prop,
      exists: prop in project.dataset,
    }))

    if (propsContainsList.map(i => i.exists).includes(false)) {
      console.error(
        'One of [data-*] attributes doesnt exists or has no value in ".project-list__item"\n',
        'Element:\n', project, '\n',
        'Props list:\n', Object.fromEntries(propsContainsList.map(Object.values)),
      )

      throw new Error(
        'One of [data-*] attributes doesnt exists or has no value in ".project-list__item". Details above')
    }

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

type GeoData = ReturnType<typeof getData>

function _setBoundsToList() {
  let calculatedBound: LngLatBounds | null = null

  return function (map: Map, data: GeoData) {
    if (!calculatedBound) {
      const bounds = new LngLatBounds()
      data.features.forEach(point => bounds.extend(point.geometry.coordinates))
      calculatedBound = bounds
    }

    const mapContent = document.querySelector<HTMLElement>('.map__content')
    const left = mapContent ? mapContent.offsetLeft + mapContent.offsetWidth + 60 : 50
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

const setBoundsToList = _setBoundsToList()

function createClusters(map: Map, data: GeoData) {
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'projects',
    filter: [ 'has', 'point_count' ],
    paint: {
      'circle-color': '#ffffff',
      'circle-radius': 44.5,
    },
  })

  setBoundsToList(map, data)

  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [ 'clusters' ],
    })

    const clusterId = features[0].properties?.cluster_id;

    (map.getSource('projects') as GeoJSONSource).getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
        if (err) return

        map.easeTo({
          center: (features[0].geometry as Point).coordinates as [ number, number ],
          zoom: zoom,
        })
      },
    )
  })

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = ''
  })

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'projects',
    filter: [ 'has', 'point_count' ],
    layout: {
      'text-field': [ 'get', 'point_count_abbreviated' ],
      'text-font': [ 'DIN Offc Pro Medium', 'Arial Unicode MS Bold' ],
      'text-size': 24,
    },
  })
}

const projectList = document.querySelector('.map .project-list')
let activeProjectId: number = -1

function createProjectCard(map: Map, data: GeoData, props: ProjectProperties, coordinates: [number, number]) {
  const price = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(parseInt(props.price))

  const card = document.createElement('div')
  card.className = 'project-card invisible'
  card.innerHTML = `
    <div class="project-card__top">
      <div class="project-card__top__content">
        <div class="project-card__badge">
          <div class="badge">Жилищный комплекс</div>
          <div class="project-card__clock-icon badge badge_dark">
            <span>${props.date}</span>
          </div>
        </div>
        <button class="button-close" type="button"></button>
      </div>
      <div class="project-card__image">
        <img src="${props.img}" alt="">
      </div>
    </div>
    <div class="project-card__content">
      <div class="project-card__title">${props.name}</div>
      <div class="project-card__text">${props.address}</div>
      <div class="price-badge price-badge_dark">От ${price}</div>
    </div>
    <a class="project-card__bottom" href="${props.link}">смотреть проект</a>
  `

  card.querySelector('.button-close')?.addEventListener('click', () => toggleProjectCard(map, data, props, coordinates))

  return card
}

const mapContent = document.querySelector('.map__content')

function toggleProjectCard(map: Map, data: GeoData, props: ProjectProperties, coordinates: [number, number]) {
  if (!mapContent || !projectList) return

  if (activeProjectId !== -1) {
    const targetCard = document.querySelector('.project-card')
    targetCard?.classList.add('invisible')
    setTimeout(() => targetCard?.remove())

    if (activeProjectId === props.id) {
      setBoundsToList(map, data)

      projectList.classList.remove('invisible')
      activeProjectId = -1

      return
    }
  }

  map.flyTo({
    center: coordinates,
    essential: true,
    zoom: 13,
  })

  const card = createProjectCard(map, data, props, coordinates)
  mapContent.append(card)

  projectList.classList.add('invisible')
  card.classList.remove('invisible')

  activeProjectId = props.id
}

function createPoints(map: Map, data: GeoData) {
  let imgUrl = String(document.querySelector<HTMLElement>('.map .project-list')?.dataset.markIcon)
  imgUrl = `${window.location.origin}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`

  map.loadImage(imgUrl, (error, image) => {
      if (error || !image) throw error

      map.addImage('map-marker', image)
    },
  )

  map.addLayer({
    id: 'points',
    type: 'symbol',
    source: 'projects',
    filter: [ '!', [ 'has', 'point_count' ] ],
    layout: {
      'icon-image': 'map-marker',
    },
  })

  let activePopup: Popup | null = null

  map.on('mouseenter', 'points', (e) => {
    map.getCanvas().style.cursor = 'pointer'
    if (!e.features?.[0].properties) return

    const coordinates = (e.features[0].geometry as Point).coordinates.slice() as [ number, number ]
    const props = (e.features[0].properties as ProjectElement['dataset'])

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    const price = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(parseInt(props.price))

    const name = props.name.toLowerCase().includes('жк')
      ? props.name.toLowerCase().replace('жк', 'ЖК')
      : `${props.name.at(0)?.toUpperCase()}${props.name.slice(1)}`

    activePopup = new Popup({
      closeButton: false,
      className: 'project-list__map-popup',
      offset: 35,
    })
      .setLngLat(coordinates)
      .setHTML(`${name} — <span>от ${price}</span>`)
      .addTo(map)
  })

  map.on('mouseleave', 'points', () => {
    map.getCanvas().style.cursor = ''

    activePopup?.remove()
  })

  map.on('click', 'points', (e) => {
    if (!e.features?.[0].properties) return

    const coordinates = (e.features[0].geometry as Point).coordinates.slice() as [ number, number ]
    const props = (e.features[0].properties as ProjectProperties)

    toggleProjectCard(map, data, props, coordinates)
  })

  document.querySelectorAll<HTMLElement>('.map .project-list__item').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = parseInt(String(item.dataset.id))
      const targetItem = data.features.find(i => i.properties.id === targetId)

      if (!targetItem) return

      const coordinates = targetItem.geometry.coordinates as [ number, number ]
      const props = targetItem.properties

      toggleProjectCard(map, data, props, coordinates)
    })
  })
}

function createProjectsList(map: Map) {
  const data = getData()
  map.addSource('projects', {
    type: 'geojson',
    data,
    cluster: true,
    clusterMaxZoom: 17,
    clusterRadius: 60,
  })

  createClusters(map, data)
  createPoints(map, data)
}

const structureList = document.querySelectorAll<HTMLElement>('.infrastructure-list__item')

const renderStructureList = () => {
  if (document.querySelectorAll('.infrastructure-list__item_active').length === 0) {
    document.querySelector('.infrastructure-list__bottom')?.classList.remove('infrastructure-list__bottom_active')
  } else {
    document.querySelector('.infrastructure-list__bottom')?.classList.add('infrastructure-list__bottom_active')
  }
  structureList.forEach((x, index: number) => {
    x.classList.remove('infrastructure-list_disable-border')
    if (!structureList[index].classList.contains('infrastructure-list__item_active')) return

    const prevItem = structureList[index - 1]
    const nextItem = structureList[index + 1]

    if (index - 1 < 0) return

    if (!prevItem.classList.contains('infrastructure-list__item_active')) {
      prevItem.classList.add('infrastructure-list_disable-border')
      return
    }

    if (index + 1 >= structureList.length) return
    if (!nextItem.classList.contains('infrastructure-list__item_active')) {
      nextItem.classList.add('infrastructure-list_disable-border')
    }
  })
}

structureList.forEach(x => {
  x.addEventListener('click', (e) => {
    x.classList.toggle('infrastructure-list__item_active')
    renderStructureList()

  })
})

renderStructureList()