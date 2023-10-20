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

export function renderFilledArc(el: HTMLElement | SVGElement, angle: number, radius: number) {
  el.setAttribute('d', describeArc(radius * 2, radius * 2, radius, 0, 360 - angle))
}