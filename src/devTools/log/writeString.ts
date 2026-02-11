import type p5 from 'p5'

export interface WriteStringOptions {
  x?: number
  y?: number
  lineHeight?: number
  textSize?: number
  color?: string
  alignX?: 'left' | 'center' | 'right'
  alignY?: 'top' | 'center' | 'bottom'
}

export class WriteString {
  private p: p5 | null = null
  private buffer: string[] = []
  private options: Required<WriteStringOptions>
  private defaultOptions: Required<WriteStringOptions> = {
    x: 10,
    y: 10,
    lineHeight: 16,
    textSize: 12,
    color: '#ffffff',
    alignX: 'left',
    alignY: 'top'
  }

  constructor(p?: p5, options?: WriteStringOptions) {
    if (p) {
      this.p = p
    }
    this.options = { ...this.defaultOptions, ...options }
  }

  setP5(p: p5): void {
    this.p = p
  }

  setOptions(options: WriteStringOptions): void {
    this.options = { ...this.options, ...options }
  }

  write(str: string): void {
    this.buffer.push(str)
  }

  writeLine(str: string): void {
    this.write(str)
  }

  writeLines(lines: string[]): void {
    for (const line of lines) {
      this.buffer.push(line)
    }
  }

  clear(): void {
    this.buffer = []
  }

  writeAll(): void {
    if (!this.p) {
      console.warn('WriteString: p5 instance not set')
      return
    }

    if (this.buffer.length === 0) return

    const p = this.p
    p.push()
    
    p.fill(this.options.color)
    p.noStroke()
    p.textSize(this.options.textSize)
    p.textAlign(this.getAlignX(), this.getAlignY())

    let currentY = this.options.y
    
    for (const str of this.buffer) {
      p.text(str, this.options.x, currentY)
      currentY += this.options.lineHeight
    }

    p.pop()
  }

  flush(): void {
    this.writeAll()
    this.clear()
  }

  writeAndFlush(str: string): void {
    this.write(str)
    this.flush()
  }

  writeLinesAndFlush(lines: string[]): void {
    this.writeLines(lines)
    this.flush()
  }

  private getAlignX(): p5['LEFT'] | p5['CENTER'] | p5['RIGHT'] {
    if (!this.p) return 0 as unknown as p5['LEFT']
    
    switch (this.options.alignX) {
      case 'center': return this.p.CENTER
      case 'right': return this.p.RIGHT
      default: return this.p.LEFT
    }
  }

  private getAlignY(): p5['TOP'] | p5['CENTER'] | p5['BOTTOM'] | p5['BASELINE'] {
    if (!this.p) return 0 as unknown as p5['TOP']
    
    switch (this.options.alignY) {
      case 'center': return this.p.CENTER
      case 'bottom': return this.p.BOTTOM
      default: return this.p.TOP
    }
  }

  getBuffer(): string[] {
    return [...this.buffer]
  }

  isEmpty(): boolean {
    return this.buffer.length === 0
  }
}
