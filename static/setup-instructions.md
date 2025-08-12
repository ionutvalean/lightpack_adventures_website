# LightPack Carpathian Adventures - Setup Instructions

## 📁 File Structure
Create the following folder structure:

```
lightpack-website/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/ (create this folder for your photos)
│   ├── hero-background.jpg
│   ├── about-team-1.jpg
│   ├── about-team-2.jpg
│   └── ... (other images)
└── SETUP-INSTRUCTIONS.md (this file)
```

## 🔧 EmailJS Setup (Free Form Backend)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions to connect your email
5. Note down your **Service ID**

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Template Name:** `lightpack_contact_form`

**Subject:** `New Adventure Inquiry from {{from_name}}`

**Template Body:**
```
New inquiry from LightPack Carpathian Adventures website:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Route & Dates:
{{route_details}}

Gear Weight: {{gear_weight}}

Special Requests:
{{special_requests}}

---
This inquiry was sent from the LightPack website contact form.
Reply directly to: {{from_email}}
```

4. Save the template and note down your **Template ID**

### Step 4: Get Your Public Key
1. Go to "Account" > "General"
2. Copy your **Public Key**

### Step 5: Update JavaScript Configuration
Open `js/script.js` and replace these placeholders:

```javascript
// Line 2: Replace with your Public Key
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");

// Line 60: Replace with your Service ID and Template ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

**Example:**
```javascript
emailjs.init("user_abc123xyz789");
emailjs.send('service_gmail_123', 'template_lightpack_456', templateParams)
```

## 📧 Email Configuration

### Auto-Reply Setup (Optional)
To send automatic replies to customers:
1. Create a second template in EmailJS
2. Set up an auto-reply with confirmation message
3. Add second emailjs.send() call in the JavaScript

### Email Testing
1. Test the form submission
2. Check both your inbox and spam folder
3. Verify all form fields are captured correctly

## 🖼️ Adding Real Images

Replace the CSS placeholder backgrounds with real images:

### Method 1: Local Images
1. Add your photos to the `images/` folder
2. Update the CSS background-image URLs:

```css
/* In css/style.css, replace the SVG backgrounds: */
.hero {
    background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), 
                url('../images/hero-background.jpg');
}
```

### Method 2: Online Images (CDN)
Use image hosting services like:
- Cloudinary
- Unsplash (for temporary testing)
- Your own server

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - Free)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your website folder
3. Your site will be live in minutes
4. Supports forms natively (alternative to EmailJS)

### Option 2: GitHub Pages
1. Create GitHub repository
2. Upload your files
3. Enable GitHub Pages in settings
4. Access via username.github.io/repository-name

### Option 3: Traditional Hosting
1. Purchase hosting (shared hosting is fine)
2. Upload files via FTP/File Manager
3. Point domain to hosting

## 🔒 Security & Best Practices

### EmailJS Security
- Your EmailJS keys are public (this is normal)
- Set up domain restrictions in EmailJS dashboard
- Monitor usage to prevent abuse

### Form Spam Protection
Consider adding:
- Simple honeypot fields
- Google reCAPTCHA
- Rate limiting

## 📱 Mobile Testing

Test on various devices:
- iPhone Safari
- Android Chrome
- iPad
- Desktop browsers

## 🎨 Customization Ideas

### Add More Features
1. **Image Gallery:** Add a photo gallery of adventures
2. **Testimonials:** Customer reviews section
3. **FAQ:** Frequently asked questions
4. **Blog Posts:** Expand the blog section
5. **Booking Calendar:** Integration with scheduling tools

### Performance Optimization
1. **Image Optimization:** Use WebP format, compress images
2. **Lazy Loading:** Load images as user scrolls
3. **CSS/JS Minification:** Reduce file sizes
4. **CDN:** Use Content Delivery Network for faster loading

## ⚡ Quick Launch Checklist

- [ ] Create folder structure
- [ ] Copy all files to correct locations
- [ ] Set up EmailJS account
- [ ] Configure EmailJS keys in JavaScript
- [ ] Test contact form
- [ ] Add real images (optional)
- [ ] Deploy to hosting platform
- [ ] Test on mobile devices
- [ ] Set up domain name (if desired)

## 🆘 Troubleshooting

### Form Not Sending
- Check browser console for errors
- Verify EmailJS keys are correct
- Ensure internet connection
- Check EmailJS dashboard for quota limits

### Images Not Loading
- Check file paths are correct
- Ensure images are in the right folder
- Verify image file extensions match CSS

### Mobile Issues
- Test on actual devices, not just browser DevTools
- Check viewport meta tag is present
- Verify touch interactions work properly

## 📞 Support

For EmailJS issues: [EmailJS Documentation](https://www.emailjs.com/docs/)

For general web development: Check browser developer tools console for error messages.

---

**🏔️ Your LightPack Carpathian Adventures website is ready to help customers plan their mountain adventures!**