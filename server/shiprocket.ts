import axios from 'axios';

export interface ShiprocketAuth {
  token: string;
  expires_at: string;
}

export interface ShiprocketOrderRequest {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_email?: string;
  shipping_phone?: string;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
    hsn?: number;
  }>;
  payment_method: 'Prepaid' | 'COD';
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface ShiprocketOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

class ShiprocketService {
  private baseURL = 'https://apiv2.shiprocket.in/v1/external';
  private token: string = '';
  private tokenExpiry: Date | null = null;

  private async authenticate(): Promise<string> {
    try {
      const email = process.env.SHIPROCKET_EMAIL;
      const password = process.env.SHIPROCKET_PASSWORD;

      if (!email || !password) {
        throw new Error('Shiprocket credentials not found in environment variables');
      }

      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email,
        password
      });

      console.log('Shiprocket auth response:', response.data);
      
      const data = response.data;
      if (!data.token) {
        throw new Error('No token received from Shiprocket API');
      }
      
      this.token = data.token;
      this.tokenExpiry = new Date(Date.now() + (24 * 60 * 60 * 1000)); // Token valid for 24 hours

      console.log('Shiprocket authentication successful, token format:', typeof this.token, 'length:', this.token.length);
      console.log('Token sample:', this.token.substring(0, 50) + '...');
      return this.token;
    } catch (error) {
      console.error('Shiprocket authentication failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Auth error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw new Error('Failed to authenticate with Shiprocket');
    }
  }

  private async getValidToken(): Promise<string> {
    if (!this.token || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
      const newToken = await this.authenticate();
      return newToken;
    }
    return this.token;
  }

  private getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async ensurePickupAddress(): Promise<void> {
    try {
      const token = await this.getValidToken();
      
      // Check if pickup address exists
      const pickupResponse = await axios.get(
        `${this.baseURL}/settings/company/pickup`,
        { headers: this.getHeaders(token) }
      );

      // If no pickup address exists, create one
      if (!pickupResponse.data.data.shipping_address) {
        console.log('Creating default pickup address for Shiprocket...');
        const pickupData = {
          pickup_location: "Primary",
          name: "Regalyn Store",
          email: process.env.SHIPROCKET_EMAIL || "store@regalyn.com",
          phone: "9876543210",
          address: "123 Main Street",
          address_2: "Business District",
          city: "Chennai",
          state: "Tamil Nadu",
          country: "India",
          pin_code: "600001"
        };
        
        await axios.post(
          `${this.baseURL}/settings/company/addpickup`,
          pickupData,
          { headers: this.getHeaders(token) }
        );
        console.log('Default pickup address created successfully');
      }
    } catch (error) {
      console.error('Failed to ensure pickup address:', error);
    }
  }

  async createOrder(orderData: ShiprocketOrderRequest): Promise<ShiprocketOrderResponse> {
    try {
      // Ensure pickup address exists before creating orders
      await this.ensurePickupAddress();
      
      const token = await this.getValidToken();
      
      console.log('Sending request to Shiprocket with token:', token.substring(0, 20) + '...');
      console.log('Request URL:', `${this.baseURL}/orders/create/adhoc`);
      
      const response = await axios.post(
        `${this.baseURL}/orders/create/adhoc`,
        orderData,
        { headers: this.getHeaders(token) }
      );

      console.log('Shiprocket order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create Shiprocket order:', error);
      if (axios.isAxiosError(error)) {
        console.error('Shiprocket API Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.response?.statusText || 
                           error.message;
        
        throw new Error(`Shiprocket API error (${error.response?.status}): ${errorMessage}`);
      }
      throw new Error('Failed to create shipping order');
    }
  }

  async trackOrder(awbCode: string): Promise<any> {
    try {
      const token = await this.getValidToken();
      
      const response = await axios.get(
        `${this.baseURL}/courier/track/awb/${awbCode}`,
        { headers: this.getHeaders(token) }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to track Shiprocket order:', error);
      throw new Error('Failed to track shipping order');
    }
  }

  async generateAWB(shipmentId: number, courierCompanyId: number): Promise<any> {
    try {
      const token = await this.getValidToken();
      
      const response = await axios.post(
        `${this.baseURL}/courier/assign/awb`,
        {
          shipment_id: shipmentId,
          courier_id: courierCompanyId
        },
        { headers: this.getHeaders(token) }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to generate AWB:', error);
      throw new Error('Failed to generate AWB code');
    }
  }

  async getServiceability(pincode: string, weight: number, orderValue: number): Promise<any> {
    try {
      const token = await this.getValidToken();
      
      const response = await axios.get(
        `${this.baseURL}/courier/serviceability/`,
        {
          headers: this.getHeaders(token),
          params: {
            pickup_postcode: '110001', // Default pickup pincode - should be configurable
            delivery_postcode: pincode,
            weight,
            declared_value: orderValue
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to check serviceability:', error);
      throw new Error('Failed to check shipping serviceability');
    }
  }
}

export const shiprocketService = new ShiprocketService();