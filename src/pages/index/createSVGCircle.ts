export function createCircleSVG(className = 'lead-section__mobile__page') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add(className)

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.style.strokeWidth = '3.5'
  path.style.stroke = '#fff'
  path.style.fill = 'none'

  svg.append(path)

  return {
    svg, path,
  }
}