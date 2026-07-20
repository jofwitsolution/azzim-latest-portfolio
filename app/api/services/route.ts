import { collectionHandlers } from "@/lib/api/rest";
import { serviceResource } from "@/lib/api/resources";

export const { GET, POST } = collectionHandlers(serviceResource);
