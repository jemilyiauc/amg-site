import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from "./structure"

const SINGLETON_TYPES = ["homePage", "siteSettings", "requestAccessForm"];

// The free plan has no "edit but can't publish" role, so every editor is an
// Administrator. This hides publishing actions in the Studio UI for anyone
// not listed here — a guardrail against accidental publishes, not a security
// boundary (admins can still publish via the API or CLI).
const PUBLISHER_EMAILS = ["emily@testjarlabs.com", "kateh@artestmanagementgroup.com"];
const PUBLISH_ACTIONS = ["publish", "unpublish", "delete"];

export default defineConfig({
  name: 'default',
  title: 'Artest Management Group',

  projectId: 't6w8cnoy',
  dataset: 'production',

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons are protected from the desk structure (see structure.ts), but
    // Sanity's default document menu still offers these actions regardless of
    // how the document was reached. Strip them for singleton types only —
    // Duplicate would create a second document of a singleton type with a
    // random _id, and Delete/Unpublish would remove the only copy of the
    // site's content.
    actions: (prev, context) => {
      let actions = prev;
      if (SINGLETON_TYPES.includes(context.schemaType)) {
        actions = actions.filter((action) => !["duplicate", "delete", "unpublish"].includes(action.action ?? ""));
      }
      const email = context.currentUser?.email?.toLowerCase() ?? "";
      if (!PUBLISHER_EMAILS.includes(email)) {
        actions = actions.filter((action) => !PUBLISH_ACTIONS.includes(action.action ?? ""));
      }
      return actions;
    },

    // The global "create new" menu is derived from every schema type with a
    // create template, independently of structure.ts and of `actions` above.
    // Without this, an editor can still create a second copy of a singleton
    // with a random _id — an orphan the anchored queries would never render.
    newDocumentOptions: (prev) =>
      prev.filter((template) => !SINGLETON_TYPES.includes(template.templateId)),
  },
})
