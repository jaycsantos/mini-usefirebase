import { logger } from 'firebase-functions';
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';

export const httpCallable = onRequest((request, response) => {
  const data = request.body.data;
  if (data === 'error') {
    throw new HttpsError('invalid-argument', 'error', 'error');
  }
  response.send({ data });
});

export const sdkCallable = onCall(async (request) => {
  const data = request.data;
  logger.info(data);
  if (data === 'error') {
    throw new HttpsError('invalid-argument', 'error', 'error');
  }
  return data;
});
