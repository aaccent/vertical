function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle - 0.0001)
  const end = polarToCartesian(x, y, radius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [ 'M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y ].join(' ')
}

export function renderArc(el: HTMLElement | SVGElement, angle: number, radius: number, strokeWidth = 2) {
  el.setAttribute('d', describeArc(radius, radius, radius - strokeWidth, 360 - angle, 360))
}

export function renderArcNew(el: HTMLElement | SVGElement, radius: number, strokeWidth = 2) {
  // el.setAttribute('d', describeArc(radius, radius, radius - strokeWidth, 360 - angle, 360))
  el.setAttribute('stroke-dashoffset', radius.toString());
}
export function animateSvgArc(el: HTMLElement | SVGElement, attributeName: string, values: string, dur = 100, repeatCount="indefinite") {
  if(el.contains(el.querySelector('animate'))) {
    const animate = el.querySelector('animate')
    if(!animate) return
    animate.setAttribute('attributeName', attributeName);
    animate.setAttribute('values', values);
    animate.setAttribute('repeatCount', repeatCount);
    animate.setAttribute('dur', dur.toString() + 'ms');
    animate.beginElement();
  } 
  else {
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate.setAttribute('attributeName', attributeName);
    animate.setAttribute('values', values);
    animate.setAttribute('dur', dur.toString() + 'ms');
    animate.setAttribute('repeatCount', repeatCount);
    el.append(animate)
  }
}

export function renderFilledArc(el: HTMLElement | SVGElement, angle: number, radius: number) {
  el.setAttribute('d', describeArc(radius * 2, radius * 2, radius, 0, 360 - angle))
}

export function createCircleSVGNews(className: string, dashoffset = 0) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add(className)
  svg.setAttribute('viewBox', '0 0 100 100')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  // path.style.strokeWidth = '3.5'
  // circleElement.style.stroke = '#fff'
  // path.style.fill = 'none'
  path.setAttribute('stroke-width', '3.5');
  path.setAttribute('stroke', '#fff');
  path.setAttribute('fill', 'none');
  
  
  path.setAttribute('stroke-dasharray', '360');
  path.setAttribute('cx', '50');
  path.setAttribute('cy', '50');
  path.setAttribute('r', '48');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('transform', 'rotate(-90) translate(-100 0)')
  path.setAttribute('stroke-dashoffset', dashoffset.toString());
  svg.append(path)

  return {
    svg, path,
  }
}

export function createCircleSVG(className: string) {
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