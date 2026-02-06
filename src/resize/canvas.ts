import p5 from "p5"

/**
 * Creates a canvas that fits within the window while maintaining aspect ratio.
 * If the ideal size fits within the window, uses the ideal size.
 * Otherwise, scales down to fit within the window while preserving aspect ratio.
 * 
 * @param idealWidth - Ideal canvas width
 * @param idealHeight - Ideal canvas height
 * @param p - p5 context
 * @returns The created canvas renderer
 * 
 * @example
 * ```typescript
 * export const setup = (p: p5) => {
 *   createFitCanvas(600, 600, p)
 * }
 * ```
 */
export const createFitCanvas = (
  idealWidth: number, 
  idealHeight: number, 
  p: p5
): p5.Renderer => {
  const availableWidth = p.windowWidth
  const availableHeight = p.windowHeight
  
  // Calculate scale to fit within available space
  const widthRatio = availableWidth / idealWidth
  const heightRatio = availableHeight / idealHeight
  
  // Use the smaller ratio to ensure it fits in both dimensions
  // Also ensure we don't scale up beyond 100% (max 1)
  const scale = Math.min(widthRatio, heightRatio, 1)
  
  const newWidth = idealWidth * scale
  const newHeight = idealHeight * scale
  
  return p.createCanvas(newWidth, newHeight)
}
