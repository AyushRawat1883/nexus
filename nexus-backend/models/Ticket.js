const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Open', 'Assigned', 'In_Progress', 'Resolved'], 
        default: 'Open' 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    // Links the ticket to the specific Employee who created it
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Links the ticket to the specific IT Technician assigned to resolve it
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    }
}, { timestamps: true }); // Automatically handles createdAt and updatedAt timestamps

module.exports = mongoose.model('Ticket', TicketSchema);