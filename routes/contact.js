const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// Validation rules
const validateContact = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required')
];

// Submit contact message
router.post('/submit', validateContact, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contact = new Contact({
            ...req.body,
            status: 'unread',
            submittedAt: new Date()
        });

        await contact.save();

        res.status(201).json({
            message: 'Contact message submitted successfully',
            contactId: contact._id
        });
    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({ message: 'Error submitting message' });
    }
});

// Get all contact messages (admin only)
router.get('/all', async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ submittedAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Get individual contact message
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact message:', error);
        res.status(500).json({ message: 'Error fetching message' });
    }
});

// Update contact message status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        if (!['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                ...(notes && { notes }),
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        res.json({
            message: 'Contact status updated successfully',
            contact
        });
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({ message: 'Error updating contact status' });
    }
});

module.exports = router;
