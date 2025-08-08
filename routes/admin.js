const express = require('express');
const router = express.Router();
const PensionApplication = require('../models/PensionApplication');
const FamilyPensionApplication = require('../models/FamilyPensionApplication');
const Contact = require('../models/Contact');

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        // Get counts
        const totalPensionApplications = await PensionApplication.countDocuments();
        const pendingPensionApplications = await PensionApplication.countDocuments({ status: 'pending' });
        const approvedPensionApplications = await PensionApplication.countDocuments({ status: 'approved' });
        const rejectedPensionApplications = await PensionApplication.countDocuments({ status: 'rejected' });

        const totalFamilyPensionApplications = await FamilyPensionApplication.countDocuments();
        const pendingFamilyPensionApplications = await FamilyPensionApplication.countDocuments({ status: 'pending' });
        const approvedFamilyPensionApplications = await FamilyPensionApplication.countDocuments({ status: 'approved' });
        const rejectedFamilyPensionApplications = await FamilyPensionApplication.countDocuments({ status: 'rejected' });

        const totalContactMessages = await Contact.countDocuments();
        const unreadContactMessages = await Contact.countDocuments({ status: 'unread' });

        // Get recent applications
        const recentPensionApplications = await PensionApplication.find()
            .sort({ submittedAt: -1 })
            .limit(5);

        const recentFamilyPensionApplications = await FamilyPensionApplication.find()
            .sort({ submittedAt: -1 })
            .limit(5);

        const recentContactMessages = await Contact.find()
            .sort({ submittedAt: -1 })
            .limit(5);

        res.json({
            statistics: {
                pension: {
                    total: totalPensionApplications,
                    pending: pendingPensionApplications,
                    approved: approvedPensionApplications,
                    rejected: rejectedPensionApplications
                },
                familyPension: {
                    total: totalFamilyPensionApplications,
                    pending: pendingFamilyPensionApplications,
                    approved: approvedFamilyPensionApplications,
                    rejected: rejectedFamilyPensionApplications
                },
                contact: {
                    total: totalContactMessages,
                    unread: unreadContactMessages
                }
            },
            recent: {
                pensionApplications: recentPensionApplications,
                familyPensionApplications: recentFamilyPensionApplications,
                contactMessages: recentContactMessages
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Chart data for applications over time
router.get('/charts/applications-over-time', async (req, res) => {
    try {
        const last6Months = new Date();
        last6Months.setMonth(last6Months.getMonth() - 6);

        // Get pension applications by month
        const pensionApplications = await PensionApplication.aggregate([
            {
                $match: {
                    submittedAt: { $gte: last6Months }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$submittedAt' },
                        month: { $month: '$submittedAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Get family pension applications by month
        const familyPensionApplications = await FamilyPensionApplication.aggregate([
            {
                $match: {
                    submittedAt: { $gte: last6Months }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$submittedAt' },
                        month: { $month: '$submittedAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json({
            pensionApplications,
            familyPensionApplications
        });
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({ message: 'Error fetching chart data' });
    }
});

// Chart data for application status distribution
router.get('/charts/status-distribution', async (req, res) => {
    try {
        // Pension application status distribution
        const pensionStatusDistribution = await PensionApplication.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Family pension application status distribution
        const familyPensionStatusDistribution = await FamilyPensionApplication.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Contact message status distribution
        const contactStatusDistribution = await Contact.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            pension: pensionStatusDistribution,
            familyPension: familyPensionStatusDistribution,
            contact: contactStatusDistribution
        });
    } catch (error) {
        console.error('Error fetching status distribution:', error);
        res.status(500).json({ message: 'Error fetching status distribution' });
    }
});

// Get all applications for admin panel
router.get('/applications/pension', async (req, res) => {
    try {
        const applications = await PensionApplication.find()
            .sort({ submittedAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching pension applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

router.get('/applications/family-pension', async (req, res) => {
    try {
        const applications = await FamilyPensionApplication.find()
            .sort({ submittedAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching family pension applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

router.get('/applications/contact', async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};
        
        if (status) {
            query.status = status;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }
        
        const contacts = await Contact.find(query)
            .sort({ submittedAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ message: 'Error fetching contact messages' });
    }
});

// Export data as CSV
router.get('/export', async (req, res) => {
    try {
        const [pensionApps, familyPensionApps, contacts] = await Promise.all([
            PensionApplication.find().sort({ submittedAt: -1 }),
            FamilyPensionApplication.find().sort({ submittedAt: -1 }),
            Contact.find().sort({ submittedAt: -1 })
        ]);

        // Create CSV content
        let csvContent = 'Application Type,Name,Employee ID,Status,Submitted Date\n';
        
        // Add pension applications
        pensionApps.forEach(app => {
            csvContent += `Pension,${app.applicantName},${app.employeeId},${app.status},${app.submittedAt.toISOString().split('T')[0]}\n`;
        });
        
        // Add family pension applications
        familyPensionApps.forEach(app => {
            csvContent += `Family Pension,${app.applicantName},${app.deceasedEmployeeId},${app.status},${app.submittedAt.toISOString().split('T')[0]}\n`;
        });
        
        // Add contacts
        contacts.forEach(contact => {
            csvContent += `Contact,${contact.name},N/A,${contact.status},${contact.submittedAt.toISOString().split('T')[0]}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=pension-data-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csvContent);
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ message: 'Error exporting data' });
    }
});

module.exports = router;
