import { createServiceManagementClient, serviceManagementServiceMetadata } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";

const BASE_URL = import.meta.env.VITE_API_URL ?? window.location.origin + serviceManagementServiceMetadata.basePath;

// Create the generated API client
export const client = createServiceManagementClient({
  baseUrl: BASE_URL,
});