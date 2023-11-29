import { Map, Marker, NavigationControl } from 'mapbox-gl'
import { scroll } from 'features/animations/scroll'
import './mobile-map'
import { isDesktop } from 'features/adaptive'
import { createProjectsList } from 'components/pageBlocks/map/projectList'
import { createInfrastructureList } from 'components/pageBlocks/map/infrastructureList'

function createSwitcher(mapView: Map) {
  const targetContainer = document.querySelector(':is(.map-block, .project)')
  if (!targetContainer) return

  const switchBtn = document.querySelector('.button-switch')
  if (!switchBtn) return

  switchBtn.addEventListener('click', switchHandler)

  const map = targetContainer.querySelector<HTMLElement>('.map')
  const projectList = targetContainer.querySelector<HTMLElement>(':is(.map-block__project-list, #ajax-response-block)')

  if (!map || !projectList) return
  const mapIsHidden = getComputedStyle(map).display
  map.dataset.hidden = String(mapIsHidden === 'none')
  
  projectList.style.display = map.dataset.hidden === 'true' ? 'block' : ''

  function switchHandler() {
    if (!map || !projectList) return

    if (map.dataset.hidden === 'false') {
      map.style.display = 'none'
      projectList.style.display = 'block'

      map.dataset.hidden = 'true'
    } else {
      map.style.display = 'block'
      mapView.resize()
      projectList.style.display = 'none'
      
      map.dataset.hidden = 'false'
    }
  }
}

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
    locale: {
      "ScrollZoomBlocker.CtrlMessage": "ctrl + scroll для увеличения масштаба карты",
      "ScrollZoomBlocker.CmdMessage" : "⌘ + scroll для увеличения масштаба карты",
      'TouchPanBlocker.Message': 'Используйте два пальца чтобы подвинуть карту',
      'NavigationControl.ZoomIn': 'Увеличить',
      'NavigationControl.ZoomOut': 'Уменьшить',
    },
  })
  map.on('load', () => {
    loadHandler(map, mapContainer)
    createSwitcher(map)
  })
  map.addControl(
      new NavigationControl({
        showCompass: false,
        showZoom: true,
        visualizePitch: false
      }),
      'bottom-right'
    );
}()

function loadHandler(map: Map, mapContainer: HTMLElement) {
  mapContainer.addEventListener('wheel', (e) => {
    scroll.start()
    if (!e.ctrlKey) return

    scroll.stop()
    e.preventDefault()
  }, true)

  if (document.querySelector('.map .project-list:not(.infrastructure-list)')) createProjectsList(map)
  if (document.querySelector('.map .project-list.infrastructure-list')) createInfrastructureList(map)
  createInitMarker(map)
}

interface MainPointElement extends HTMLElement {
  dataset: {
    img: string
    coords: string
  }
}

function createInitMarker(map: Map) {
  const dataEl = document.querySelector<MainPointElement>('.map__init-marker-data')
  if (!dataEl) return

  const markerEl = document.createElement('div')
  markerEl.className = 'map__init-marker'
  markerEl.innerHTML = `
    <div class="map__init-marker-inner">
        <img src="${dataEl.dataset.img}" alt="">
    </div>
  `

  const coords = dataEl
    .dataset
    .coords
    .split(',')
    .map(parseFloat)
    .reverse() as [number, number]

  new Marker({
    element: markerEl,
    anchor: 'bottom',
  })
    .setLngLat(coords)
    .addTo(map);

  if (document.querySelector('.map .project-list')) return

  map.setCenter(coords).setZoom(14)
}

const structureList = document.querySelectorAll<HTMLElement>('.infrastructure-list__item')
console.log(structureList)

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