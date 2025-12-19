import { objectToBase64Xml } from '../xml-base64';

/**
 * Request body for SICS Publish endpoint.
 */
export interface PublishRequestBody {
  Body: string;
  Routing_Key: string;
  VirtualRouter: string;
  ExchangeType: string;
  Callback_VirtualRouter: string;
  Callback_Routing_Key: string;
}

/**
 * Parameters for creating a publish request body.
 */
export interface PublishRequestBodyParams {
  /** The command object to publish */
  command: object;
  /** ACMP routing key */
  acmpRoutingKey: string;
  /** ACMP virtual router */
  acmpVirtualRouter: string;
  /** Unique identifier for this publish operation */
  publishIdentifier: string;
}

/**
 * Creates the request body for SICS publish operations.
 *
 * @param params - Publish parameters
 * @returns Publish request body
 */
export function getPublishRequestBody(params: PublishRequestBodyParams): PublishRequestBody {
  return {
    Body: objectToBase64Xml(params.command),
    Routing_Key: params.acmpRoutingKey,
    VirtualRouter: params.acmpVirtualRouter,
    ExchangeType: 'ROUTING',
    Callback_VirtualRouter: params.publishIdentifier,
    Callback_Routing_Key: params.publishIdentifier,
  };
}
