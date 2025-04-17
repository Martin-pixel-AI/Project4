import mongoose, { Schema, models, model } from 'mongoose';

// Schema for the Project model
const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
    },
    description: {
      type: String,
      default: '',
    },
    // Workspace the project belongs to
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    // Team the project belongs to (optional)
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    // Project view type
    viewType: {
      type: String,
      enum: ['list', 'board', 'calendar', 'timeline'],
      default: 'board',
    },
    // Project color
    color: {
      type: String,
      default: '#4299E1', // Default blue color
    },
    // Project status
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    // Members with access to this project
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
    // Tasks in this project
    tasks: [{
      type: Schema.Types.ObjectId,
      ref: 'Task',
    }],
    // Project visibility
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the model, check if it's already defined to prevent model redefinition error
const Project = models.Project || model('Project', projectSchema);
export default Project; 