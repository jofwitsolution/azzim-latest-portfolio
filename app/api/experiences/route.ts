import { collectionHandlers } from "@/lib/api/rest";
import { experienceResource } from "@/lib/api/resources";

export const { GET, POST } = collectionHandlers(experienceResource);
