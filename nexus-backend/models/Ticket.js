const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Open', 'In_Progress', 'Resolved'], 
        default: 'Open' 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    // Links the ticket to the Employee who created it
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Links the ticket to the IT Technician assigned to it
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    }
}, { timestamps: true }); // Automatically creates createdAt and updatedAt fields

module.exports = mongoose.model('Ticket', TicketSchema);