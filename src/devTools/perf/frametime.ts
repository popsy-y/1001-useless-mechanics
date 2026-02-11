export class FrameTime {
  private lastFrameTime: number = 0
  private frameTimes: number[] = []
  private maxSamples: number = 60
  private frameCount: number = 0

  newFrame(): void {
    const now = performance.now()
    
    if (this.frameCount > 0) {
      const frameTime = now - this.lastFrameTime
      this.frameTimes.push(frameTime)
      
      if (this.frameTimes.length > this.maxSamples) {
        this.frameTimes.shift()
      }
    }
    
    this.lastFrameTime = now
    this.frameCount++
  }

  getFPS(): number {
    if (this.frameTimes.length === 0) return 0
    
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    return avgFrameTime > 0 ? 1000 / avgFrameTime : 0
  }

  getCurrentFrameTime(): number {
    if (this.frameTimes.length === 0) return 0
    return this.frameTimes[this.frameTimes.length - 1]
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
  }

  format(precision: number = 2): string[] {
    const lines: string[] = []
    
    const fps = this.getFPS().toFixed(precision)
    const current = this.getCurrentFrameTime().toFixed(precision)
    const avg = this.getAverageFrameTime().toFixed(precision)
    
    lines.push(`FPS: ${fps}`)
    lines.push(`Frame Time: ${current}ms`)
    lines.push(`Avg Frame Time: ${avg}ms`)

    return lines
  }

  reset(): void {
    this.frameTimes = []
    this.frameCount = 0
    this.lastFrameTime = 0
  }
}
