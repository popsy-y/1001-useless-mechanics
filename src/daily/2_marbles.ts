import type p5 from 'p5'
import type { GetColorFn } from '../theme/types'
import { createFitCanvas } from '../resize/canvas'
import { resizer } from '../resize/resize'

import * as Tone from 'tone'

let toneActive = false
Tone.start().then(_ => toneActive = true)

// ビー玉をはじけるスケッチ
// はじくと衝突して動く、チリンチリン…みたいな音が鳴る
// box2d.js(https://github.com/kripken/box2d.js/)かも

const windChime = new Tone.FMSynth({
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
    decay: .5,
    sustain: 0,
    release: .4
  }
}).toDestination();

const coolTimeMn = 100
const coolTimeMx = 1000
let currentCoolTime = coolTimeMn
let lastChime = 0

export const setup = (p: p5, getColor: GetColorFn) => {
  createFitCanvas(600, 600, p)
  resizer.p5(p)
  
  p.background(getColor('s_bg'))
}

export const draw = (p: p5, getColor: GetColorFn) => {
  if (Tone.getContext().state == 'running' && p.millis() - lastChime > currentCoolTime){
    const desc = Math.random()
    const alp = desc < .2 ? "A" : desc < .4 ? "B" : desc < .6 ? "C": desc < .8 ? "D" : "E"
    windChime.triggerAttackRelease(alp + "7", "1n")

    lastChime = p.millis()
    currentCoolTime = p.random(coolTimeMn, coolTimeMx)
  }

  p.background(getColor('s_bg'))
  
  p.fill(getColor('s_primary'))
  p.noStroke()
  p.ellipse(p.width / 2, p.height / 2, 100, 100)
  
  // アクセントカラーの小さな円を追加
  p.fill(getColor('s_accent'))
  p.ellipse(p.width / 2 + 30, p.height / 2 - 30, 30, 30)
}
