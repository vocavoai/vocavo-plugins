---
name: theme-authoring-blocks
description: 'The blocks every theme renders, overrides of block schemas (optional fields only), schema versions, icons and theme-specific blocks with their fallback. Detail guide of theme-authoring.'
---

# Theme authoring: blocks and fallbacks

- `basis` has these blocks: `hero`, `text`, `text_image`, `image_collage`, `gallery`, `reviews_slider`, `cta_banner`, `badges`, `quote`, `faq`, `features`, `team`, `video`, `form`, `contact`, `map`, `legal_text`, `spacer`. Variants and fields: `manage-site` `describe` `block:<key>`. A theme renders them all; a missing one falls back to `basis` markup. The live list is `describe` subject `blocks`.
- Overrides of `basis` schemas may only add optional fields. A partial override is enough: `{"extends": "hero", "fields": [<new optional field>]}` inherits the rest, so later `basis` changes reach it. Pass it as `schema` of `manage-site` `write-theme-file`.
- Pages see new block fields only after `manage-site` `publish-theme`: block data is validated against the published theme.
- **Icons:** names that `partial/icon` of the chain draws; see `describe` `block:<key>`.
- **Theme-specific block.** Key it in your theme's namespace and declare a `fallback`, so content survives a theme switch: `{"block": "hero", "variant": "split", "map": {"<basis field>": "<own field>"}, "defaults": {}}` (either side may be `repeater[].subfield`). `manage-site` `switch-theme` refuses what cannot be shown.
- **Blocks with engine data** (`form`, `contact`, `map`): override markup only, never the data. A `form` override loops over `form.fields` and keeps the `data-*` hooks of `basis`; prefer not to override it. A host adds its own blocks and data through its config (`block_paths`, `data_providers`), not through MCP.
- **Rich text** comes sanitized from `richtext` fields. There is no `raw` filter.
- **Clarifications.** A block may carry `clarifications` (unconfirmed facts). The engine prints them in previews only; an override never has to handle them.
- **UI text** (inputs, buttons, forms, numbers) uses the `--brand-font-ui` token; a theme with a decorative body face points it at its readable sans.
