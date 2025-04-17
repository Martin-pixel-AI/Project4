import mongoose, { Schema, models, model } from 'mongoose';

// Schema for the User model
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    image: {
      type: String,
      default: '',
    },
    // Workspaces this user belongs to
    workspaces: [{
      type: Schema.Types.ObjectId,
      ref: 'Workspace'
    }],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the model, check if it's already defined to prevent model redefinition error
const User = models.User || model('User', userSchema);
export default User; 