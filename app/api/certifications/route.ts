import { collectionHandlers } from "@/lib/api/rest";
import { certificationResource } from "@/lib/api/resources";

export const { GET, POST } = collectionHandlers(certificationResource);
