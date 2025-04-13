import { VerifyApiKeyMiddlewareMiddleware } from './verify-api-key-middleware.middleware';

describe('VerifyApiKeyMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new VerifyApiKeyMiddlewareMiddleware()).toBeDefined();
  });
});
