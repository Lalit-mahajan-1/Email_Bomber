const express = require('express');
const cors = require('cors');
const { getQuote } = require("node-quotegen");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require("dotenv")
const app = express();

dotenv.config({quiet:true});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 6000;
const senderEmail = process.env.Email;
const Password = process.env.Password;

const subjectTemplates = {
    attitude: ["🔥 Transform Your Mindset Today", "💪 Unleash Your Inner Power", "⚡ Attitude is Everything"],
    coding: ["🚀 Code Your Dreams Into Reality", "💻 Master the Art of Programming", "🔧 Build Something Amazing"],
    nature: ["🌿 Embrace Nature's Wisdom", "🌊 Find Peace in Natural Beauty", "🌸 Connect with Mother Earth"],
    success: ["🎯 Your Success Journey Starts Now", "👑 Unlock Your Full Potential", "🏆 Victory Awaits You"],
    friendship: ["💕 Celebrate True Friendship", "🤝 Bonds That Last Forever", "🌟 Friends Make Life Beautiful"],
    inspirational: ["✨ You Are Capable of Greatness", "🌈 Inspiration for Your Soul", "💎 Discover Your Inner Strength"],
    funny: ["😂 Laughter is the Best Medicine", "🎭 Brighten Your Day with Humor", "😄 Smile, Life is Beautiful"],
    technology: ["🤖 The Future is Here", "⚙️ Innovation at Your Fingertips", "📱 Tech That Changes Everything"],
    motivational: ["🚀 Push Beyond Your Limits", "💪 Never Give Up on Your Dreams", "🔥 Ignite Your Inner Fire"]
};

const categoryColors = {
    attitude: '#FF6B35', coding: '#00D4AA', nature: '#8BC34A', success: '#FFD700',
    friendship: '#E91E63', inspirational: '#9C27B0', funny: '#FF9800', 
    technology: '#2196F3', motivational: '#F44336'
};

function createEmailTemplate(category, quote, subject) {
    const color = categoryColors[category] || '#9C27B0';
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Poppins', Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 20px; line-height: 1.6; 
        }
        .container { 
            max-width: 600px; margin: 0 auto; background: #ffffff; 
            border-radius: 20px; overflow: hidden; 
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1); 
        }
        .header { 
            background: linear-gradient(135deg, ${color}, ${color}dd); 
            padding: 40px 30px; text-align: center; color: white; 
        }
        .badge { 
            background: rgba(255, 255, 255, 0.2); padding: 8px 20px; 
            border-radius: 25px; font-size: 12px; font-weight: 600; 
            text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;
            display: inline-block; backdrop-filter: blur(10px);
        }
        .header h1 { 
            font-size: 28px; font-weight: 700; margin-bottom: 10px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); 
        }
        .subtitle { font-size: 14px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .message { 
            text-align: center; padding: 20px; margin: 20px 0; 
            background: linear-gradient(135deg, ${color}11, ${color}22); 
            border-radius: 12px; border: 1px solid ${color}33; 
            color: #2c3e50; font-size: 16px; 
        }
        .quote-box { 
            background: linear-gradient(135deg, #f8f9fa, #e9ecef); 
            padding: 30px; margin: 30px 0; border-radius: 15px; 
            border-left: 5px solid ${color}; position: relative;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        .quote-box::before { 
            content: '"'; font-size: 50px; color: ${color}; 
            position: absolute; top: -5px; left: 15px; opacity: 0.3; 
        }
        .quote { 
            font-size: 18px; color: #2c3e50; font-style: italic; 
            line-height: 1.7; margin-bottom: 15px; 
        }
        .author { 
            text-align: right; font-size: 12px; color: #7f8c8d; 
            font-weight: 600; text-transform: uppercase; 
        }
        .cta { text-align: center; margin: 30px 0; }
        .btn { 
            background: linear-gradient(135deg, ${color}, ${color}dd); 
            color: white; padding: 15px 30px; border-radius: 50px; 
            text-decoration: none; font-weight: 600; font-size: 14px;
            text-transform: uppercase; letter-spacing: 1px; display: inline-block;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;
        }
        .btn:hover { transform: translateY(-2px); }
        .footer { 
            background: #2c3e50; padding: 25px; text-align: center; 
            color: #bdc3c7; font-size: 13px; 
        }
        .social { margin: 15px 0; }
        .social a { 
            display: inline-block; width: 35px; height: 35px; 
            background: ${color}; border-radius: 50%; margin: 0 5px; 
            line-height: 35px; color: white; text-decoration: none; 
            transition: all 0.3s ease; 
        }
        .social a:hover { transform: translateY(-2px); }
        @media (max-width: 600px) {
            .container { margin: 10px; } .header { padding: 25px 20px; }
            .header h1 { font-size: 22px; } .content { padding: 25px 20px; }
            .quote-box { padding: 20px; } .footer { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">${category.toUpperCase()}</div>
            <h1>${subject}</h1>
            <p class="subtitle">Daily dose of inspiration ✨</p>
        </div>
        <div class="content">
            <div class="message">
                <p><strong>🌟 Something special just for you! 🌟</strong></p>
            </div>
            <div class="quote-box">
                <div class="quote">${quote}</div>
                <div class="author">— Daily Wisdom</div>
            </div>
            <div class="cta">
                <p style="margin-bottom: 15px; color: #666;">Ready to shine today?</p>
                <a href="#" class="btn">Get Motivated</a>
            </div>
        </div>
        <div class="footer">
            <p><strong>Keep being amazing! 🚀</strong></p>
            <p>Spreading positivity one email at a time</p>
            <div class="social">
                <a href="#">📧</a>
                <a href="#">🌐</a>
                <a href="#">💬</a>
            </div>
            <p style="opacity: 0.7; margin-top: 15px;">
                © 2024 Inspiration Hub. Made with ❤️
            </p>
        </div>
    </div>
</body>
</html>`;
}

app.post('/bomb', (req, res) => {
    const { time, bombs, email } = req.body;
    const categories = ["attitude", "coding", "nature", "success", "friendship", "inspirational", "funny", "technology", "motivational"];

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: Password
            }
        });

        function emailbomber(index) {
            const categoryIndex = Math.floor(Math.random() * categories.length);
            const category = categories[categoryIndex];
            const subjectIndex = Math.floor(Math.random() * subjectTemplates[category].length);
            const subject = subjectTemplates[category][subjectIndex];
            const quote = getQuote(category);

            const mailOptions = {
                from: {
                    name: '✨ Inspiration Hub',
                    address: 'xyzclg28@gmail.com'
                },
                to: email,
                subject: subject,
                html: createEmailTemplate(category, quote, subject),
                text: `${subject}\n\n"${quote}"\n\nHave an inspiring day!\n\n--- Inspiration Hub Team`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`❌ Email ${index + 1} failed:`, error.message);
                } else {
                    console.log(`✅ Email ${index + 1} sent: ${subject}`);
                }
            });
        }

        for (let i = 0; i < bombs; i++) {
            setTimeout(() => emailbomber(i), i * time * 1000);
        }

        const totalDuration = Math.round((bombs * time) / 60 * 100) / 100;
        
        res.status(200).json({
            success: true,
            message: "🚀 Email campaign launched successfully!",
            details: {
                totalEmails: bombs,
                intervalSeconds: time,
                recipient: email,
                estimatedDurationMinutes: totalDuration
            }
        });

    } catch (error) {
        console.error("Campaign error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "❌ Failed to start email campaign"
        });
    }
});



app.listen(PORT, () => {
    console.log(`🚀 Email Bomber Server running on http://localhost:${PORT}`);
    console.log(`📧 Ready to send beautiful HTML emails!`);
    console.log(`💡 Use POST /bomb to start campaigns`);
});

module.exports = app;