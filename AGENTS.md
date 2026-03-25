# 1001 Useless Mechanics

Agent guidance for this repository.

This project is a p5.js gallery of interactive sketches built with Vite and TypeScript.
The app loads sketches from `src/daily/*.ts`, applies a theme, and renders source code with highlight.js.

## What Matters Most

- Prefer small, safe changes that keep sketches working in the browser.
- Preserve the existing sketch-loading flow in `src/main.ts`.
- Keep TypeScript strictness intact; the build already runs `tsc`.
- Match the file you are editing instead of reformatting the whole repo.
- If you add new conventions, make them fit the current style first.

## Repo Signals

- Stack: p5.js, Vite, TypeScript, TailwindCSS, highlight.js, tone.
- No dedicated lint or unit test runner is configured; no Cursor or Copilot rule files are present.
- Existing `AGENTS.md` is the source of repo guidance and should be kept current.

## Working Approach

- Read the smallest relevant files first, then edit only what the task needs.
- Preserve sketch routes, theme switching, and source rendering unless the request says otherwise.
- Prefer additive changes over structural rewrites.
- If a change touches browser behavior, verify it in the dev server after type-checking.
- Treat `src/daily/0_testing.ts` as a useful scratch/debug sketch, not production content.

## Essential Commands

Use npm scripts when possible.

- `npm run dev` - start the Vite dev server for day-to-day sketch work.
- `npm run devHost` - expose the dev server on the network for device testing.
- `npm run build` - run `tsc` and then create a production bundle with Vite.
- `npm run preview` - serve the production build locally for a final smoke test.
- `npm run new-sketch <name>` - create the next numbered sketch in `src/daily/`.
- `npx tsc --noEmit` - run the TypeScript compiler in check-only mode.

## Single Test / Narrow Verification

There is no test framework configured yet, so there is no true single-test command today.
Use `npx tsc --noEmit` for the fastest repo-wide check, then `npm run dev` for browser verification, and `npm run build` before finalizing changes.
If tests are added later, document the exact targeted invocation here.

## Verification Checklist

- `npx tsc --noEmit` passes.
- `npm run build` passes.
- The changed sketch loads from `/sketches/<id>`.
- Theme switching still updates the label and CSS variables.
- Source code highlighting still appears for the active sketch.
- Responsive resizing still works for the canvas.

## Sketch Conventions

- A sketch module should export `setup(p, getColor)` and `draw(p, getColor)`.
- Use `GetColorFn` from `src/theme/types.ts` for theme-aware colors.
- Keep sketch state local unless persistence is truly needed.
- `resizer.p5(p)` is the normal way to make a sketch respond to window changes.
- `createFitCanvas()` is the standard canvas creator for fixed aspect ratios.
- New sketch files should follow `ID_name.ts` naming with a unique numeric prefix.

## TypeScript Guidelines

- Keep `strict`-compatible code; avoid `any` unless there is no practical alternative.
- Prefer explicit types on exported functions, complex objects, and public APIs.
- Use `import type` for type-only imports.
- Prefer `interface` for object shapes that are extended or reused.
- Prefer type aliases for unions, tuples, and callable signatures.
- Do not widen types unnecessarily when a narrow union is available.
- Let inference handle obvious local values when it improves readability.
- Avoid `unknown` unless you immediately narrow it.

## Import Rules

- Group imports as: external packages, local modules, local types.
- Keep type-only imports separate when it improves clarity.
- Match the quote style already used in the file you are editing.
- Do not introduce barrel files unless they reduce obvious duplication.
- Remove unused imports immediately; the tsconfig already disallows them.

## Formatting Rules

- Use 2-space indentation.
- Keep lines reasonably short and readable.
- Avoid semicolon churn; follow the nearby file style.
- Prefer trailing commas in multi-line objects and arrays when the file already uses them.
- Keep object and function layout simple and predictable.
- Do not run a repo-wide reformat unless the user explicitly asked for it.

## Naming Conventions

- Variables and functions: `camelCase`.
- Types, interfaces, and classes: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants, otherwise `camelCase` is acceptable.
- File names for sketches: `number_name.ts`.
- Use descriptive names over abbreviations, except for standard short aliases like `p` in p5 code.

## Error Handling

- Use `try/catch` around dynamic imports, file access, or other fallible operations.
- Log unexpected failures with `console.error`.
- Use `console.warn` for recoverable issues.
- Keep user-facing error messages short and actionable.
- Prefer graceful fallback UI over throwing during app startup.

## p5 and Sketch Style

- Keep `setup` responsible for one-time setup and `draw` for frame updates.
- Reset canvas state explicitly when switching sketches.
- Avoid relying on globals shared across sketches.
- Keep animation state local and deterministic when possible.
- If a sketch needs resizing, update both the resize handler and any cached dimensions.
- Use `getColor('s_bg')`, `getColor('s_primary')`, etc. instead of hard-coded sketch colors.

## Theme and UI Style

- Theme colors live in `src/theme/config.ts`.
- Theme utilities should update CSS variables through `applyThemeToDOM()`.
- Keep theme names stable once exposed in the UI.
- Do not hard-code theme-sensitive colors in unrelated components if a CSS variable exists.
- Preserve the current source-panel and sketch-panel behavior unless a change is clearly intended.

## CSS / HTML Notes

- Keep global style changes in `style.css` focused and intentional.
- Prefer CSS variables for colors that are theme-driven.
- Preserve the touch and overscroll handling already in place unless you are fixing a bug there.
- Avoid broad selector changes that could affect the p5 canvas or source viewer unexpectedly.

## Editing Safety

- Do not overwrite user changes you did not make.
- Do not remove sketches or theme entries unless the user asked for that.
- Be careful with `src/daily/0_testing.ts`; it is a debug sketch and may be useful during development.
- If you change sketch loading, verify direct URLs like `/sketches/<id>` still work.
- If you change theme selection, verify the random theme button and theme label update correctly.

## Before You Finish

- Run `npx tsc --noEmit` for quick confidence.
- Run `npm run build` for final verification.
- Smoke test browser-facing changes with `npm run dev`.
- Update this file if you add a new workflow or command.
