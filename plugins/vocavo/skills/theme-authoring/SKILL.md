---
name: theme-authoring
description: 'Build or change a website theme: Twig templates, blocks, design tokens, fonts and colours, with validate, preview and publish. Use for "Theme bauen", "Design anpassen", "Block anpassen", "Farben ändern", "Schrift ändern", "Vorlage bearbeiten", "theme authoring", "change the design".'
---

# Theme authoring

Themes are data: tokens plus Twig and CSS files in a sandbox, inheriting own theme → parent → system theme `basis`. Change as little as possible and keep content theme-independent. Target: PageSpeed mobile at least 95 on the published site.

**Calls.** All through `manage-site`, fields inside `params`. Writes preview until the same call comes with `confirmed: true`. Theme files and tokens are drafts; visitors see them after `manage-site` `publish-theme`, on a website switched to the theme.

Details: `theme-authoring-blocks` before adding or overriding a block, `theme-authoring-site-parts` for navigation, forms, contact data, social links, video.

## When to use what

Decide in this order:

1. Only colours, logo, corner style → website settings: `manage-site` `update-website` `settings.brand` (`describe` subject `settings`). Live after the cache purge, no theme needed, no publish.
2. A variant or field of a block does it → no code.
3. Only looks → theme tokens, then `css/theme`.
4. Markup must differ → override the block (`manage-site` `fork-block`), ideally a wrapper.
5. Really new structure → a theme-specific block with `fallback`.

**A theme starts as a child of `basis`, not as a copy.** Every copied file misses later `basis` fixes. Do not override `layout/base`, `partial/header` or `partial/footer` for looks; do it only when the markup must differ (a 1:1 migration), and write down why.

**Recipes: how to get it without a fork**

| Want | Do |
|---|---|
| Section headings look different | override `partial/heading` (vars `eyebrow`, `headline`, `level`, `id`, `align`) |
| Buttons look different | override `partial/ctas` (vars `ctas`, `class`, `on_dark`) |
| Another hero or text_image variant | wrapper block: your variant, else `{% include "@basis/block/<key>" %}` |
| Dark or light section | `--brand-*` on the wrapper |
| Header and footer look | `--header-*`, `--footer-*` in `css/theme`, token group `schemes` |

**Tokens, utilities or custom CSS?** A recurring value (colour, font, radius, spacing) is a token. Markup you own gets Tailwind utilities. Art direction a utility cannot say goes unlayered into `css/theme`. Never copy `basis` CSS (`css.parent_copy`), never `!important`.

## 1. Understand the current theme

`manage-site` `overview`, then `manage-site` `describe` with `subject`: `theme-chain` (chain, tokens, resolved files), `blocks`, `block:<key>`, `template:<key>`, `twig-context`. `manage-site` `get` or `list` with resource `theme` and `theme-file` read themes and files (`theme_id`, `key`).

## 2. Create or fork

- `manage-site` `fork-theme` (`key`, `name`, `parent_key: "basis"`, `copy_files: false`): inherits everything, overrides only what you add. A chain has at most 4 levels, `basis` included.
- `manage-site` `fork-block` (`theme_id`, `block`, `with_schema?`) copies one block's markup into your draft.

## 3. Edit

**Inheritance in one line: CSS is added, Twig is replaced.** Every CSS file of the chain is compiled, `basis` first. Put only your overrides into `css/theme`. Twig: the nearest theme wins; a block override without `schema` keeps the inherited fields.

- `manage-site` `write-theme-file` (`theme_id`, `key`, `source`, `schema?`). Keys: `layout/<name>`, `template/<name>`, `block/<key>`, `partial/<name>`, `css/<name>`, `translations/<locale>`. An invalid file is refused with file, line and fix.
- `manage-site` `update-theme-tokens` (`theme_id`, `tokens` patch, null removes). Groups: `colors`, `fonts`, `radii`, `spacing`, `shadows`, `motion`, `text`, `leading`, `tracking`, `weights`, `breakpoints`, `containers` become Tailwind theme variables (`--color-*`, `--font-*`, `--radius-*`, `--spacing-*`, `--shadow-*`, `--ease-*`, `--text-*`, `--leading-*`, `--tracking-*`, `--font-weight-*`, `--breakpoint-*`, `--container-*`), so the utilities text-caption, max-w-measure and lg: follow them; a name like h1--line-height in `text` sets the line height of text-h1; `schemes` sets surfaces (`{"schemes": {"footer": "dark"}}`, light, dark, auto). Token values are ASCII.

**Layers.** `basis` components live in `@layer components`, utilities in `@layer utilities`. Write theme rules unlayered: unlayered CSS beats every layer.

**Tokens that matter**

- Brand colours: `colors.primary`, `secondary`, `accent`, `background`, `surface`, `text`, or `settings.brand.colors`; website settings beat theme tokens. Read them as `var(--brand-primary)`, `var(--color-primary)`; never a fixed hex (`css.fixed_color`). A dark `background` makes page and header dark, with derived text colours.
- Dark section: override `--brand-background`, `--brand-text`, `--brand-surface` on its wrapper, never `--color-*` (`css.color_token_remap`). A rule that gives a component a background also sets `color` (`css.surface_without_foreground`).
- Surfaces on `:root`: `--header-bg`, `--header-fg`, `--header-line`, `--footer-bg`, `--footer-fg`, `--footer-line`, `--field-bg`, `--field-fg`, `--field-border`, `--hero-dark-bg`.
- Sizes: `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-lead`, `--text-eyebrow`; spacing `--spacing-section`, `--spacing-gutter`; logos `spacing.logo-header`, `spacing.logo-footer`.

**Fonts.** `basis` brings self-hosted Plus Jakarta Sans and Source Sans 3; own themes have no font records yet.

- System fonts: set `--brand-font-display` and `--brand-font-body` on `:root` in `css/theme`.
- Web fonts: an `@font-face` rule in `css/theme` with `src: url(...)`. Allowed targets: `/websites/themes/<key>/…` or `/storage/…` on this site, the media URL, or a `data:font/...` URL. Never a third-party URL. Import the font file through `manage-site` `import-media-from-url` with `use: "font"` (`url` of the .woff2 or .woff file, optional `family`, `weight` "400" or "300 900", `style`): it returns `css_url` (a root-relative `/storage/…` path, same origin on every site host, so no CORS) and `font_face`, a ready `@font-face` rule to paste into `css/theme`. One import per file (weight/style). Only WOFF2/WOFF, at most 2 MB. Check the licence before importing (Google Fonts are OFL and may be self-hosted; a commercial font needs a web licence), use `font-display: swap` for display fonts, and add a metric-matched fallback.

**Logos.** Render only with `logo()`, never `<img src>` of a media URL. Size with the tokens above. After each publish look at header, footer and hero at 390 and 1280 px.

## 4. Sandbox rules (validation enforces them)

- Strict Twig sandbox: only allowed tags, filters and functions; no `raw`, no method or property calls on objects. `include`, `extends` and `embed` names are string literals; a parent's file is `@<theme>/…`.
- Engine functions return data; the list is `describe` subject `twig-context`. Every layout calls `head()` and `body_end()`; never print meta tags or JSON-LD yourself. Structured data comes only from the engine.
- Raw media URLs (`<img>`, CSS backgrounds) of AI-labelled images need `{{ ai_label(id) }}` in the wrapping element (`ai_label.missing`).
- Links go through `url()` and `page_url()`. Loops are bounded (`bounded_range`, at most 1000).
- CSS: Tailwind v4 classes as complete literals, no string-built class names (`css.dynamic_class`), no `@import`, no third-party URLs. The engine adds the typography plugin: use the prose class, configured with `--tw-prose-*` in `css/theme`; a theme file itself never holds a plugin statement.
- No `style` attributes or `<style>` in Twig (`css.inline_style`): use Tailwind utilities with tokens.

## 5. Validate, preview, publish

1. `manage-site` `validate-theme` (`theme_id`): syntax, sandbox, schemas, CSS, trial render. Fix every error, warnings where sensible (`css.undefined_variable`, `translation.missing`, `css.parent_copy`, `theme.chain`, `template.missing`).
2. `manage-site` `preview-page` (`page_id`, `theme_id`, `theme_draft: true`): a signed link of real pages in the draft theme.
3. If a PageSpeed key is configured and the operator agreed: `manage-seo` `run-pagespeed` with `page_id`, `version: "draft"`, `theme_id`, `theme_draft: true`. SEO is capped on drafts by noindex.
4. `manage-site` `publish-theme` (`theme_id`): validates, compiles and writes a version. Read `warnings`.
5. `manage-site` `switch-theme` (`theme_id`; null is `basis`): live at once. Blocks of a type the new theme lacks are refused (`THEME_INCOMPATIBLE`); `force: true` hides them.

## Failure handling

- Validation error: read the hint, fix the file, validate again. Never work around the sandbox.
- Trial render over its limit: reduce loops and recursion.
- A hint or function the engine lacks: fix it in the package repository, not in the theme.
