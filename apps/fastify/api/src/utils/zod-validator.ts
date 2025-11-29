import { FastifySchemaCompiler, FastifySerializerCompiler } from 'fastify';
import { z } from 'zod';

/**
 * Custom Zod validator compatible with Zod v4.
 * 
 * The standard `fastify-type-provider-zod` validator doesn't support Zod v4 yet
 * due to breaking changes in the error structure.
 */
export const zodValidatorCompiler: FastifySchemaCompiler<z.ZodTypeAny> = ({ schema }) => {
  return (data) => {
    const result = schema.safeParse(data);

    if (result.success) {
      return { value: result.data };
    }

    // Zod v4 error handling
    const error = result.error;
    
    // Format errors for Fastify
    const issues = error.issues || [];
    
    return {
      error: new Error(
        issues.map((issue: z.ZodIssue) => {
          const path = issue.path.join('.');
          return path ? `${path}: ${issue.message}` : issue.message;
        }).join(', ') || 'Validation failed'
      ),
    };
  };
};

/**
 * Custom Zod serializer for responses.
 * Passes through data as JSON string.
 */
export const zodSerializerCompiler: FastifySerializerCompiler<z.ZodTypeAny> = () => {
  return (data) => JSON.stringify(data);
};
