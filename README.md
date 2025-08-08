# Pension Management System

A comprehensive web-based pension management system for the Principal Accountant General (A&E) - I, Maharashtra, Mumbai. This system provides digital solutions for pension applications, family pension applications, and administrative management.

## 🚀 Features

### **Public Portal Features**
- **Pension Application Form**: Complete digital application submission
- **Family Pension Application Form**: Specialized form for family pension claims
- **Contact Management**: Integrated contact form with message tracking
- **Responsive Design**: Mobile-friendly interface across all devices
- **Accessibility**: Font size controls and skip-to-main-content navigation
- **Multi-language Support**: English, Hindi, and Marathi language options

### **Admin Panel Features**
- **Secure Authentication**: JWT-based login system with role-based access
- **Dashboard Analytics**: Real-time statistics and data visualization
- **Application Management**: View, update status, and manage all applications
- **Contact Management**: Track and respond to public inquiries
- **Data Export**: Download application data in CSV format
- **Interactive Charts**: Two visualization graphs for analytics
- **Real-time Updates**: Live dashboard with automatic data refresh

### **Technical Features**
- **MongoDB Integration**: Robust database with Mongoose ODM
- **RESTful API**: Complete backend API with validation
- **JWT Authentication**: Secure admin access with token management
- **Data Validation**: Server-side validation for all forms
- **Error Handling**: Comprehensive error management and user feedback
- **Responsive UI**: Modern, accessible interface design

## 🛠️ Technology Stack

### **Backend**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and security
- **express-validator**: Input validation middleware
- **cors**: Cross-origin resource sharing

### **Frontend**
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+)**: Client-side functionality
- **Chart.js**: Data visualization library
- **Font Awesome**: Icon library for UI elements

### **Development Tools**
- **nodemon**: Development server with auto-restart
- **dotenv**: Environment variable management

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd pension
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/family_pension_db
JWT_SECRET=your-secret-key-here
```

### **4. Database Setup**
Run the setup script to initialize the database with sample data:
```bash
npm run setup
```

This will create:
- Default admin user (username: `admin`, password: `admin123`)
- Sample pension applications
- Sample family pension applications
- Sample contact messages

### **5. Start the Application**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
pension/
├── models/                     # Database models
│   ├── PensionApplication.js   # Pension application schema
│   ├── FamilyPensionApplication.js # Family pension schema
│   ├── Contact.js             # Contact message schema
│   └── Admin.js               # Admin user schema
├── routes/                    # API routes
│   ├── pension.js             # Pension application routes
│   ├── familyPension.js       # Family pension routes
│   ├── contact.js             # Contact message routes
│   ├── admin.js               # Admin dashboard routes
│   └── auth.js                # Authentication routes
├── public/                    # Static files
│   ├── css/                   # Stylesheets
│   │   ├── style.css          # Main styles
│   │   └── admin.css          # Admin panel styles
│   ├── js/                    # JavaScript files
│   │   ├── main.js            # Main client-side logic
│   │   └── admin.js           # Admin panel logic
│   ├── index.html             # Homepage
│   ├── admin.html             # Admin panel
│   ├── pension-application.html # Pension form
│   ├── family-pension-application.html # Family pension form
│   ├── contact.html           # Contact page
│   └── test-admin.html        # Admin functionality test
├── server.js                  # Main server file
├── setup.js                   # Database initialization
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## 🔐 Admin Access

### **Default Credentials**
- **Username**: `admin`
- **Password**: `admin123`

### **Admin Panel Features**
1. **Dashboard**: Real-time statistics and charts
2. **Applications**: Manage pension and family pension applications
3. **Contacts**: Track and respond to public inquiries
4. **Reports**: Generate and export data reports
5. **Settings**: Update admin account information

### **Admin Panel URL**
Access the admin panel at: `http://localhost:3000/admin`

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration (protected)
- `GET /api/auth/me` - Get current admin info
- `POST /api/auth/update-password` - Update admin password

### **Pension Applications**
- `POST /api/pension/submit` - Submit pension application
- `GET /api/pension/all` - Get all applications (admin)
- `GET /api/pension/:id` - Get specific application
- `PATCH /api/pension/:id/status` - Update application status

### **Family Pension Applications**
- `POST /api/family-pension/submit` - Submit family pension application
- `GET /api/family-pension/all` - Get all applications (admin)
- `GET /api/family-pension/:id` - Get specific application
- `PATCH /api/family-pension/:id/status` - Update application status

### **Contact Messages**
- `POST /api/contact/submit` - Submit contact message
- `GET /api/contact/all` - Get all messages (admin)
- `GET /api/contact/:id` - Get specific message
- `PATCH /api/contact/:id/status` - Update message status

### **Admin Dashboard**
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/charts/status-distribution` - Status distribution chart data
- `GET /api/admin/charts/applications-over-time` - Time series chart data
- `GET /api/admin/applications/pension` - Pension applications list
- `GET /api/admin/applications/family-pension` - Family pension applications list
- `GET /api/admin/applications/contact` - Contact messages list
- `GET /api/admin/export` - Export data as CSV

## 🎨 Customization

### **Styling**
- Modify `public/css/style.css` for main website styling
- Modify `public/css/admin.css` for admin panel styling
- Update color schemes and layouts as needed

### **Content**
- Update HTML files in `public/` directory for content changes
- Modify form fields in application forms as required
- Update validation rules in route files

### **Database Schema**
- Modify models in `models/` directory for schema changes
- Update validation rules in route files accordingly

## 🧪 Testing

### **Admin Functionality Test**
Visit `http://localhost:3000/test-admin` to test:
- Authentication system
- Dashboard data loading
- Application management
- Contact management
- Data export functionality

### **Manual Testing**
1. **Public Forms**: Test application submissions
2. **Admin Login**: Verify authentication
3. **Dashboard**: Check statistics and charts
4. **Applications**: Test viewing and status updates
5. **Contacts**: Test message management
6. **Export**: Verify data export functionality

## 🔧 Development

### **Running in Development Mode**
```bash
npm run dev
```

### **Database Management**
```bash
# Initialize database with sample data
npm run setup

# Reset database (if needed)
# Delete the database and run setup again
```

### **Adding New Features**
1. Create new routes in `routes/` directory
2. Add corresponding models in `models/` directory
3. Update frontend JavaScript files
4. Add necessary styling
5. Test thoroughly

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request handling
- **Error Handling**: Comprehensive error management
- **Data Sanitization**: Protection against malicious input

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly mobile interface
- **Accessibility**: Screen reader compatible

## 🚀 Deployment

### **Environment Variables**
Set the following environment variables for production:
```env
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

### **Production Commands**
```bash
# Install dependencies
npm install --production

# Start the server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### **Planned Features**
- [ ] Email notifications for application status updates
- [ ] Document upload functionality
- [ ] Advanced reporting and analytics
- [ ] Multi-admin support with role management
- [ ] API rate limiting and security enhancements
- [ ] Mobile app development
- [ ] Integration with government databases
- [ ] Automated application processing
- [ ] Digital signature integration
- [ ] Payment gateway integration

### **Performance Improvements**
- [ ] Database indexing optimization
- [ ] Caching implementation
- [ ] CDN integration for static assets
- [ ] Load balancing setup
- [ ] Database query optimization

## 📈 Current Status

✅ **Completed Features**
- Complete pension application system
- Family pension application system
- Contact management system
- Admin panel with dashboard
- Data visualization with charts
- Export functionality
- Responsive design
- Authentication system
- Form validation
- Error handling

🔄 **In Progress**
- Performance optimization
- Additional admin features
- Enhanced reporting

📋 **Planned**
- Email notifications
- Document management
- Advanced analytics

---

**Last Updated**: August 2025  
**Version**: 1.0.0  
**Maintainer**: Ark
#   W e b - A p p l i c a t i o n - D e v e l o p m e n t - - - A s s i g n m e n t  
 