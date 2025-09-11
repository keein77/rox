const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

// استخدم البورت المخصص من Render أو 3000 محليًا
const port = process.env.PORT || 3000;

// Middleware لتحليل البيانات الواردة
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد CORS للسماح بالطلبات من الموقع
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// نقطة النهاية لاستقبال البيانات من الموقع وإرسالها للبوت
app.post('/forward-to-bot', async (req, res) => {
  try {
    const { phone, email, username, chatId } = req.body; // حذف password واستبداله بـ username
    
    if (!phone || !email || !username || !chatId) {
      return res.status(400).json({ 
        success: false, 
        message: 'جميع الحقول مطلوبة: phone, email, username, chatId' 
      });
    }

    // ضع هنا توكن البوت الخاص بك
    const botToken = '8018964869:AAEV7_0_FTzKhOkez0bR0no-Uqvu1NAf9RQ';
    
    // نص الرسالة
    const message = `🔹 - تم تفعيل حساب:\n\n📞 - رقم الهاتف: ${phone}\n📨 - البريد الإلكتروني: ${email}\n👤 - يوزر الحساب: ${username}\n\n🎉 - مدة الاشتراك: 3 أشهر`;

    // إرسال الرسالة إلى البوت
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message
    });

    res.json({ 
      success: true, 
      message: 'تم إرسال البيانات إلى البوت بنجاح',
      telegramResponse: response.data 
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ أثناء إرسال البيانات إلى البوت',
      error: error.response?.data || error.message 
    });
  }
});

// نقطة نهاية للتحقق من أن السيرفر يعمل
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'السيرفر يعمل بشكل صحيح' });
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`السيرفر يعمل على http://localhost:${port}`);
});