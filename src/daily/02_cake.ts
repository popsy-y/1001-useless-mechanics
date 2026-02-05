import type p5 from 'p5'

export const setup = (p: p5) => {
  p.createCanvas(600, 600)

  p.rectMode(p.CENTER)
  p.noStroke()

  refresh()
}

type Range = {mn: number, mx: number}

const rnd = (mn: number, mx: number) => mn + Math.random() * (mx - mn)

const layerRange: Range = {mn: 5, mx: 8}
let n_layers = Math.round(rnd(layerRange.mn, layerRange.mx))

type RGB = [r: number, g: number, b: number]
const palette: RGB[] = [
  [247, 240, 240],
  [237, 223, 199],
  [255, 147, 135]
]

let colors: RGB[] = []

export const draw = (p: p5) => {
  p.background(220)

  for (let i = 0; i < n_layers; i++) {
    const clr = colors[i]

    p.fill(clr[0], clr[1], clr[2])
    p.ellipse(p.width / 2, p.height / 2 - (15 * i), 100, 30)
  }

  if (p.frameCount % 30 == 0){
    refresh()
  }
}

const refresh = () => {
  n_layers = Math.round(rnd(layerRange.mn, layerRange.mx))
  colors = new Array(n_layers).fill(0).map(_ => palette[Math.floor(rnd(0, palette.length))])
}