import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { HomeIcon } from "@sanity/icons/Home";

// Singletons — fixed documentId means one document, not a creatable list.
const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string, icon: typeof HomeIcon) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "homePage", "Home Page", HomeIcon),
      singleton(S, "requestAccessForm", "Request Access Form", DocumentIcon),
      singleton(S, "siteSettings", "Site Settings", CogIcon),
      S.divider(),
      orderableDocumentListDeskItem({ type: "teamMember", title: "Team Members", S, context }),
      orderableDocumentListDeskItem({ type: "partner", title: "Partners", S, context }),
    ]);
