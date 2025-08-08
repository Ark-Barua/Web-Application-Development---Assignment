const mongoose = require('mongoose');

const familyPensionApplicationSchema = new mongoose.Schema({
    deceasedEmployeeName: {
        type: String,
        required: true
    },
    deceasedEmployeeId: {
        type: String,
        required: true
    },
    dateOfDeath: {
        type: Date,
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        enum: ['spouse', 'son', 'daughter', 'parent'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    maritalStatus: {
        type: String,
        enum: ['single', 'married', 'divorced', 'widowed'],
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
    documentsSubmitted: [{
        documentType: String,
        documentNumber: String,
        submitted: Boolean
    }],
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

module.exports = mongoose.model('FamilyPensionApplication', familyPensionApplicationSchema);
