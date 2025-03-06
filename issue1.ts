import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpJsonBodyParser from "@middy/http-json-body-parser";

middy()
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .handler((event, context) => {
    /* 
      typescript hint for event (intersection of all middleware's before return type):

      (parameter) event: APIGatewayProxyEvent & {
          multiValueQueryStringParameters: APIGatewayProxyEventMultiValueQueryStringParameters;
          pathParameters: APIGatewayProxyEventPathParameters;
          queryStringParameters: APIGatewayProxyEventQueryStringParameters;
      } & RequestEvent
    */

    return {};
  });

middy()
  .use([httpJsonBodyParser(), httpEventNormalizer()])
  .handler((event, context) => {
    /*
      typescript hint for event (*only* the first middleware's before return type):

      (parameter) event: APIGatewayProxyEvent & {
          multiValueQueryStringParameters: APIGatewayProxyEventMultiValueQueryStringParameters;
          pathParameters: APIGatewayProxyEventPathParameters;
          queryStringParameters: APIGatewayProxyEventQueryStringParameters;
      }
    */

    return {};
  });
