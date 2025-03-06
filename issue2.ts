import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import { ALBEvent, Context } from "aws-lambda";

/**
 * Middy needs the concept of an "input event" and an "output event"
 * InputEvent - a pre-normalized event that is actually passed to the handler.
 * OutputEvent - a normalized event, that may have been modified after being passed through various middleware
 *              like the httpEventNormalizer below.
 *
 * For example, a reason for using the httpEventNormalizer middleware is for (from https://middy.js.org/docs/middlewares/http-event-normalizer):
 * "making sure that an object for queryStringParameters, multiValueQueryStringParameters, pathParameters, and isBase64Encoded is always available"
 *
 * However, the typing on the below code is not okay with me passing an ALBEvent to this handler, as it is pre-emptively expecting properties like "pathParameters" to be present which does not exist on ALBEvent.
 * But requiring that I pass this in the first place inherently doesn't make sense because that is the purpose of the httpEventNormalizer middleware.
 *
 * You might ask, well, the handler is only being invoked by an event being passed to the lambda in AWS, when would you actually need to call the lambda?
 * Answer: Unit Testing, E2E Testing.
 *
 * Proposal: changing the middy() interface to accept 2 events, an input event, which is what the handler will literally be called with, and an output event, which is the event type inside of the handler function as these are two different things.
 * Current Syntax:  middy<TEvent = unknown, TResult = any, TErr = Error, TContext extends LambdaContext = LambdaContext, TInternal extends Record<string, unknown> = {}>
 * Proposed Syntax: middy<TInputEvent = unknown, TOutputEvent = unknown, ...>
 */

const handler = middy()
  .use(httpEventNormalizer())
  .handler((event, context) => {
    return {};
  });

await handler({} as ALBEvent, {} as Context);

/**
 * Output of `npx tsc`
 *  issue2.ts:32:15 - error TS2345: Argument of type 'ALBEvent' is not assignable to parameter of type 'APIGatewayProxyEvent & { multiValueQueryStringParameters: APIGatewayProxyEventMultiValueQueryStringParameters; pathParameters: APIGatewayProxyEventPathParameters; queryStringParameters: APIGatewayProxyEventQueryStringParameters; }'.
 *   Type 'ALBEvent' is missing the following properties from type 'APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>': pathParameters, stageVariables, resource
 *
 * 32 await handler({} as ALBEvent, {} as Context);
 *                  ~~~~~~~~~~~~~~
 *
 *
 * Found 1 error in issue2.ts:32
 */
