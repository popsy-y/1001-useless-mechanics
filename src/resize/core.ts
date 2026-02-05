/**
 * Registar resize funcs to resize event. Uses visualViewport if possible, otherwise window.
 *
 * @param {(() => void)} func Function executed on resize event.
 */
export const subscribe = (func: (() => void)): void => {
    const vv = window.visualViewport

    if (vv) {
        // use visualViewport if available
        // (mostly for smartphone, like collapsable addressbar)
        vv.addEventListener('resize', () => {
            func()
        })
    } else {
        window.addEventListener('resize', () => {
            func()
        })
    }
}