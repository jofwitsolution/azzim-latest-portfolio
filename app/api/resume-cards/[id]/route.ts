import { itemHandlers } from "@/lib/api/rest";
import { resumeCardResource } from "@/lib/api/resources";

export const { GET, PUT, DELETE } = itemHandlers(resumeCardResource);
