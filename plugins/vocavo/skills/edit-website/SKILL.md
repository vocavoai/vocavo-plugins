---
name: edit-website
description: 'Change an existing website through the engine: texts, images, blocks, pages, navigation, redirects, then preview and publish. Use for "Text ändern", "Bild austauschen", "neue Seite", "Menüpunkt", "Weiterleitung anlegen", "Website bearbeiten", "edit the website".'
---

# Edit the website

The website is maintained only through the MCP tools and these skills, never by editing the host's code or database. All calls `manage-site`, fields inside `params`; writes preview until `confirmed: true`. Edits change the draft; visitors see them after a publish.

1. **Find it.** `manage-site` `overview`, `manage-site` `search-content` (`query`), `manage-site` `get` resource `page` (`id`): the outline with each block's `uuid` and `revision`. One block's data: `manage-site` `get` resource `block` (`page_id`, `block_id`).
2. **Change it.**
   - Text or field: `manage-site` `update-block` (`page_id`, `block_id`, `revision`, `data`). Translatable values merge per locale, lists are replaced whole, null removes. Fields: `describe` `block:<type>`.
   - Add, move, remove: `manage-site` `add-block`, `manage-site` `move-block`, `manage-site` `remove-block`.
   - Page: `manage-site` `create-page`, `manage-site` `update-page`, `manage-site` `delete-page`. A changed slug needs a redirect.
   - Image: `manage-site` `import-media-from-url`, then the media id in the block.
   - Navigation: `manage-site` `set-navigation` replaces the whole list; read it first with `manage-site` `get` resource `navigation`.
   - Redirect: `manage-site` `import-redirects`, `manage-site` `delete-redirect`.
   - Company data: `manage-site` `update-website` `settings`.
   - Design: `theme-authoring`.
3. **Check.** `manage-site` `preview-page` (`page_id`): signed link and issues. Fix errors.
4. **Publish.** With the operator's yes `manage-site` `publish-page` (`page_id`) or `manage-site` `publish-all`. Back to an older version: `manage-site` `list` resource `page-version`, `manage-site` `restore-page-version`, then publish.

Never invent a fact; unknown values go on the block as `clarifications`. A stale `revision` gives `REVISION_CONFLICT`: re-read, merge, resend. An added locale: `manage-site` `update-website` `locales`, then `manage-site` `translation-status`.
