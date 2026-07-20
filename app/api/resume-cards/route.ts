import { collectionHandlers } from "@/lib/api/rest";
import { resumeCardResource } from "@/lib/api/resources";

export const { GET, POST } = collectionHandlers(resumeCardResource);
