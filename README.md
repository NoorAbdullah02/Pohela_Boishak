# Pohela Boishakh (শুভ নববর্ষ) Stall Management Platform 🌸

Welcome to the **Pohela Boishakh Stall Management Platform**, a premium, full-stack e-commerce solution custom-built for the ICE Department's Pohela Boishakh stall (১৪৩৩). Designed with modern aesthetics, an interactive UI, and a robust admin infrastructure.

## 🌟 Key Features

### 🛒 Client Interface
- **Beautiful Glassmorphic Design:** A highly polished, immersive user interface featuring custom gradients, particle animations, and hover effects that provide a premium shopping experience.
- **Dynamic Menu:** Interactive categorization with beautiful visual feedback dynamically loaded from the server.
- **Smart Cart System:** Fully responsive cart drawer with instant local state updates and order quantity controls.
- **Seamless Checkout:** Quick, secure checkout form capturing user details and processing payments seamlessly. Mobile layout is heavily optimized.

### 🔐 Admin Dashboard
- **Animated Login Panel:** A deeply customized, animated gateway strictly restricted for stall administrators.
- **Real-Time Order Tracking:** Manage all stall orders dynamically with live status tracking.
- **Order States:** Move orders through three distinct states:
  - `অপেক্ষমান` (Pending)
  - `সম্পন্ন` (Completed)
  - `বাতিল` (Cancelled)
- **Automated Email Notifications:** Instantly sends out beautiful HTML emails to customers whenever an order is successfully placed, confirmed (`সম্পন্ন`), or cancelled (`বাতিল`).
- **Inventory Control:** Admins can effortlessly toggle item stock limits to instantly reflect "Out of Stock" notices on the storefront.

## 🛠 Technology Stack

This project uses a decoupled front-end and back-end integrated tightly during production.

- **Frontend:** Next.js (App Router), React, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with raw pg integration)
- **Email Delivery:** Nodemailer
- **Media Uploads:** Cloudinary API

## 🚀 Installation & Setup

Ensure you have **Node.js** and **PostgreSQL** installed locally.

**1. Clone the repository:**
```bash
git clone https://github.com/NoorAbdullah02/Pohela_Boishak.git
cd Pohela_Boishak
```

**2. Install all dependencies:**
We use a top-level macro script to install both client and server dependencies simultaneously.
```bash
npm run install:all
```

**3. Configure Environment Variables:**
You will need to set up `.env` files in both the `/client` and `/server` directories containing database connection URI, Cloudinary credentials, Next public routes, and secret keys.

**4. Start Development Mode:**
To run the server and Next.js developer environment separately:
```bash
npm run dev --prefix client
npm run dev --prefix server
```

**5. Build and Run Production:**
Our production build serves the Next.js static asset bundle directly through the central Node Express server on Port 4000 to eliminate CORS handling and port conflict issues in production deployment.
```bash
npm run build
npm start
```

## 👩‍💻 Contributors & Authors
Initiated and beautifully maintained for the **ICE Department** to celebrate Pohela Boishakh!
