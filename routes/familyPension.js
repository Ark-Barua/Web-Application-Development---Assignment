const express = require('express');
const router = express.Router();
const FamilyPensionApplication = require('../models/FamilyPensionApplication');
const { body, validationResult } = require('express-validator');

// Validation rules
const validateFamilyPensionApplication = [
    body('deceasedEmployeeName').notEmpty().withMessage('Deceased employee name is required'),
    body('deceasedEmployeeId').notEmpty().withMessage('Deceased employee ID is required'),
    body('dateOfDeath').isISO8601().withMessage('Valid date of death is required'),
    body('applicantName').notEmpty().withMessage('Applicant name is required'),
    body('relationship').isIn(['spouse', 'child', 'parent', 'sibling']).withMessage('Valid relationship is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('maritalStatus').isIn(['single', 'married', 'divorced', 'widowed']).withMessage('Valid marital status is required'),
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

// Submit family pension application
router.post('/submit', validateFamilyPensionApplication, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const familyPensionApplication = new FamilyPensionApplication({
            ...req.body,
            status: 'pending',
            submittedAt: new Date()
        });

        await familyPensionApplication.save();

        res.status(201).json({
            message: 'Family pension application submitted successfully',
            applicationId: familyPensionApplication._id
        });
    } catch (error) {
        console.error('Error submitting family pension application:', error);
        res.status(500).json({ message: 'Error submitting application' });
    }
});

// Get all family pension applications (admin only)
router.get('/all', async (req, res) => {
    try {
        const applications = await FamilyPensionApplication.find()
            .sort({ submittedAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching family pension applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// Get individual family pension application
router.get('/:id', async (req, res) => {
    try {
        const application = await FamilyPensionApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        console.error('Error fetching family pension application:', error);
        res.status(500).json({ message: 'Error fetching application' });
    }
});

// Update family pension application status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await FamilyPensionApplication.findByIdAndUpdate(
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
        console.error('Error updating family pension application status:', error);
        res.status(500).json({ message: 'Error updating application status' });
    }
});

module.exports = router;
