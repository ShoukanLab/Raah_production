import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { projectId, dataset, apiVersion } from "./env";

export default defineConfig({
  basePath: "/studio",
  name: "raah-production",
  title: "Raah Production CMS",

  projectId,
  dataset,
  apiVersion,

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
