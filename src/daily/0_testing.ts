import type p5 from 'p5'
import type { GetColorFn } from '../theme/types'
import { resizer } from '../resize/resize'
import { createFitCanvas } from '../resize/canvas'
import { FrameTime } from '../devTools/perf/frametime'
import { Stopwatch } from '../devTools/perf/stopwatch'
import { WriteString } from '../devTools/log/writeString'

let showStroke = true

const ft = new FrameTime()
const sw = new Stopwatch()
const ws = new WriteString()

export const setup = (p: p5, clr: GetColorFn) => {
  createFitCanvas(600, 600, p)
  resizer.p5(p)
  
  ws.setP5(p)
  ws.setOptions({
    x: 10,
    y: 10,
    lineHeight: 16,
    textSize: 12,
    color: clr('s_stroke')
  })

  p.mouseClicked = () => showStroke = !showStroke
  
  p.background(clr('s_bg'))
}

export const draw = (p: p5, clr: GetColorFn) => {
  ft.newFrame()
  
  p.background(clr('s_bg'))
  
  sw.begin('draw_rects')
  
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
  
  sw.end()
  
  ws.writeLines([...ft.format(), '', '--- Sections ---', ...sw.formatAll()])
  ws.writeAll()
  ws.clear()
  sw.reset()
}
