import mongoose, { Schema, models, model } from 'mongoose';

// Schema for the Team model
const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
    },
    description: {
      type: String,
      default: '',
    },
    // Workspace the team belongs to
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    // Members of the team
    members: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['lead', 'member'],
        default: 'member',
      },
    }],
    // Projects belonging to this team
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project',
    }],
    // Team visibility
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the model, check if it's already defined to prevent model redefinition error
const Team = models.Team || model('Team', teamSchema);
export default Team; 