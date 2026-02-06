import p5 from "p5"
import { subscribe as init } from "./core"

interface CanvasState {
  idealWidth: number
  idealHeight: number
}

const canvasState = new WeakMap<p5, CanvasState>()

function calculateFitSize(
  idealWidth: number,
  idealHeight: number,
  p: p5
): { width: number; height: number } {
  const availableWidth = p.windowWidth
  const availableHeight = p.windowHeight
  
  // Calculate scale to fit within available space while maintaining aspect ratio
  const widthRatio = availableWidth / idealWidth
  const heightRatio = availableHeight / idealHeight
  
  // Use the smaller ratio to ensure it fits in both dimensions
  // Also ensure we don't scale up beyond 100% (max 1)
  const scale = Math.min(widthRatio, heightRatio, 1)
  
  return {
    width: idealWidth * scale,
    height: idealHeight * scale
  }
}

export class resizer {
    /**
     * Registar on-resize function with p5.js.
     * Captures the current canvas size as the ideal aspect ratio.
     * Additionally,
     * ```body{ margin: 0; }``` and ```%YOUR_CANVAS_ELEMENT%{ display: block; }```
     * is recommended for full-screen view.
     *
     * @param {p5} p p5 context
     * @param {?() => void} [exFunc] Extra function to execute on resize event
     */
    static p5(p: p5, exFunc?: () => void): void;
    
    /**
     * Registar on-resize function with p5.js.
     * Uses the specified ideal width and height to maintain aspect ratio.
     * Additionally,
     * ```body{ margin: 0; }``` and ```%YOUR_CANVAS_ELEMENT%{ display: block; }```
     * is recommended for full-screen view.
     *
     * @param {p5} p p5 context
     * @param {number} idealWidth Ideal canvas width (used to calculate aspect ratio)
     * @param {number} idealHeight Ideal canvas height (used to calculate aspect ratio)
     * @param {?() => void} [exFunc] Extra function to execute on resize event
     */
    static p5(p: p5, idealWidth: number, idealHeight: number, exFunc?: () => void): void;
    
    static p5(
        p: p5,
        ...args: [(() => void)?] | [number, number, (() => void)?]
    ): void {
        let idealWidth: number
        let idealHeight: number
        let exFunc: (() => void) | undefined
        
        if (typeof args[0] === 'number' && typeof args[1] === 'number') {
            // Overload with explicit dimensions
            idealWidth = args[0]
            idealHeight = args[1]
            exFunc = args[2]
        } else {
            // Overload that captures current canvas size
            idealWidth = p.width
            idealHeight = p.height
            exFunc = args[0] as (() => void) | undefined
        }
        
        // Store the ideal dimensions for resize calculations
        canvasState.set(p, { idealWidth, idealHeight })
        
        init(() => {
            const state = canvasState.get(p)
            if (!state) return
            
            const newSize = calculateFitSize(state.idealWidth, state.idealHeight, p)
            
            p.resizeCanvas(newSize.width, newSize.height)
            
            if (exFunc) exFunc()
        })
    }
    
    /**
     * Update the ideal canvas size for maintaining aspect ratio during resize.
     * This allows changing the target size after the resizer has been registered.
     * Also immediately resizes the canvas to fit the new ideal size.
     *
     * @param {p5} p p5 context
     * @param {number} width New ideal width
     * @param {number} height New ideal height
     */
    static setIdealSize(p: p5, width: number, height: number): void {
        canvasState.set(p, { idealWidth: width, idealHeight: height })
        
        // Immediately resize to fit the new ideal size
        const newSize = calculateFitSize(width, height, p)
        p.resizeCanvas(newSize.width, newSize.height)
    }
}
