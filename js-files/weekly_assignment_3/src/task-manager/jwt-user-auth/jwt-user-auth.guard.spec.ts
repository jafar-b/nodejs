import { JwtUserAuthGuard } from './jwt-user-auth.guard';

describe('JwtUserAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtUserAuthGuard()).toBeDefined();
  });
});
