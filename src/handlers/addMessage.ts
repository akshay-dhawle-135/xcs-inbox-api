import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  console.log("Received event:", event);  
  console.log("Received event:", event);  

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Message Added!",
      input: event,
    }),
  };

  return response;
};
