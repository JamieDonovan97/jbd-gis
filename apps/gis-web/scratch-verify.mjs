import { chromium } from 'playwright'
const OUT = process.argv[2]
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('canvas.maplibregl-canvas', { timeout: 20000 })
await page.waitForTimeout(8000)
await page.screenshot({ path: `${OUT}/10-default-clustered.png` })

// Pan the map a long way (drag left+up) to test that lots follow the view
const box = await page.locator('canvas.maplibregl-canvas').boundingBox()
const cx = box.x + 450
const cy = box.y + 400
await page.mouse.move(cx, cy)
await page.mouse.down()
await page.mouse.move(cx - 350, cy - 250, { steps: 20 })
await page.mouse.up()
await page.waitForTimeout(6000)
await page.screenshot({ path: `${OUT}/11-after-pan.png` })

// Zoom in twice to break clusters apart
await page.mouse.move(cx, cy)
await page.mouse.dblclick(cx, cy)
await page.waitForTimeout(2500)
await page.mouse.dblclick(cx, cy)
await page.waitForTimeout(5000)
await page.screenshot({ path: `${OUT}/12-zoomed-in.png` })

console.log(JSON.stringify({ errors }))
await browser.close()
