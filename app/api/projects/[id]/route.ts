import { itemHandlers } from "@/lib/api/rest";
import { projectResource } from "@/lib/api/resources";

export const { GET, PUT, DELETE } = itemHandlers(projectResource);
