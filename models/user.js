

import { Schema, model } from 'mongoose'; // Use import for mongoose

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    gst_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['customer', 'employee', 'admin'],
        default: 'customer',
    },
});

export default model('User', userSchema);  // Use export default
