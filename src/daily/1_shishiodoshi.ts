import type p5 from 'p5'
import type { GetColorFn } from '../theme/types'
import { resizer } from '../resize/resize'
import { createFitCanvas } from '../resize/canvas'
import { lerp } from '../utility/math'

const PI = 3.141592653589793238
let MN = -PI/4
let MX = PI/2.5
let ang = MX

const aAcc = .01
let aVel = 0

let dragging = false

export const setup = (p: p5, clr: GetColorFn) => {
  createFitCanvas(600, 600, p)
  resizer.p5(p)

  p.strokeWeight(3)

  p.background(clr('s_bg'))

  p.mousePressed = () => {
    startDrag(p)
    return false
  }

  p.mouseDragged = () => {
    return false
  }

  p.mouseReleased = () => {
    endDrag()
    return false
  }
}

export const draw = (p: p5, clr: GetColorFn) => {

  const w = p.width
  const h = p.height

  const cx = p.width/2
  const cy = p.height/2

  p.background(clr('s_bg'))

  // stone
  p.rectMode(p.CORNER)
  p.noStroke()
  p.rect(w*.1, h - h*.3, w*.3, h*.3)

  // body
  p.rectMode(p.CENTER)
  p.fill(clr('s_accent'))
  p.stroke(clr('s_stroke'))
  p.push()
  p.translate(cx, cy)
  p.rotate(ang)
  p.rect(-50, 0, w*.5, 10)
  p.pop()

  // pillar
  p.fill(clr('s_secondary'))
  p.noStroke()
  p.rect(cx, cy + w/4, 10, cy)
  p.circle(cx, cy, 10)

  if (dragging){
    dragging = true

    aVel = 0

    const msx = p.mouseX - cx
    const msy = p.mouseY - cy
    ang = Math.min(MX, Math.max(MN, lerp(ang, -Math.atan2(msx, msy) + PI/2, .02)))
    return
  }else{
    dragging = false
  }

  // ang -> MN
  if (ang < MN || Math.abs(ang - MN) < .01){
    ang = MN
    aVel = -aVel*.6

    if(aVel < .0001){
      aVel = 0
    }
  }else{
    aVel -= aAcc
  }

  ang += aVel
}

const within = (rx: number, ry: number, x: number, y: number) => (x >= 0 && x <= rx && y >= 0 && y <= ry)

const startDrag = (p: p5) => {
  if (within(p.width, p.height, p.mouseX, p.mouseY)) dragging = true
}
const endDrag = () => dragging = false
