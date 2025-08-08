const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/family_pension_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Create default admin user
async function createDefaultAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create default admin
        const admin = new Admin({
            username: 'admin',
            email: 'admin@pagmumbai.gov.in',
            password: 'admin123',
            role: 'super_admin'
        });

        await admin.save();
        console.log('Default admin user created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Create sample data
async function createSampleData() {
    try {
        const PensionApplication = require('./models/PensionApplication');
        const FamilyPensionApplication = require('./models/FamilyPensionApplication');
        const Contact = require('./models/Contact');

        // Sample pension applications
        const samplePensionApps = [
            {
                applicantName: 'Rajesh Kumar',
                employeeId: 'EMP001',
                dateOfBirth: new Date('1960-05-15'),
                dateOfJoining: new Date('1985-03-01'),
                dateOfRetirement: new Date('2020-05-31'),
                designation: 'Senior Accountant',
                department: 'Finance',
                basicPay: 45000,
                contactNumber: '9876543210',
                email: 'rajesh.kumar@example.com',
                address: {
                    street: '123 Main Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001'
                },
                bankDetails: {
                    bankName: 'State Bank of India',
                    accountNumber: '1234567890',
                    ifscCode: 'SBIN0001234'
                },
                status: 'pending'
            },
            {
                applicantName: 'Priya Sharma',
                employeeId: 'EMP002',
                dateOfBirth: new Date('1962-08-20'),
                dateOfJoining: new Date('1988-07-15'),
                dateOfRetirement: new Date('2022-08-31'),
                designation: 'Deputy Accountant',
                department: 'Audit',
                basicPay: 52000,
                contactNumber: '9876543211',
                email: 'priya.sharma@example.com',
                address: {
                    street: '456 Park Avenue',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400002'
                },
                bankDetails: {
                    bankName: 'HDFC Bank',
                    accountNumber: '0987654321',
                    ifscCode: 'HDFC0000987'
                },
                status: 'approved'
            }
        ];

        // Sample family pension applications
        const sampleFamilyPensionApps = [
            {
                deceasedEmployeeName: 'Amit Patel',
                deceasedEmployeeId: 'EMP003',
                dateOfDeath: new Date('2023-01-15'),
                applicantName: 'Sunita Patel',
                relationship: 'spouse',
                dateOfBirth: new Date('1965-12-10'),
                maritalStatus: 'widowed',
                contactNumber: '9876543212',
                email: 'sunita.patel@example.com',
                address: {
                    street: '789 Lake Road',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400003'
                },
                bankDetails: {
                    bankName: 'ICICI Bank',
                    accountNumber: '1122334455',
                    ifscCode: 'ICIC0001122'
                },
                status: 'pending'
            }
        ];

        // Sample contact messages
        const sampleContacts = [
            {
                name: 'Vikram Singh',
                email: 'vikram.singh@example.com',
                phone: '9876543213',
                subject: 'Pension Application Status',
                message: 'I submitted my pension application last month. Can you please provide an update on the status?',
                status: 'unread'
            },
            {
                name: 'Meera Desai',
                email: 'meera.desai@example.com',
                phone: '9876543214',
                subject: 'Family Pension Query',
                message: 'I need information about the documents required for family pension application.',
                status: 'read'
            }
        ];

        // Insert sample data
        await PensionApplication.insertMany(samplePensionApps);
        await FamilyPensionApplication.insertMany(sampleFamilyPensionApps);
        await Contact.insertMany(sampleContacts);

        console.log('Sample data created successfully');
        
    } catch (error) {
        console.error('Error creating sample data:', error);
    }
}

// Main setup function
async function setup() {
    console.log('Starting setup...');
    
    await createDefaultAdmin();
    await createSampleData();
    
    console.log('Setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm start');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Access admin panel: http://localhost:3000/admin');
    console.log('4. Login with: admin / admin123');
    
    process.exit(0);
}

// Run setup
setup().catch(console.error);
