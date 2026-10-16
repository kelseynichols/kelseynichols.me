# Font sources

Original Monaspace Xenon `.otf` files. Not referenced by the site — it serves
the subset WOFF2s in `../fonts/` (~60KB each vs ~250KB here).

The subset covers Latin + Latin Extended-A, punctuation, arrows and geometric
shapes, with all OpenType features kept. If a character ever renders in a
fallback font, widen `--unicodes` and regenerate (needs
`pip install fonttools brotli`):

```sh
cd fonts-src && for f in *.otf; do pyftsubset "$f" \
  --unicodes="U+0000-024F,U+02C6,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+25A0-25FF" \
  --layout-features='*' --flavor=woff2 --output-file="../fonts/${f%.otf}.woff2"; done
```
