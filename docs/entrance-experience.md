# The Art of an Entrance

An interactive catalogue study between homepage collections and product benefits. Uses the existing GSAP installation and CSS perspective; no WebGL, canvas, rendering loop or additional dependency. Both images load lazily through Next Image with small responsive sizes. The paused timeline does no work until an interaction or motion-preference change.

## Source and presentation

- Door: **Arch**, original `PURELINE DOOR.pdf`, page 10. `public/images/arch.webp` stays unchanged. `scripts/prepare-entrance-asset.py` extracts the visible leaf, retaining the original panel proportions, arched glazing, navy finish, gold hardware and three visible right-hand hinges. Reproduce the crop with the bundled Python runtime; coordinates and provenance are in `docs/creative-assets.json`.
- Interior: existing licensed `public/images/architecture/public-interior.webp`, ready made / Pexels. The sunlit timber-lined hall is architectural inspiration, not a Pureline installation. Source and licence are already recorded in the asset manifest.
- The neutral architectural surround, opening angle, visual edge, shadows and lighting are illustrative spatial presentation. They are **not** measured frame/leaf geometry, an engineering cutaway, an approved handing configuration or evidence of performance. No unverified construction measurements are displayed.
- The existing catalogue-preview and CMS publication gates remain in force. This catalogue asset is not injected into the approved live CMS homepage.

## Interaction

The moving leaf has a fixed right-hand transform origin and rotates inward from 0 to −82 degrees. The original front artwork stays opaque throughout normal motion. The interior is on a separate back layer; light, photograph framing, cast shadow and masked headline composition respond to the same normalized opening progress.

Drag right to open and left to close. Pointer capture maintains the gesture outside the doorway; bounds are clamped and release settles to a stop with a short velocity-sensitive decision. Tap/click reverses the current intent. The hit area remains over the aperture when open, making closing easy. Touch uses native `pan-y`, so vertical scrolling is preserved. No scroll-jacking or hover autoplay.

Keyboard: Enter/Space toggle; arrows adjust by 12.5%; Home closes; End opens. A labelled native range input provides direct continuous control. An explicit Open/Close action offers an alternative to dragging. Focus outlines, expanded state, descriptive instructions and settled-state announcements support assistive technology.

Reduced motion replaces rotation and spatial movement with a brief opacity reveal. Runtime preference changes stop active motion and settle the current intent. Without JavaScript a native disclosure reveals the interior and keeps the collection link available. All component animations and media-query listeners are scoped and cleaned up on navigation.

## Reproduce verification

Run the production build, serve it on port 3001, then run `tests/browser/entrance.spec.ts` using `PURELINE_PREVIEW_URL=http://127.0.0.1:3001`. The tests exercise actual DOM transforms, fixed hinge geometry, continuous mouse dragging, reversal, bounded progress, keyboard/slider control, touch taps and CDP touch swipes, native vertical scrolling, runtime reduced motion, no-JavaScript fallback, accessibility, routing cleanup and six viewport sizes.

`scripts/capture-entrance.mjs` records real interactions and captures closed, half-open and open desktop states, plus closed and open mobile states. Evidence is saved under `docs/previews/entrance/`.
