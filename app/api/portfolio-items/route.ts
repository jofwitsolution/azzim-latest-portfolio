import { collectionHandlers } from "@/lib/api/rest";
import { portfolioItemResource } from "@/lib/api/resources";

export const { GET, POST } = collectionHandlers(portfolioItemResource);
