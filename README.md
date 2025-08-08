# Pension Management System

A comprehensive web-based pension management system for the Principal Accountant General (A&E) - I, Maharashtra, Mumbai.

***

## Features

**Public Portal**
- Digital pension and family pension application forms
- Contact management and message tracking
- Responsive multi-language, accessible design

**Admin Panel**
- Secure JWT-based authentication, role management
- Dashboard analytics and charts
- Application and contact management
- Data export (CSV), real-time updates

**Technical Highlights**
- Node.js backend, MongoDB database with Mongoose
- RESTful API, validation, error handling
- Modern UI with Chart.js, Font Awesome

***

## Technology Stack

**Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator, cors  
**Frontend**: HTML5, CSS3, JavaScript (ES6+), Chart.js, Font Awesome  
**Tools**: nodemon, dotenv

***

## Prerequisites

- Node.js v14+
- MongoDB v4.4+
- npm or yarn

***

## Installation & Setup

```bash
git clone <repository-url>
cd pension
npm install
```

## Create a .env file in the root:
**PORT**=3000
**MONGODB_URI**=mongodb://localhost:27017/family_pension_db
JWT_SECRET=your-secret-key-here

## Initialize database:
```bash
npm run setup
```
## Start application:
```bash
npm run dev    # For development
npm start      # For production
```
```bash
Open http://localhost:3000
```
## Project Structure
pension/
├── models/
├── routes/
├── public/
├── server.js
├── setup.js
├── package.json
└── README.md

## Admin Access
Default Credentials:
Username: admin
Password: admin123
Admin Panel URL: http://localhost:3000/admin

## API Endpoints
See docs for routes on Authentication, Pension, Family Pension, Contact, Admin.

## Customization
1. Style: public/css/style.css, public/css/admin.css
2. Forms: HTML in public/, validation in routes/models

## Testing
1. Test at http://localhost:3000/test-admin
2. Manual: Forms, dashboard, management, export

## Security
1. JWT, password hashing
2. Input validation, error handling, CORS, sanitization

## Responsive & Accessible
1. Desktop, tablet, mobile friendly. Screen reader compatibility.

## Deployment
Set variables and run:
```bash
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-secret
NODE_ENV=production
```
```bash
npm install --production
npm start
```

## Contributing
Fork, branch, commit, test, pull request.

## License
MIT License.

## Roadmap
1. Email notifications, document upload
2. Advanced analytics, multi-admin, mobile app
3. Security and performance improvements

## Current Status
Completed: Application, contact system, admin dashboard, charts, export, validation, error-handling, responsive design
In Progress: Performance, new admin features, reporting

## Last Updated: August 2025 - Version: 1.0.0 - Maintainer: Ark

## Feedback and contributions welcome!
