import mongoose from 'mongoose';
export default new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    dob: {
        day: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
    },
    address: {
        line1: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        postal_code: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
    },
    role: {
        type: String,
        enum: ['tenant', 'landlord', 'admin', 'subadmin'],
        default: null,
    },
    isSubscribed: {
        type: Boolean,
        default: false,
    },
    subRole: {
        type: [String],
        enum: [
            'conflict resolution admin',
            'advertisement admin',
            'tenants & landlords admin',
            'document verification admin',
        ],
        default: [],
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    authProvider: {
        type: String,
        enum: ['google', 'facebook', null],
        default: null,
    },
    authProviderId: {
        type: String,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: '',
    },
    Kids: {
        type: Number,
        default: 1,
    },
    leaseTerm: {
        type: String,
        enum: ['12 months', '24 months', '36 months', '48 months', '60 months'],
        default: '12 months',
    },
    pets: {
        type: String,
        default: null,
    },
    smoke: {
        type: String,
        default: null,
    },
    subscriptions: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
//# sourceMappingURL=userSchema.js.map