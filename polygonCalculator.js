const cos60 = Math.cos(Math.PI/3)
const sin60 = Math.sin(Math.PI/3)


// 配置
const config = {
  // 背景大圆半径
  r: 45,
  centerCircleR: 1.5,
  // 分数的字体大小, 同时决定背景圆大小
  pointFontSize: 5,
  // 分数
  points : [95, 65, 45, 95, 45, 75],
  // 蛛网图内层各层的比例分布
  ratios: [0.88, 0.8, 0.65, 0.4],
  // 视窗大小
  viewPortWidth: 110,
  viewPortHeight: 110,
  // 渐变中心色
  gradientStart: 'white',
  // 渐变终结色
  gradientEnd: '#E9DDE0'

}
config.netBaseRatio = (config.r - config.pointFontSize) / config.r

// 蛛网图上各点的计算函数
const handlerMap = {
  0: function calculator1(point, r, ratio = 1, centerX, centerY) {
    return [centerX - (point/100) * r * cos60 * ratio, centerY - (point/100) * r * sin60 * ratio]
  },
  1: function calculator2(point, r, ratio = 1) {
    return [centerX + (point/100) * r * cos60 * ratio, centerY - (point/100) * r * sin60 * ratio]
  },
  2: function calculator3(point, r, ratio = 1) {
    return [centerX + (point/100) * ratio * r, centerY]
  },
  3: function calculator4(point, r, ratio = 1) {
    return [centerX + (point/100) * r * cos60 * ratio, centerY + (point/100) * r * sin60 * ratio]
  },
  4: function calculator5(point, r, ratio = 1) {
    return [centerX - (point/100) * r * cos60 * ratio, centerY + (point/100) * r * sin60 * ratio]
  },
  5: function calculator6(point, r, ratio = 1) {
    return [centerX - (point/100)* r * ratio, centerY]
  }
}

// 整张图的中心点
const centerX = config.viewPortWidth * 0.5
const centerY = config.viewPortHeight * 0.5

// 各个分数所在坐标
const fontPosition = Array
  .from({length: 6},(k,v) =>v)
  .map(idx=>handlerMap[idx](100, config.r, 1, centerX, centerY))
  .map(corPair => corPair.map(value => +value.toFixed(2)))

// 蛛网图
const allNets = config.ratios
  .map((ratio, index) => {
    const final = config.points
      .map((point, pointIndex) => [point, handlerMap[pointIndex]])
      .map(([point, handler]) => handler(point, config.r ,ratio * config.netBaseRatio, centerX, centerY))
      .map(cor => cor.map(num => +num.toFixed(2)).join(','))
      .join(' ')
    if (index === 0) {
      return(`  <polygon points="${final}" fill="rgba(0,0,0,0)" stroke="black" stroke-width="0.1"/>`)
    } else {
      return(`  <polygon points="${final}" fill="rgba(0,0,0,0)" stroke="rgba(0, 0, 0, 0.5)" stroke-width="0.1"/>`)
    }
  })
// 添加最外层蛛网图的点
const maxNetPoints = config.points.map((point, pointIndex) => [point, handlerMap[pointIndex]])
  .map(([point, handler]) => handler(point, config.r ,1 * config.netBaseRatio, centerX, centerY))
  .map(cor => cor.map(num => +num.toFixed(2)).join(','))
  .join(' ')
const maxNet = `<polygon points="${maxNetPoints}" fill="url(#exampleGradient)" stroke="${config.gradientEnd}" stroke-width="0.1"/>`
allNets.unshift(maxNet)
const net = allNets.join('\n')

// 分数及背景的小圆
const textCorMap = {
  0: [centerX - config.r * cos60, (centerY - config.r * sin60)].map(num => +num.toFixed(2)),
  1: [centerX + config.r * cos60, (centerY - config.r * sin60)].map(num => +num.toFixed(2)),
  2: [centerX + config.r, centerY],
  3: [centerX + config.r * cos60, (centerY + config.r * sin60)].map(num => +num.toFixed(2)),
  4: [centerX - config.r * cos60, (centerY + config.r * sin60)].map(num => +num.toFixed(2)),
  5: [centerX - config.r, centerY],
}
const pointText = config.points
  .map((point, index) => {
    const centerPoint = textCorMap[index]
    return `
    <circle cx="${centerPoint[0]}" cy="${centerPoint[1]}" r="${config.pointFontSize}" fill="black"/>
    <text x="${centerPoint[0]}" y="${centerPoint[1]}" font-size="${config.pointFontSize}" dominant-baseline="central" text-anchor="middle" fill="white">${point}</text>`
  })
  .join('\n')

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${config.viewPortWidth} ${config.viewPortHeight}">
  <rect width="100%" height="100%" fill="rgba(255,255,255,0.5)" stroke="black"/>
  <!-- 渐变 -->
  <radialGradient id="exampleGradient">
    <stop offset="0" stop-color="${config.gradientStart}"/>
    <stop offset="95%" stop-color="${config.gradientEnd}"/>
  </radialGradient>
  <!-- 背景大圆 -->
  <circle cx="${config.viewPortWidth * 0.5}" cy="${config.viewPortHeight * 0.5}" r="${config.r}" fill="white" stroke-width="0.2" stroke="#cdcdcd"/>
  <!-- 固定连接小圆的线 -->
  <line stroke-width="0.2" stroke-dasharray="2 1" x1="${fontPosition[0][0]}" y1="${fontPosition[0][1]}" x2="${fontPosition[1][0]}" y2="${fontPosition[1][1]}" stroke="#cacaca"/>
  <line stroke-width="0.2" stroke-dasharray="2 1" x1="${fontPosition[1][0]}" y1="${fontPosition[1][1]}" x2="${fontPosition[2][0]}" y2="${fontPosition[2][1]}" stroke="#cacaca"/>
  <line stroke-width="0.2" stroke-dasharray="2 1" x1="${fontPosition[2][0]}" y1="${fontPosition[2][1]}" x2="${fontPosition[3][0]}" y2="${fontPosition[3][1]}" stroke="#cacaca"/>
  <line stroke-width="0.2" stroke-dasharray="2 1" x1="${fontPosition[3][0]}" y1="${fontPosition[3][1]}" x2="${fontPosition[4][0]}" y2="${fontPosition[4][1]}" stroke="#cacaca"/>
  <line stroke-width="0.2" stroke-dasharray="2 1" x1="${fontPosition[4][0]}" y1="${fontPosition[4][1]}" x2="${fontPosition[5][0]}" y2="${fontPosition[5][1]}" stroke="#cacaca"/>
  <line stroke-width="0.2" stroke-dasharray="2 1" x1="${fontPosition[5][0]}" y1="${fontPosition[5][1]}" x2="${fontPosition[0][0]}" y2="${fontPosition[0][1]}" stroke="#cacaca"/>
  <!-- 蛛网线 -->
    <!-- 第一点 x: 50 - (point/100) * r * cos(pi/3) * ratio, y: 50 - (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第二点 x: 50 + (point/100) * r * cos(pi/3) * ratio, y: 50 - (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第三点 x: 50 + (point/100) * r * ratio, y: 50 -->
    <!-- 第四点 x: 50 + (point/100) * r * cos(pi/3) * ratio, y: 50 + (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第五点 x: 50 - (point/100) * r * cos(pi/3) * ratio, y: 50 + (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第六点 x: 50 - (point/100) * r * ratio, y: 50 -->
  ${net}
  <!-- 固定放射线 -->
  <line stroke-width="0.1" x1="${fontPosition[0][0]}" y1="${fontPosition[0][1]}" x2="${centerX}" y2="${centerY}" stroke="#9c9c9c"/>
  <line stroke-width="0.1" x1="${fontPosition[1][0]}" y1="${fontPosition[1][1]}" x2="${centerX}" y2="${centerY}" stroke="#9c9c9c"/>
  <line stroke-width="0.1" x1="${fontPosition[2][0]}" y1="${fontPosition[2][1]}" x2="${centerX}" y2="${centerY}" stroke="#9c9c9c"/>
  <line stroke-width="0.1" x1="${fontPosition[3][0]}" y1="${fontPosition[3][1]}" x2="${centerX}" y2="${centerY}" stroke="#9c9c9c"/>
  <line stroke-width="0.1" x1="${fontPosition[4][0]}" y1="${fontPosition[4][1]}" x2="${centerX}" y2="${centerY}" stroke="#9c9c9c"/>
  <line stroke-width="0.1" x1="${fontPosition[5][0]}" y1="${fontPosition[5][1]}" x2="${centerX}" y2="${centerY}" stroke="#9c9c9c"/>
  <!-- 分数及背景小圆 -->
  ${pointText}
  <!-- 中心小圆 -->
  <circle cx="${config.viewPortWidth * 0.5}" cy="${config.viewPortHeight * 0.5}" r="${config.centerCircleR}" fill="black"/>
  </svg>
`

console.log(svg)
const fs = require('fs')
const path = require('path')
fs.writeFile(path.join(__dirname, 'd.svg'), svg, err => err && console.log(err))
