import dotenv from 'dotenv';
dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'শুভ নববর্ষ - ICE বিভাগ', email: ADMIN_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('ইমেইল পাঠাতে সমস্যা:', error);
    return { success: false, error };
  }
};

const orderItemsHtml = (items) => {
  return items.map(item => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #2a2a3e; color: #e0e0e0; font-family: 'Hind Siliguri', sans-serif;">${item.name}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #2a2a3e; color: #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #2a2a3e; color: #ffd700; text-align: right; font-weight: bold;">৳${item.price * item.quantity}</td>
    </tr>
  `).join('');
};

export const sendOrderConfirmation = async (order) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: 'Hind Siliguri', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; border: 1px solid #2a2a4e;">
        <div style="background: linear-gradient(135deg, #ff6b35, #e63946, #d4a843); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-family: 'Hind Siliguri', sans-serif;">🎉 শুভ নববর্ষ ১৪৩৩</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">আইসিই বিভাগ | পহেলা বৈশাখ স্টল</p>
        </div>
        <div style="padding: 30px;">
          <div style="background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h2 style="color: #ffd700; margin: 0 0 8px; font-size: 20px; font-family: 'Hind Siliguri', sans-serif;">✅ অর্ডার নিশ্চিত হয়েছে!</h2>
            <p style="color: #a0a0b0; margin: 0; font-size: 14px;">অর্ডার নম্বর: <strong style="color: #ffd700;">#${order.order_number}</strong></p>
          </div>
          <div style="margin-bottom: 24px;">
            <p style="color: #a0a0b0; margin: 0 0 4px; font-size: 14px;">প্রিয়,</p>
            <p style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">${order.customer_name}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: rgba(255,107,53,0.2);">
                <th style="padding: 12px 16px; text-align: left; color: #ff6b35; font-family: 'Hind Siliguri', sans-serif; border-bottom: 2px solid #ff6b35;">আইটেম</th>
                <th style="padding: 12px 16px; text-align: center; color: #ff6b35; font-family: 'Hind Siliguri', sans-serif; border-bottom: 2px solid #ff6b35;">পরিমাণ</th>
                <th style="padding: 12px 16px; text-align: right; color: #ff6b35; font-family: 'Hind Siliguri', sans-serif; border-bottom: 2px solid #ff6b35;">মূল্য</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml(order.items)}
            </tbody>
          </table>
          <div style="background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.3); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #e0e0e0; font-size: 18px; font-family: 'Hind Siliguri', sans-serif;">মোট মূল্য:</span>
            <span style="color: #ffd700; font-size: 24px; font-weight: 700;">৳${order.total_amount}</span>
          </div>
          <div style="margin-top: 20px; background: rgba(100,100,255,0.1); border: 1px solid rgba(100,100,255,0.3); border-radius: 12px; padding: 16px;">
            <p style="color: #a0a0b0; margin: 0 0 4px; font-size: 14px;">পেমেন্ট পদ্ধতি:</p>
            <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600;">${order.payment_method === 'ক্যাশ' ? '💵 ক্যাশ পেমেন্ট' : '📱 অনলাইন পেমেন্ট (bKash/Nagad)'}</p>
          </div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 20px; text-align: center;">
          <p style="color: #666; margin: 0; font-size: 12px; font-family: 'Hind Siliguri', sans-serif;">© ২০২৬ আইসিই বিভাগ | পহেলা বৈশাখ ১৪৩৩</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: order.customer_email,
    subject: `🎉 অর্ডার নিশ্চিত — #${order.order_number} | শুভ নববর্ষ ICE স্টল`,
    htmlContent: html,
  });
};

export const sendAdminNewOrderNotification = async (order) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: 'Hind Siliguri', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 20px auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 16px; overflow: hidden; border: 1px solid #2a2a4e;">
        <div style="background: linear-gradient(135deg, #e63946, #ff6b35); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">🔔 নতুন অর্ডার এসেছে!</h1>
        </div>
        <div style="padding: 30px;">
          <div style="display: grid; gap: 12px; margin-bottom: 20px;">
            <div style="background: rgba(255,215,0,0.1); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255,215,0,0.2);">
              <span style="color: #a0a0b0; font-size: 13px;">অর্ডার নম্বর</span><br>
              <strong style="color: #ffd700; font-size: 18px;">#${order.order_number}</strong>
            </div>
            <div style="background: rgba(255,107,53,0.1); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255,107,53,0.2);">
              <span style="color: #a0a0b0; font-size: 13px;">গ্রাহক</span><br>
              <strong style="color: #fff; font-size: 16px;">${order.customer_name}</strong><br>
              <span style="color: #a0a0b0; font-size: 13px;">${order.customer_email}</span>
            </div>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <thead>
              <tr style="background: rgba(255,107,53,0.2);">
                <th style="padding: 10px; text-align: left; color: #ff6b35; border-bottom: 2px solid #ff6b35;">আইটেম</th>
                <th style="padding: 10px; text-align: center; color: #ff6b35; border-bottom: 2px solid #ff6b35;">পরিমাণ</th>
                <th style="padding: 10px; text-align: right; color: #ff6b35; border-bottom: 2px solid #ff6b35;">মূল্য</th>
              </tr>
            </thead>
            <tbody>${orderItemsHtml(order.items)}</tbody>
          </table>
          <div style="background: rgba(255,107,53,0.15); padding: 16px; border-radius: 10px; text-align: center;">
            <span style="color: #e0e0e0;">মোট:</span>
            <strong style="color: #ffd700; font-size: 22px; margin-left: 8px;">৳${order.total_amount}</strong>
            <span style="color: #a0a0b0; margin-left: 12px;">| ${order.payment_method}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 নতুন অর্ডার #${order.order_number} — ৳${order.total_amount}`,
    htmlContent: html,
  });
};

export const sendAdminStockAlert = async (item) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: 'Hind Siliguri', Arial, sans-serif;">
      <div style="max-width: 500px; margin: 20px auto; background: linear-gradient(135deg, #1a1a2e, #2d1b1b); border-radius: 16px; overflow: hidden; border: 1px solid #4a2020;">
        <div style="background: linear-gradient(135deg, #e63946, #c0392b); padding: 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">⚠️ স্টক শেষ সতর্কতা</h1>
        </div>
        <div style="padding: 24px; text-align: center;">
          <p style="color: #e0e0e0; font-size: 18px; margin: 0 0 8px;">
            <strong style="color: #ff6b6b;">${item.name}</strong>
          </p>
          <p style="color: #a0a0b0; font-size: 14px; margin: 0;">এই আইটেমটি "স্টক শেষ" হিসেবে চিহ্নিত করা হয়েছে।</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `⚠️ স্টক শেষ: ${item.name}`,
    htmlContent: html,
  });
};

export const sendOrderCompletedEmail = async (order) => {
  const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: 'Hind Siliguri', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 20px auto; background: linear-gradient(135deg, #0f1f0f 0%, #1a2e1a 100%); border-radius: 20px; overflow: hidden; border: 1px solid #1e4d1e;">
        <div style="background: linear-gradient(135deg, #16a34a, #15803d, #4ade80); padding: 40px 30px; text-align: center;">
          <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="font-size: 40px;">✅</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-family: 'Hind Siliguri', sans-serif;">অর্ডার সম্পন্ন হয়েছে!</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">পহেলা বৈশাখ স্টল — ICE বিভাগ</p>
        </div>
        <div style="padding: 36px 30px;">
          <div style="background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); border-radius: 14px; padding: 20px; margin-bottom: 28px; text-align: center;">
            <p style="color: #86efac; margin: 0 0 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">অর্ডার নম্বর</p>
            <p style="color: #4ade80; font-size: 28px; font-weight: 700; margin: 0;">#${order.order_number}</p>
          </div>
          <p style="color: #a0a0b0; margin: 0 0 6px; font-size: 14px;">প্রিয়,</p>
          <p style="color: #ffffff; margin: 0 0 24px; font-size: 20px; font-weight: 600;">${order.customer_name}</p>
          <p style="color: #d0d0e0; margin: 0 0 24px; line-height: 1.7; font-size: 15px;">
            আপনার অর্ডারটি সংগ্রহ করার জন্য ধন্যবাদ।
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: rgba(74,222,128,0.15);">
                <th style="padding: 12px 16px; text-align: left; color: #4ade80; font-size: 13px; border-bottom: 1px solid rgba(74,222,128,0.2);">আইটেম</th>
                <th style="padding: 12px 16px; text-align: center; color: #4ade80; font-size: 13px; border-bottom: 1px solid rgba(74,222,128,0.2);">পরিমাণ</th>
                <th style="padding: 12px 16px; text-align: right; color: #4ade80; font-size: 13px; border-bottom: 1px solid rgba(74,222,128,0.2);">মূল্য</th>
              </tr>
            </thead>
            <tbody>
              ${parsedItems.map(item => `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e0e0e0;">${item.name}</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e0e0e0; text-align: center;">${item.quantity}</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffd700; text-align: right; font-weight: bold;">৳${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #e0e0e0; font-size: 16px;">মোট পরিমাণ</span>
            <span style="color: #4ade80; font-size: 26px; font-weight: 700;">৳${order.total_amount}</span>
          </div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
          <p style="color: #555; margin: 0; font-size: 12px;">© ২০২৬ ICE বিভাগ | পহেলা বৈশাখ ১৪৩৩ 🌸</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: order.customer_email,
    subject: `✅ অর্ডার সম্পন্ন — #${order.order_number} | পহেলা বৈশাখ ICE স্টল`,
    htmlContent: html,
  });
};

export const sendOrderCancelledEmail = async (order) => {
  const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: 'Hind Siliguri', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 20px auto; background: linear-gradient(135deg, #1f0a0a 0%, #2e1010 100%); border-radius: 20px; overflow: hidden; border: 1px solid #4d1e1e;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c, #f87171); padding: 40px 30px; text-align: center;">
          <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="font-size: 40px;">❌</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-family: 'Hind Siliguri', sans-serif;">অর্ডার বাতিল হয়েছে</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">পহেলা বৈশাখ স্টল — ICE বিভাগ</p>
        </div>
        <div style="padding: 36px 30px;">
          <div style="background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.3); border-radius: 14px; padding: 20px; margin-bottom: 28px; text-align: center;">
            <p style="color: #fca5a5; margin: 0 0 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">অর্ডার নম্বর</p>
            <p style="color: #f87171; font-size: 28px; font-weight: 700; margin: 0;">#${order.order_number}</p>
          </div>
          <p style="color: #a0a0b0; margin: 0 0 6px; font-size: 14px;">প্রিয়,</p>
          <p style="color: #ffffff; margin: 0 0 24px; font-size: 20px; font-weight: 600;">${order.customer_name}</p>
          <p style="color: #d0d0e0; margin: 0 0 24px; line-height: 1.7; font-size: 15px; font-weight: bold; color: #fca5a5;">
            স্টক শেষ: ${parsedItems.map(item => item.name).join(', ')}
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: rgba(248,113,113,0.15);">
                <th style="padding: 12px 16px; text-align: left; color: #f87171; font-size: 13px; border-bottom: 1px solid rgba(248,113,113,0.2);">আইটেম</th>
                <th style="padding: 12px 16px; text-align: center; color: #f87171; font-size: 13px; border-bottom: 1px solid rgba(248,113,113,0.2);">পরিমাণ</th>
                <th style="padding: 12px 16px; text-align: right; color: #f87171; font-size: 13px; border-bottom: 1px solid rgba(248,113,113,0.2);">মূল্য</th>
              </tr>
            </thead>
            <tbody>
              ${parsedItems.map(item => `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e0e0e0;">${item.name}</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e0e0e0; text-align: center;">${item.quantity}</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fca5a5; text-align: right; font-weight: bold;">৳${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); border-radius: 12px; padding: 16px 20px; text-align: right;">
            <span style="color: #fca5a5; font-size: 20px; font-weight: 700;">৳${order.total_amount} (বাতিল)</span>
          </div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
          <p style="color: #555; margin: 0; font-size: 12px;">© ২০২৬ ICE বিভাগ | পহেলা বৈশাখ ১৪৩৩ 🌸</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: order.customer_email,
    subject: `❌ অর্ডার বাতিল — #${order.order_number} | পহেলা বৈশাখ ICE স্টল`,
    htmlContent: html,
  });
};
