import p5 from "p5"
import { subscribe as init } from "./core"

export class resizer{
    /**
     * Registar on-resize function with p5.js. \
     * Additionaly, \
     * ```body{ margin: 0; }``` and ```%YOUR_CANVAS_ELEMENT%{ display: block; }``` \
     * is recommended for full-screen view.
     *
     * @param {p5} p p5 context
     * @param {?() => void} [exFunc] Extra function to execute on resize event
     */
    static p5 = (p: p5, exFunc?: () => void): void => {
        init(() => {
            p.resizeCanvas(p.windowWidth, p.windowHeight)
            
            if (exFunc) exFunc()
        })
    }
}