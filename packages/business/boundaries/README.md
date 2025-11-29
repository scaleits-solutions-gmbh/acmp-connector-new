## OpenAPI generation

Programmatically generate the User Microservice OpenAPI document from contracts and metadata:

```ts
import { generateUserMicroserviceOpenApi } from '@repo/business/boundaries';

const openapi = generateUserMicroserviceOpenApi();
console.log(JSON.stringify(openapi, null, 2));
```

You can wire this into a CLI script or build step to output `openapi.json`.
