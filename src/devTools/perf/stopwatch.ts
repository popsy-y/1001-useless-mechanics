export interface StopwatchEntry {
  label: string
  duration: number
  parent: string | null
  depth: number
}

export class Stopwatch {
  private entries: StopwatchEntry[] = []
  private activeTimers: Array<{ label: string; startTime: number; parent: string | null }> = []

  begin(label: string): void {
    const parent = this.activeTimers.length > 0 
      ? this.activeTimers[this.activeTimers.length - 1].label 
      : null
    
    this.activeTimers.push({
      label,
      startTime: performance.now(),
      parent
    })
  }

  end(): void {
    if (this.activeTimers.length === 0) {
      console.warn('Stopwatch: No active timer to end')
      return
    }

    const timer = this.activeTimers.pop()!
    const endTime = performance.now()
    const duration = endTime - timer.startTime

    this.entries.push({
      label: timer.label,
      duration,
      parent: timer.parent,
      depth: this.activeTimers.length
    })
  }

  scope(label: string, fn: () => void): void {
    this.begin(label)
    fn()
    this.end()
  }

  getEntries(): StopwatchEntry[] {
    return [...this.entries]
  }

  clear(): void {
    this.entries = []
    this.activeTimers = []
  }

  getStats(): Map<string, { total: number; count: number; avg: number }> {
    const stats = new Map<string, { total: number; count: number; avg: number }>()

    for (const entry of this.entries) {
      const existing = stats.get(entry.label)
      if (existing) {
        existing.total += entry.duration
        existing.count += 1
        existing.avg = existing.total / existing.count
      } else {
        stats.set(entry.label, {
          total: entry.duration,
          count: 1,
          avg: entry.duration
        })
      }
    }

    return stats
  }

  formatAll(precision: number = 2): string[] {
    const lines: string[] = []
    
    for (const entry of this.entries) {
      const indent = '  '.repeat(entry.depth)
      const duration = entry.duration.toFixed(precision)
      lines.push(`${indent}${entry.label}: ${duration}ms`)
    }

    return lines
  }

  reset(): void {
    this.entries = []
    this.activeTimers = []
  }
}
