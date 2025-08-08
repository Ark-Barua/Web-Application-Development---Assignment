const express = require('express');
const router = express.Router();
const PensionApplication = require('../models/PensionApplication');
const { body, validationResult } = require('express-validator');

// Validation rules
const validatePensionApplication = [
    body('applicantName').notEmpty().withMessage('Applicant name is required'),
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('dateOfJoining').isISO8601().withMessage('Valid date of joining is required'),
    body('dateOfRetirement').isISO8601().withMessage('Valid date of retirement is required'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('basicPay').isNumeric().withMessage('Basic pay must be a number'),
    body('contactNumber').notEmpty().withMessage('Contact number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.pincode').notEmpty().withMessage('Pincode is required'),
    body('bankDetails.bankName').notEmpty().withMessage('Bank name is required'),
    body('bankDetails.accountNumber').notEmpty().withMessage('Account number is required'),
    body('bankDetails.ifscCode').notEmpty().withMessage('IFSC code is required')
];

// Submit pension application
router.post('/submit', validatePensionApplication, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const pensionApplication = new PensionApplication({
            ...req.body,
            status: 'pending',
            submittedAt: new Date()
        });

        await pensionApplication.save();

        res.status(201).json({
            message: 'Pension application submitted successfully',
            applicationId: pensionApplication._id
        });
    } catch (error) {
        console.error('Error submitting pension application:', error);
        res.status(500).json({ message: 'Error submitting application' });
    }
});

// Get all pension applications (admin only)
router.get('/all', async (req, res) => {
    try {
        const applications = await PensionApplication.find()
            .sort({ submittedAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching pension applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// Get individual pension application
router.get('/:id', async (req, res) => {
    try {
        const application = await PensionApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        console.error('Error fetching pension application:', error);
        res.status(500).json({ message: 'Error fetching application' });
    }
});

// Update pension application status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await PensionApplication.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                ...(notes && { notes }),
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({
            message: 'Application status updated successfully',
            application
        });
    } catch (error) {
        console.error('Error updating pension application status:', error);
        res.status(500).json({ message: 'Error updating application status' });
    }
});

module.exports = router;
