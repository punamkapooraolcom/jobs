/**
 * @jest-environment node
 */
import { authService } from '../../src/services/authService';

describe('Auth Service', () => {
  it('should simulate phone sign in', async () => {
    const result = await authService.signInWithPhoneNumber('+15551234567');
    expect(result).toHaveProperty('verificationId');
    expect(result.verificationId).toBe('mock-verification-id');
  });

  it('should simulate OTP verification', async () => {
    const result = await authService.verifyOtp('mock-verification-id', '123456');
    expect(result).toHaveProperty('user');
    expect(result.user.uid).toBe('mock-user-id');
  });
});
