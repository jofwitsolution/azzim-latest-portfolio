import { collectionHandlers } from "@/lib/api/rest";
import { projectResource } from "@/lib/api/resources";

export const { GET, POST } = collectionHandlers(projectResource);
