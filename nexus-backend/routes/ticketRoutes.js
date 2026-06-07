const express = require('express');
const Ticket = require('../models/Ticket.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// @route   POST /api/tickets
// @desc    Create a new support ticket
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const ticket = new Ticket({
            title,
            description,
            priority,
            creator: req.user._id // Extracted from the valid JWT token by 'protect' middleware
        });

        const savedTicket = await ticket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create ticket', error: error.message });
    }
});

// @route   GET /api/tickets
// @desc    Get tickets (Employees see only theirs, Techs/Admins see all)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let tickets;

        // Smart Filtering based on user role
        if (req.user.role === 'Employee') {
            tickets = await Ticket.find({ creator: req.user._id }).populate('creator', 'name email');
        } else {
            // Admins and Technicians can see everything in the enterprise database
            tickets = await Ticket.find()
                .populate('creator', 'name email')
                .populate('assignedTo', 'name email');
        }

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
});

module.exports = router;

// @route   PUT /api/tickets/:id
// @desc    Update a ticket (Assign technician or change status)
// @access  Private (Admins and Technicians only)
router.put('/:id', protect, async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        
        // 1. Find the specific ticket using the ID from the URL parameters
        let ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // 2. Update fields if they are provided in the incoming Postman request
        if (status) ticket.status = status;
        if (assignedTo) ticket.assignedTo = assignedTo;

        // 3. Save the updated document back to MongoDB
        const updatedTicket = await ticket.save();
        
        // 4. Fetch the target data again, cleanly filling in user profiles instead of raw IDs
        const populatedTicket = await updatedTicket.populate([
    { path: 'creator', select: 'name email' },
    { path: 'assignedTo', select: 'name email' }
]);

res.json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update ticket', error: error.message });
    }
});