import { itemHandlers } from "@/lib/api/rest";
import { portfolioItemResource } from "@/lib/api/resources";

export const { GET, PUT, DELETE } = itemHandlers(portfolioItemResource);
