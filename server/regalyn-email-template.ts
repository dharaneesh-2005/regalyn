import { Order, OrderItem, Product } from "@shared/schema";

export function generateRegalynOrderEmailTemplate(
  orderNumber: string,
  status: string,
  customerName: string,
  email: string,
  orderItems: any[],
  products: Product[],
  totalAmount: number,
  order?: any
): string {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  
  const estimatedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const orderDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Calculate subtotal, tax, and shipping
  const subtotal = orderItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  const shippingCost = subtotal > 10000 ? 0 : 500; // Free shipping over ₹10,000
  const taxRate = 0.18; // 18% GST
  const taxAmount = Math.round(subtotal * taxRate);
  const finalTotal = subtotal + shippingCost + taxAmount;

  const itemsHtml = orderItems
    .map((item, index) => {
      const product = products.find((p) => p.id === item.productId);
      const imageUrl = product?.imageUrl || "";
      const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
      
      return `
        <tr style="background: ${index % 2 === 0 ? 'rgba(168, 85, 247, 0.05)' : 'rgba(99, 102, 241, 0.05)'};">
          <td style="padding: 20px; border: none;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(168, 85, 247, 0.2);">
                ${imageUrl ? `<img src="${imageUrl}" alt="${product?.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : '⌚'}
              </div>
              <div style="flex: 1;">
                <h4 style="margin: 0 0 5px; color: #f1f5f9; font-weight: 600; font-size: 16px;">${product?.name || 'Regalyn Timepiece'}</h4>
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">Model: ${product?.slug || 'RGL-QE-001'}</p>
                <p style="margin: 2px 0; color: #94a3b8; font-size: 14px;">SKU: ${product?.id ? `RGL-${product.id.toString().padStart(4, '0')}` : 'RGL-0001'}</p>
                <div style="display: flex; gap: 15px; margin-top: 8px;">
                  <span style="color: #a855f7; font-weight: 500; font-size: 14px;">Qty: ${item.quantity}</span>
                  <span style="color: #a855f7; font-weight: 500; font-size: 14px;">₹${Number(item.price || 0).toLocaleString()} each</span>
                </div>
                ${item.metaData ? `<p style="margin: 5px 0 0; color: #cbd5e1; font-size: 13px;">Variant: ${item.metaData}</p>` : ''}
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; color: #f1f5f9; font-weight: 600; font-size: 18px;">₹${itemTotal.toLocaleString()}</p>
                <p style="margin: 5px 0 0; color: #10b981; font-size: 13px; font-weight: 500;">✓ In Stock</p>
              </div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - REGALYN</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #f1f5f9;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 650px;
      margin: 0 auto;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.2);
    }
    
    .header {
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6366f1 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    .brand-name {
      font-family: 'Orbitron', monospace;
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 4px;
      margin-bottom: 10px;
      text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
      position: relative;
      z-index: 2;
    }
    
    .tagline {
      font-size: 16px;
      font-weight: 300;
      letter-spacing: 2px;
      opacity: 0.9;
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
    }
    
    .order-number {
      font-family: 'Orbitron', monospace;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 2px;
      background: rgba(255, 255, 255, 0.15);
      padding: 12px 24px;
      border-radius: 50px;
      display: inline-block;
      margin-top: 15px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 2;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .status-badge {
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      display: inline-block;
      margin-bottom: 30px;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
      animation: glow 3s ease-in-out infinite;
    }
    
    .order-details {
      background: rgba(168, 85, 247, 0.05);
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
      border: 1px solid rgba(168, 85, 247, 0.2);
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.2);
    }
    
    .total-section {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
      padding: 25px;
      border-radius: 16px;
      margin: 30px 0;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    
    .total-amount {
      font-size: 28px;
      font-weight: 700;
      color: #a855f7;
      text-align: right;
      font-family: 'Orbitron', monospace;
      letter-spacing: 1px;
    }
    
    .delivery-info {
      background: rgba(99, 102, 241, 0.1);
      padding: 25px;
      border-radius: 16px;
      margin: 30px 0;
      border-left: 4px solid #a855f7;
    }
    
    .footer {
      background: rgba(0, 0, 0, 0.3);
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(168, 85, 247, 0.2);
    }
    
    .footer-links {
      margin: 20px 0;
    }
    
    .footer-link {
      color: #a855f7;
      text-decoration: none;
      margin: 0 15px;
      font-weight: 500;
    }
    
    .footer-link:hover {
      color: #7c3aed;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
      50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
    }
    
    @media (max-width: 600px) {
      .container {
        margin: 10px;
        border-radius: 16px;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .brand-name {
        font-size: 36px;
      }
      
      .content {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="brand-name">REGALYN</h1>
      <p class="tagline">QUANTUM PRECISION ENGINEERING</p>
      <div class="order-number">ORDER #${orderNumber}</div>
    </div>
    
    <!-- Content -->
    <div class="content">
      <div class="status-badge">
        ${status === "processing" ? "⚡ PROCESSING" : status === "completed" ? "✓ COMPLETED" : "🎯 CONFIRMED"}
      </div>
      
      <h2 style="color: #a855f7; margin-bottom: 15px; font-size: 24px; font-weight: 600;">Timepiece Order Confirmed</h2>
      
      <p style="margin-bottom: 20px; color: #cbd5e1; line-height: 1.7;">
        Dear ${customerName},
      </p>
      
      <p style="margin-bottom: 30px; color: #cbd5e1; line-height: 1.7;">
        Your order for premium Regalyn timepieces has been confirmed. Each watch represents the pinnacle of quantum engineering and timeless design, crafted for the visionaries of tomorrow.
      </p>
      
      <!-- Order Details -->
      <div class="order-details">
        <h3 style="color: #f1f5f9; margin-bottom: 20px; font-size: 20px; font-weight: 600;">Order Details</h3>
        
        <table class="items-table">
          <thead>
            <tr style="background: rgba(168, 85, 247, 0.2);">
              <th style="padding: 15px 20px; text-align: left; color: #f1f5f9; font-weight: 600; border: none;">Item</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
      
      <!-- Order Summary -->
      <div class="total-section">
        <h3 style="color: #f1f5f9; margin-bottom: 20px; font-size: 18px; font-weight: 600;">Order Summary</h3>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #cbd5e1;">Subtotal (${orderItems.length} item${orderItems.length > 1 ? 's' : ''})</span>
            <span style="color: #f1f5f9; font-weight: 500;">₹${subtotal.toLocaleString()}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #cbd5e1;">GST (18%)</span>
            <span style="color: #f1f5f9; font-weight: 500;">₹${taxAmount.toLocaleString()}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span style="color: #cbd5e1;">
              Shipping ${shippingCost === 0 ? '(Free over ₹10,000)' : ''}
            </span>
            <span style="color: ${shippingCost === 0 ? '#10b981' : '#f1f5f9'}; font-weight: 500;">
              ${shippingCost === 0 ? 'FREE' : '₹' + shippingCost.toLocaleString()}
            </span>
          </div>
          
          <div style="border-top: 1px solid rgba(168, 85, 247, 0.3); padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #f1f5f9; font-size: 20px; font-weight: 600;">Total Amount</span>
              <span class="total-amount">₹${totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order Information -->
      <div style="background: rgba(99, 102, 241, 0.05); border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid rgba(99, 102, 241, 0.2);">
        <h4 style="color: #6366f1; margin-bottom: 15px; font-size: 16px; font-weight: 600;">📋 Order Information</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; color: #cbd5e1; font-size: 14px;">
          <div>
            <strong style="color: #f1f5f9;">Order Date:</strong><br>
            ${orderDate}
          </div>
          <div>
            <strong style="color: #f1f5f9;">Payment Method:</strong><br>
            ${order?.paymentMethod || 'Online Payment'}
          </div>
          <div>
            <strong style="color: #f1f5f9;">Email:</strong><br>
            ${email}
          </div>
          <div>
            <strong style="color: #f1f5f9;">Order Status:</strong><br>
            <span style="color: #10b981; font-weight: 500;">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
        </div>
      </div>
      
      <!-- Shipping Address -->
      <div style="background: rgba(16, 185, 129, 0.05); border-radius: 16px; padding: 25px; margin: 30px 0; border-left: 4px solid #10b981;">
        <h4 style="color: #10b981; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🚚 Shipping Address</h4>
        <div style="color: #cbd5e1; line-height: 1.6;">
          <strong style="color: #f1f5f9;">${order?.shippingAddress?.name || customerName}</strong><br>
          ${order?.shippingAddress?.address || 'Address will be confirmed before shipping'}<br>
          ${order?.shippingAddress?.city ? order.shippingAddress.city + ', ' : ''}${order?.shippingAddress?.state || ''} ${order?.shippingAddress?.zipCode || ''}<br>
          ${order?.shippingAddress?.country || 'India'}<br>
          ${order?.shippingAddress?.phone ? 'Phone: ' + order.shippingAddress.phone : ''}
        </div>
      </div>
      
      <!-- Delivery Timeline -->
      <div class="delivery-info">
        <h4 style="color: #a855f7; margin-bottom: 15px; font-size: 16px; font-weight: 600;">⚡ Quantum Delivery Timeline</h4>
        <div style="background: rgba(168, 85, 247, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="color: #cbd5e1;">Processing</span>
            <span style="color: #10b981; font-weight: 500;">✓ 1-2 business days</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="color: #cbd5e1;">Shipping</span>
            <span style="color: #a855f7; font-weight: 500;">📦 2-3 business days</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #f1f5f9; font-weight: 600;">Expected Delivery</span>
            <span style="color: #f1f5f9; font-weight: 600;">${estimatedDeliveryDate}</span>
          </div>
        </div>
        <p style="color: #cbd5e1; margin: 0; font-size: 14px;">
          Your precision timepiece will be carefully packaged with quantum-level security and shipped via premium courier service with real-time tracking.
        </p>
      </div>
      
      <!-- Warranty & Support -->
      <div style="background: rgba(245, 158, 11, 0.05); border-radius: 16px; padding: 25px; margin: 30px 0; border-left: 4px solid #f59e0b;">
        <h4 style="color: #f59e0b; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🛡️ Warranty & Support</h4>
        <div style="color: #cbd5e1; line-height: 1.6;">
          <div style="margin-bottom: 12px;">
            <strong style="color: #f1f5f9;">🔧 2-Year International Warranty</strong><br>
            <span style="font-size: 14px;">Complete coverage for all mechanical and electronic components</span>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #f1f5f9;">📞 24/7 Quantum Support</strong><br>
            <span style="font-size: 14px;">Expert technicians available for any questions or concerns</span>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #f1f5f9;">🔄 30-Day Return Policy</strong><br>
            <span style="font-size: 14px;">Not satisfied? Return within 30 days for full refund</span>
          </div>
          <div>
            <strong style="color: #f1f5f9;">🎯 Lifetime Service Guarantee</strong><br>
            <span style="font-size: 14px;">Professional servicing and maintenance for life</span>
          </div>
        </div>
      </div>
      
      <!-- What's Next -->
      <div style="background: rgba(168, 85, 247, 0.1); border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid rgba(168, 85, 247, 0.3); text-align: center;">
        <h4 style="color: #a855f7; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🚀 What Happens Next?</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
          <div style="text-align: center;">
            <div style="background: rgba(168, 85, 247, 0.2); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px;">1️⃣</div>
            <strong style="color: #f1f5f9; display: block; margin-bottom: 5px;">Order Processing</strong>
            <span style="color: #cbd5e1; font-size: 13px;">We'll prepare your timepiece with quantum precision</span>
          </div>
          <div style="text-align: center;">
            <div style="background: rgba(168, 85, 247, 0.2); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px;">2️⃣</div>
            <strong style="color: #f1f5f9; display: block; margin-bottom: 5px;">Shipping Notification</strong>
            <span style="color: #cbd5e1; font-size: 13px;">You'll receive tracking details via email</span>
          </div>
          <div style="text-align: center;">
            <div style="background: rgba(168, 85, 247, 0.2); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px;">3️⃣</div>
            <strong style="color: #f1f5f9; display: block; margin-bottom: 5px;">Delivery</strong>
            <span style="color: #cbd5e1; font-size: 13px;">Your premium timepiece arrives at your doorstep</span>
          </div>
        </div>
      </div>
      
      <div style="background: rgba(168, 85, 247, 0.05); padding: 20px; border-radius: 12px; margin: 30px 0; border: 1px solid rgba(168, 85, 247, 0.2);">
        <p style="color: #cbd5e1; margin: 0; text-align: center; font-style: italic;">
          "Time is the most precious gift. Thank you for choosing Regalyn to measure yours."
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div style="background: rgba(168, 85, 247, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
        <h4 style="color: #a855f7; margin-bottom: 15px; font-size: 16px; font-weight: 600;">📞 Need Help?</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; color: #cbd5e1; font-size: 14px;">
          <div>
            <strong style="color: #f1f5f9;">📧 Email Support:</strong><br>
            support@regalyn.com<br>
            <span style="color: #94a3b8; font-size: 13px;">Response within 2 hours</span>
          </div>
          <div>
            <strong style="color: #f1f5f9;">📱 WhatsApp:</strong><br>
            +91 98765 43210<br>
            <span style="color: #94a3b8; font-size: 13px;">24/7 instant support</span>
          </div>
          <div>
            <strong style="color: #f1f5f9;">🌐 Live Chat:</strong><br>
            www.regalyn.com/chat<br>
            <span style="color: #94a3b8; font-size: 13px;">Online 9 AM - 9 PM IST</span>
          </div>
        </div>
      </div>
      
      <p style="color: #94a3b8; margin-bottom: 20px; text-align: center;">
        Questions about your order? We're here to help with quantum-level precision.
      </p>
      
      <div class="footer-links" style="text-align: center; margin-bottom: 25px;">
        <a href="https://regalyn.com/track-order?order=${orderNumber}" class="footer-link" style="background: rgba(168, 85, 247, 0.1); padding: 8px 16px; border-radius: 6px; margin: 0 8px; display: inline-block;">📦 Track Order</a>
        <a href="https://regalyn.com/support" class="footer-link" style="background: rgba(99, 102, 241, 0.1); padding: 8px 16px; border-radius: 6px; margin: 0 8px; display: inline-block;">🛠️ Support</a>
        <a href="https://regalyn.com/returns" class="footer-link" style="background: rgba(16, 185, 129, 0.1); padding: 8px 16px; border-radius: 6px; margin: 0 8px; display: inline-block;">🔄 Returns</a>
      </div>
      
      <div style="border-top: 1px solid rgba(168, 85, 247, 0.2); padding-top: 20px; text-align: center;">
        <p style="color: #64748b; font-size: 14px; margin: 0;">
          © 2025 REGALYN - Quantum Precision Engineering<br>
          <span style="font-size: 12px; color: #475569;">This email was sent regarding your order #${orderNumber}. Please save this email for your records.</span>
        </p>
        
        <div style="margin-top: 15px;">
          <span style="color: #64748b; font-size: 12px;">Follow us: </span>
          <a href="#" style="color: #a855f7; text-decoration: none; margin: 0 8px; font-size: 12px;">Instagram</a>
          <a href="#" style="color: #a855f7; text-decoration: none; margin: 0 8px; font-size: 12px;">Facebook</a>
          <a href="#" style="color: #a855f7; text-decoration: none; margin: 0 8px; font-size: 12px;">Twitter</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}