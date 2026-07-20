import { itemHandlers } from "@/lib/api/rest";
import { certificationResource } from "@/lib/api/resources";

export const { GET, PUT, DELETE } = itemHandlers(certificationResource);
