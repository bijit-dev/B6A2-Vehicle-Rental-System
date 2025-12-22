# 🚗 Vehicle Rental System

**Live Demo:** [[https://b6-a2-one.vercel.app/](https://b6-a2-one.vercel.app/)]

A complete Vehicle Rental Management System that provides secure authentication, efficient vehicle management, intelligent booking logic, and a seamless user experience for both customers and admins.

---

## 🔥 Features

### 🔐 **Authentication & Authorization**

* User registration & login (JWT-based)
* Secure password hashing
* Role-based access (`admin`, `customer`)
* Protected routes with Bearer tokens

### 🚗 **Vehicle Management**

* Admin can add, update, and delete vehicles
* Prevent deletion if active bookings exist
* Public vehicle browsing
* Real-time availability status handling (`available`, `booked`)

### 👥 **User Management**

* Admin can manage all users
* User can update own profile
* Restricts deletion of users with active bookings

### 📅 **Booking System**

* Customer/Admin can create bookings
* Auto total price calculation based on days
* Vehicle status auto-updates when booked/cancelled/returned
* Role-based booking retrieval
* Auto-return logic when rent end date passes

### ⚙️ **Business Logic**

* Booking price = `daily_rent_price × days`
* Vehicle availability updated automatically
* Standardized success & error responses
* Clean, modular backend structure

---

## 🛠️ Technology Stack

### **Backend**

* Node.js
* Express.js
* JWT Authentication
* PostgreSQL / SQL (or NEON DB)
* bcrypt for password hashing

### **Others**

* Vercel Deployment
* REST API Architecture

---

## 🏗️ Project Structure

```
vehicle-rental-api/
├── src/
│   ├── config/
│   │   ├── db.ts              # Database connection & initialization
│   │   └── env.ts             # Environment variables configuration
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication & authorization
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.route.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.route.ts
│   │   ├── vehicles/
│   │   │   ├── vehicle.controller.ts
│   │   │   ├── vehicle.service.ts
│   │   │   └── vehicle.route.ts
│   │   └── bookings/
│   │       ├── booking.controller.ts
│   │       ├── booking.service.ts
│   │       └── booking.route.ts
│   ├── types/
│   │   └── index.d.ts         
│   └──── app.ts         
│         └── server.ts              
├── .env                      
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Setup & Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/bijit-dev/B6A2-Vehicle-Rental-System.git
cd <project-folder>
```

### **2. Install Dependencies**

#### Backend

```bash
cd backend
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
CONNECTION_STR=<your_database_connection>
JWT_SECRET=<your_secret_key>
```

---

## 🚀 Running the Project

### **Start Backend**

```bash
npm run dev
```

---

## 📌 API Base URL

```
https://vehicle-rental-system-tau-inky.vercel.app/api/v1
```

## 🙌 Contributing

Pull requests are welcome! Feel free to submit issues or feature suggestions.
