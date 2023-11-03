import { Map, Popup } from 'mapbox-gl'

export function createPopup(coordinates: [ number, number ], props: { [p: string]: string }) {
  const price = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    notation: 'compact',
  }).format(parseInt(props.price))

  const name = props.name.toLowerCase().includes('жк')
    ? props.name.toLowerCase().replace('жк', 'ЖК')
    : `${props.name.at(0)?.toUpperCase()}${props.name.slice(1)}`

  return new Popup({
    closeButton: false,
    className: 'project-list__map-popup',
    offset: 35,
    anchor: 'bottom',
  })
    .setLngLat(coordinates)
    .setHTML(`
      <span class="label-title">${name}</span>
      <span> — </span>
      <span class="label-price">от ${price}</span>
    `)
}