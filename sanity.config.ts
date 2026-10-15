import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schema";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) {
  throw new Error(
    "Pureline Studio is not configured. Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in .env.local. See docs/CMS.md.",
  );
}

export default defineConfig({
  name: "pureline",
  title: "Pureline",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Pureline")
          .items([
            S.listItem()
              .title("Site settings")
              .child(
                S.document()
                  .schemaType("globalContent")
                  .documentId("globalContent"),
              ),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "globalContent",
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => option.templateId !== "globalContent"),
  },
});
