import type p5 from 'p5'
import type { GetColorFn } from '../theme/types'
import { resizer } from '../resize/resize'
import { createFitCanvas } from '../resize/canvas'

export const setup = (p: p5, clr: GetColorFn) => {
  createFitCanvas(600, 600, p)
  resizer.p5(p)
  
  p.background(clr('s_bg'))
}

export const draw = (p: p5, clr: GetColorFn) => {
  p.background(clr('s_bg'))
  
  p.fill(clr('s_fill'))
  p.noStroke()
  p.ellipse(p.width / 2, p.height / 2, 100, 100)
  
  // アクセントカラーの小さな円を追加
  p.fill(clr('s_accent'))
  p.ellipse(p.width / 2 + 30, p.height / 2 - 30, 30, 30)
}
