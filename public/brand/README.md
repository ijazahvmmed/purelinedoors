# Pureline supplied logo

`pureline-symbol.png` is an exact copy of the transparent PNG supplied by the user on 14 October 2026, expressly requested for use as the website logo. Dimensions: 715 × 768. SHA-256: `0373fb2648c858f32fae1b892d7157b6ed75dd560c8e1aa4fdff713a0f98461a`.

The shared wordmark uses the original green symbol with the Pureline name. On dark photographic navigation and in the mobile menu, CSS `filter: brightness(0) invert(1)` produces a white inverse from the same alpha channel. This preserves the supplied geometry. Next.js serves responsive small-size versions in the interface. The browser icon in `src/app/icon.png` is a 64px transparent, proportion-preserving derivative; the original is unchanged. `scripts/prepare-homepage-assets.py` reproduces the icon from the original.
