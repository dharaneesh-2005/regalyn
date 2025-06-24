import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Generate a new OTP secret
export function generateSecret(username: string): string {
  return authenticator.generateSecret();
}

// Generate a QR code for the OTP secret
export async function generateQrCode(username: string, secret: string): Promise<string> {
  const service = 'REGALYN Admin';
  const otpauth = authenticator.keyuri(username, service, secret);
  
  try {
    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Verify an OTP token
export function verifyToken(token: string, secret: string): boolean {
  try {
    console.log('Verifying token:', { token, secret, tokenLength: token.length });
    
    // Clean the token - remove any spaces or non-digit characters
    const cleanToken = token.replace(/\D/g, '');
    console.log('Cleaned token:', cleanToken);
    
    if (cleanToken.length !== 6) {
      console.log('Invalid token length:', cleanToken.length);
      return false;
    }
    
    // The token parameter is passed as-is without conversion
    const result = authenticator.verify({ token: cleanToken, secret });
    console.log('Verification result:', result);
    return result;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}