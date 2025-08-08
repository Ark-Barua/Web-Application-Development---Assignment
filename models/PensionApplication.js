const mongoose = require('mongoose');

const pensionApplicationSchema = new mongoose.Schema({
    applicantName: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    dateOfJoining: {
        type: Date,
        required: true
    },
    dateOfRetirement: {
        type: Date,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    basicPay: {
        type: Number,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bankDetails: {
        bankName: String,
        accountNumber: String,
        ifscCode: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PensionApplication', pensionApplicationSchema);
