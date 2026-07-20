import { itemHandlers } from "@/lib/api/rest";
import { experienceResource } from "@/lib/api/resources";

export const { GET, PUT, DELETE } = itemHandlers(experienceResource);
