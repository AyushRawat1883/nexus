const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Employee', 'Technician', 'Admin'], 
        default: 'Employee' 
    }
}, { timestamps: true });

// Modern Mongoose Pre-save hook: No 'next' parameter needed when using async/await!
UserSchema.pre('save', async function() {
    // 1. If the password wasn't changed, stop executing and exit the function
    if (!this.isModified('password')) return;

    // 2. Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Mongoose automatically knows to save now because the async function resolves successfully!
});

module.exports = mongoose.model('User', UserSchema);