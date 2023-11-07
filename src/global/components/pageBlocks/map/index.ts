import { type GeoJSONSource, Map, Popup } from 'mapbox-gl'
import { scroll } from 'features/animations/scroll'
import type { Point } from 'geojson'
import './mobile-map'
import {
  createMobilePointLabels,
  mobileClickHandler,
} from 'components/pageBlocks/map/mobile-map'
import { isDesktop, isMobile } from 'features/adaptive'
import {
  createPopup,
  GeoData,
  getData,
  ProjectElement,
  ProjectProperties,
  ProjectPropKeys,
  setBoundsToList,
} from 'components/pageBlocks/map/utils'

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
    cooperativeGestures: document.querySelector('.map .project-list') ? isDesktop : true,
  })

  map.on('load', () => loadHandler(map, mapContainer))
}()

function loadHandler(map: Map, mapContainer: HTMLElement) {
  mapContainer.addEventListener('wheel', (e) => {
    scroll.start()
    if (!e.ctrlKey) return

    scroll.stop()
    e.preventDefault()
  }, true)

  if (document.querySelector('.map .project-list:not(.infrastructure-list)')) createProjectsList(map)
}

function createClusters(map: Map) {
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

  setBoundsToList(map)

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
    if (isMobile) return

    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'clusters', () => {
    if (isMobile) return

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

function createProjectCard(map: Map, props: ProjectProperties, coordinates: [ number, number ]) {
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

  const card = document.createElement('div')
  card.className = 'project-card invisible'
  card.innerHTML = `
    <div class="project-card__top">
      <div class="project-card__top__content">
        <div class="project-card__badge">
          <div class="badge">${type}</div>
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

  card.querySelector('.button-close')?.addEventListener('click', () => toggleProjectCard(map, props, coordinates))

  return card
}

const mapContent = document.querySelector('.map__content')

function toggleProjectCard(map: Map, props: ProjectProperties, coordinates: [ number, number ]) {
  if (!mapContent || !projectList) return

  if (activeProjectId !== -1) {
    const targetCard = document.querySelector('.project-card')
    targetCard?.classList.add('invisible')
    setTimeout(() => targetCard?.remove())

    if (activeProjectId === props.id) {
      setBoundsToList(map)

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

  const card = createProjectCard(map, props, coordinates)
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
    if (isMobile) return

    map.getCanvas().style.cursor = 'pointer'
    if (!e.features?.[0].properties) return

    const coordinates = (e.features[0].geometry as Point).coordinates.slice() as [ number, number ]
    const props = (e.features[0].properties as ProjectElement['dataset'])

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    activePopup = createPopup(coordinates, props).addTo(map)
  })

  map.on('mouseleave', 'points', () => {
    if (isMobile) return

    map.getCanvas().style.cursor = ''

    activePopup?.remove()
  })

  map.on('click', 'points', (e) => {
    if (!e.features?.[0].properties) return

    const coordinates = (e.features[0].geometry as Point).coordinates.slice() as [ number, number ]
    const props = (e.features[0].properties as ProjectProperties)

    if (isMobile) mobileClickHandler(map, props, coordinates)
    if (isDesktop) toggleProjectCard(map, props, coordinates)
  })

  document.querySelectorAll<HTMLElement>('.map .project-list__item').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = parseInt(String(item.dataset.id))
      const targetItem = data.features.find(i => i.properties.id === targetId)

      if (!targetItem) return

      const coordinates = targetItem.geometry.coordinates as [ number, number ]
      const props = targetItem.properties

      toggleProjectCard(map, props, coordinates)
    })
  })

  createMobilePointLabels(map)
}

function setProjectsCount() {
  const projectNum = document.querySelectorAll('.map .project-list__item:not(.hidden)').length
  const title = document.querySelector<HTMLElement>(isMobile ? '.filter-popup__project-count' : '.map .project-list__title')
  if (title) title.innerText = isMobile ? `показать ${projectNum} проектов` : `${projectNum} проектов найдено`
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
  setProjectsCount()

  createClusters(map)
  createPoints(map, data)

  function filter() {
    const dropdowns = document.querySelectorAll<HTMLElement>('.building-filter .filter__dropdown')
    const checkboxes = document.querySelectorAll<HTMLElement>('.filter-popup .checkbox__list')
    const radios = document.querySelectorAll<HTMLElement>('.radio__list')

    const activeCategoryId = isMobile
      ? document.querySelector<HTMLElement>('.radio_active[data-name="project_type"]')?.dataset.value
      : document.querySelector<HTMLElement>('.building-filter .quick-filter_active')?.dataset.id

    const projects = document.querySelectorAll<ProjectElement>('.map .project-list__item')
    Array.from(projects).forEach(project => {
        project.classList.remove('hidden')

        const dropdownsResult = isDesktop ? Array.from(dropdowns).map<boolean>(dropdown => {
          const name = dropdown.dataset.name
          const listStr = dropdown.querySelector<HTMLElement>('.dropdown__list')?.dataset.value
          const list = JSON.parse(listStr || '[]')

          return list.length === 0
            || !(String(name) in project.dataset)
            || list.includes(project.dataset[String(name) as ProjectPropKeys])
        }) : []

        const checkboxesResult = isMobile ? Array.from(checkboxes).map<boolean>(checkboxList => {
          const name = String(checkboxList.querySelector<HTMLElement>(`.checkbox`)?.dataset.name) as keyof ProjectProperties
          if (!(name in project.dataset)) return true

          const list = Array.from(checkboxList.querySelectorAll<HTMLElement>(`.checkbox_active`)).map(i => String(i.dataset.value))
          return list.length === 0 || list.includes(project.dataset[name])
        }) : []

        const radioResult = isMobile ? Array.from(radios).map<boolean>(radio => {
          const name = String(radio.querySelector<HTMLElement>(`.radio`)?.dataset.name) as keyof ProjectProperties
          if (!(name in project.dataset)) return true

          const activeItem = radio.querySelector<HTMLElement>(`.radio_active`)

          return activeItem === null || activeItem.dataset.value === project.dataset[name]
        }) : []

        const categoryResult = activeCategoryId === 'all' || project.dataset.category === activeCategoryId

        if (
          radioResult.includes(false)
          || dropdownsResult.includes(false)
          || checkboxesResult.includes(false)
          || !categoryResult
        ) project.classList.add('hidden')
      })

    setProjectsCount()
    const source = map.getSource('projects') as GeoJSONSource
    source.setData(getData())
  }

  document.querySelectorAll(':is(.building-filter, .filter-popup) :is(.dropdown__list__item, .quick-filter__item, .radio, .checkbox)').forEach(item => {
    item.addEventListener('click', filter)
  })

  document.querySelector('.map .project-list__content')?.addEventListener('mouseenter', () => scroll.stop())
  document.querySelector('.map .project-list__content')?.addEventListener('mouseleave', () => scroll.start())
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
  x.addEventListener('click', () => {
    x.classList.toggle('infrastructure-list__item_active')
    renderStructureList()

  })
})

renderStructureList()