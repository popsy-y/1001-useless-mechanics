import type p5 from 'p5'
import type { GetColorFn } from '../theme/types'
import { createFitCanvas } from '../resize/canvas'
import { resizer, type ResizeHandle } from '../resize/resize'

import * as Tone from 'tone'

let pan: Tone.FMSynth | null
let reverb: Tone.Reverb | null
let chorus: Tone.Chorus | null
let resizeHandle: ResizeHandle

export const setup = (p: p5, getColor: GetColorFn) => {
  Tone.start()

  createFitCanvas(600, 600, p)
  resizeHandle = resizer.p5(p)
  
  p.background(getColor('s_bg'))

  pan = new Tone.FMSynth({
    harmonicity: 2.7,
    modulationIndex: 12,
    envelope: {
      attack: 0.001,
      decay: 1.5,
      sustain: 0,
      release: 3
    },
    modulation: {
      type: "sine"
    },
    modulationEnvelope: {
      attack: 0.001,
      decay: .3,
      sustain: 0,
      release: .2
    }
  })

  reverb = new Tone.Reverb({
    decay: 3,
    preDelay: .1,
    wet: .3
  })

  chorus = new Tone.Chorus({
    frequency: 1.5,
    delayTime: 1.3,
    depth: 3,
    wet: .3
  })

  pan.connect(reverb)
  reverb.connect(chorus)
  chorus.toDestination()

  p.stroke(getColor('s_stroke'))
  p.strokeWeight(5)

  p.mousePressed = _ => onClick(p)
}

const notes = "C,D,E,G,A".split(',')

const PAN_ORBIT_RADIUS = 100
const PAN_DIAMETER = 150
const NOTE_UNIT = (Math.PI * 2) / notes.length
const TWEEN_DURATION = 600 // ms

let tweenStart: number[] = notes.map(() => -Infinity)

const getTween = (p: p5, i: number): number => {
  const t = (p.millis() - tweenStart[i]) / TWEEN_DURATION
  return Math.min(Math.max(t, 0), 1)
}

export const draw = (p: p5, getColor: GetColorFn) => {
  p.background(getColor('s_bg'))

  const positions = marblePositions(p)
  for (let i = 0; i < notes.length; i++) {
    const { x, y } = positions[i]
    const tween = getTween(p, i)
    // p.fill(getColor('s_secondary'))
    p.fill(
      p.lerpColor(
        p.color(getColor('s_accent')),
        p.color(getColor('s_secondary')),
        tween
      )
    )
    p.circle(x, y, PAN_DIAMETER - (1-Math.pow(tween, 5))*50)
  }
}

const onClick = (p: p5) => {
  const mx = p.mouseX
  const my = p.mouseY

  const positions = marblePositions(p)
  for (let i = notes.length - 1; i >= 0; i--) {
    const { x, y } = positions[i]
    if (Math.hypot(mx - x, my - y) <= PAN_DIAMETER / 2) {
      tweenStart[i] = p.millis()
      pan?.triggerAttackRelease(notes[i] + "5", "1n", Tone.now())
      return
    }
  }
}

const marblePositions = (p: p5) => {
  const cx = p.width / 2
  const cy = p.height / 2
  return notes.map((_, i) => ({
    x: Math.cos(NOTE_UNIT * i) * PAN_ORBIT_RADIUS + cx,
    y: Math.sin(NOTE_UNIT * i) * PAN_ORBIT_RADIUS + cy,
  }))
}

export const close = () => {
  pan = null
  reverb = null
  chorus = null
  tweenStart = notes.map(() => -Infinity)

  if (resizeHandle) {
    resizeHandle()
    resizeHandle = null
  }
}
