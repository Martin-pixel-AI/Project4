import mongoose, { Schema, models, model } from 'mongoose';

// Schema for the Workspace model
const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
    },
    description: {
      type: String,
      default: '',
    },
    // Owner of the workspace
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Members of the workspace
    members: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['admin', 'member', 'viewer'],
        default: 'member',
      },
    }],
    // Teams within the workspace
    teams: [{
      type: Schema.Types.ObjectId,
      ref: 'Team',
    }],
    // Projects within the workspace
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project',
    }],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the model, check if it's already defined to prevent model redefinition error
const Workspace = models.Workspace || model('Workspace', workspaceSchema);
export default Workspace; 