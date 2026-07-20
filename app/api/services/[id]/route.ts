import { itemHandlers } from "@/lib/api/rest";
import { serviceResource } from "@/lib/api/resources";

export const { GET, PUT, DELETE } = itemHandlers(serviceResource);
