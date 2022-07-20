const cos60 = Math.cos(Math.PI/3)
const sin60 = Math.sin(Math.PI/3)

// 蛛网图节点计算函数
function calculator1(point, r, ratio = 1, len=100) {
  return [0.5 - (point/100) * r * cos60 * ratio, 0.5 - (point/100) * r * sin60 * ratio].map(val => val * len)
}

function calculator2(point, r, ratio = 1, len=100) {
  return [0.5 + (point/100) * r * cos60 * ratio, 0.5 - (point/100) * r * sin60 * ratio].map(val => val * len)
}

function calculator3(point, r, ratio = 1, len=100) {
  return [0.5 + (point/100) * ratio * r, 0.5].map(val => val * len)
}

function calculator4(point, r, ratio = 1, len=100) {
  return [0.5 + (point/100) * r * cos60 * ratio, 0.5 + (point/100) * r * sin60 * ratio].map(val => val * len)
}

function calculator5(point, r, ratio = 1, len=100) {
  return [0.5 - (point/100) * r * cos60 * ratio, 0.5 + (point/100) * r * sin60 * ratio].map(val => val * len)
}

function calculator6(point, r, ratio = 1, len=100) {
  return [0.5 - (point/100)* r * ratio, 0.5].map(val => val * len)
}

// 固定第一部分
console.log(`
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
  <rect width="100%" height="100%" fill="rgba(255,255,255,0.5)"/>
  <!-- 渐变 -->
  <radialGradient id="exampleGradient">
    <stop offset="0" stop-color="white"/>
    <stop offset="95%" stop-color="#ccc"/>
  </radialGradient>
  <!-- 背景大圆 -->
  <circle cx="50%" cy="50%" r="45%" fill="white" stroke-width="0.1" stroke="#ccc"/>
  <!-- 固定连接小圆的线 -->
  <line stroke-width="0.1" x1="27.5" y1="11" x2="72.5" y2="11" stroke="#505050"/>
  <line stroke-width="0.1" x1="72.5" y1="11" x2="95" y2="50" stroke="#505050"/>
  <line stroke-width="0.1" x1="95" y1="50" x2="72.5" y2="89" stroke="#505050"/>
  <line stroke-width="0.1" x1="72.5" y1="89" x2="27.5" y2="89" stroke="#505050"/>
  <line stroke-width="0.1" x1="27.5" y1="89" x2="5" y2="50" stroke="#505050"/>
  <line stroke-width="0.1" x1="5" y1="50" x2="27.5" y2="11" stroke="#505050"/>
  <!-- 蛛网线 -->
    <!-- 第一点 x: 0.5 - (point/100) * r * cos(pi/3) * ratio, y: 0.5 - (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第二点 x: 0.5 + (point/100) * r * cos(pi/3) * ratio, y: 0.5 - (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第三点 x: 0.5 + (point/100) * r * ratio, y: 0.5 -->
    <!-- 第四点 x: 0.5 + (point/100) * r * cos(pi/3) * ratio, y: 0.5 + (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第五点 x: 0.5 - (point/100) * r * cos(pi/3) * ratio, y: 0.5 + (point/100) * r * sin(pi/3) * ratio -->
    <!-- 第六点 x: 0.5 - (point/100) * r * ratio, y: 0.5 -->
`)

// 蛛网图参数部分
const r = 0.45
const len = 100
const points = [88, 70, 80, 80, 60, 80]
const ratios = [0.88, 0.8, 0.65, 0.4]

// 蛛网图
ratios.forEach((ratio, ratioIndex) => {
    const handlerMap = {
      0: calculator1,
      1: calculator2,
      2: calculator3,
      3: calculator4,
      4: calculator5,
      5: calculator6
    }
    const final = points.map((point, pointIndex) => [point, handlerMap[pointIndex]])
    .map(([point, handler]) => handler(point, r ,ratio, len))
    .map(cor => cor.map(num => num.toFixed(2)).join(','))
    .join(' ')
  if (ratioIndex === 0) {
    console.log(`  <polygon points="${final}" fill="url(#exampleGradient)" stroke="black" stroke-width="0.1"/>`)
  } else {
    console.log(`  <polygon points="${final}" fill="rgba(0,0,0,0)" stroke="black" stroke-width="0.1"/>`)
  }
})

// 固定放射线
console.log(`
  <!-- 固定放射线 -->
  <line stroke-width="0.1" x1="27.5" y1="11" x2="50" y2="50" stroke="#505050"/>
  <line stroke-width="0.1" x1="72.5" y1="11" x2="50" y2="50" stroke="#505050"/>
  <line stroke-width="0.1" x1="95" y1="50" x2="50" y2="50" stroke="#505050"/>
  <line stroke-width="0.1" x1="72.5" y1="89" x2="50" y2="50" stroke="#505050"/>
  <line stroke-width="0.1" x1="27.5" y1="89" x2="50" y2="50" stroke="#505050"/>
  <line stroke-width="0.1" x1="5" y1="50" x2="50" y2="50" stroke="#505050"/>
`)

const textMap = {
  0: [50 - r * len * cos60, (50 - r * len * sin60)].map(num => +num.toFixed(2)),
  1: [50 + r * len * cos60, (50 - r * len * sin60)].map(num => +num.toFixed(2)),
  2: [50 + r * len, 50],
  3: [50 + r * len * cos60, (50 + r * len * sin60)].map(num => +num.toFixed(2)),
  4: [50 - r * len * cos60, (50 + r * len * sin60)].map(num => +num.toFixed(2)),
  5: [50 - r * len, 50],
}
console.log('  <!-- 分数及背景小圆 -->')
const fontSize = 5
// 分数及背景的小圆
points.forEach((point, index) => {
  const centerPoint = textMap[index]
  console.log(`  <circle cx="${centerPoint[0]}" cy="${centerPoint[1]}" r="${fontSize}" fill="#505050"/>`)
  console.log(`  <text x="${centerPoint[0]}" y="${centerPoint[1]}" font-size="${fontSize}" dominant-baseline="central" text-anchor="middle" fill="white">${point}</text>`)
})
// 固定closetag
console.log(`
</svg>
`)

