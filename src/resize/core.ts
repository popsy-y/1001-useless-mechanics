/**
 * Registar resize funcs to resize event. Uses visualViewport if possible, otherwise window.
 *
 * @param {(() => void)} func Function executed on resize event.
 * @returns {() => void} Unsubscribe function.
 */
export const subscribe = (func: (() => void)): (() => void) => {
  const vv = window.visualViewport
  const target = vv ?? window
  const handler = () => {
    func()
  }

  target.addEventListener('resize', handler)

  return () => {
    target.removeEventListener('resize', handler)
  }
}
