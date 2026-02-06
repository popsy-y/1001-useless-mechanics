import type p5 from 'p5'
import type { GetColorFn } from '../theme/types'
import { resizer } from '../resize/resize'
import { createFitCanvas } from '../resize/canvas'

let showStroke = true

export const setup = (p: p5, clr: GetColorFn) => {
  createFitCanvas(600, 600, p)
  resizer.p5(p)

  p.mouseClicked = () => showStroke = !showStroke
  
  p.background(clr('s_bg'))
}

export const draw = (p: p5, clr: GetColorFn) => {
  p.background(clr('s_bg'))
  
  const gap = p.width * 0.1
  const rectSize = (p.width - gap * 3) / 2
  
  const colors: Array<ReturnType<GetColorFn>> = [
    clr('s_primary'),
    clr('s_primary'),
    clr('s_secondary'),
    clr('s_accent')
  ]
  const strokeWeights = [1, 10, 3, 3]
  
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const index = i * 2 + j
      const x = gap + j * (rectSize + gap)
      const y = gap + i * (rectSize + gap)
      
      p.fill(colors[index])
      
      if (showStroke) {
        p.stroke(clr('s_stroke'))
        p.strokeWeight(strokeWeights[index])
      } else {
        p.noStroke()
      }
      
      p.rect(x, y, rectSize, rectSize)
    }
  }
}
