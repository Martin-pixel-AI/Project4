import mongoose, { Schema, models, model } from 'mongoose';

// Schema for the Comment model
const commentSchema = new Schema(
  {
    // Content of the comment
    content: {
      type: String,
      required: [true, 'Comment content is required'],
    },
    // Task the comment belongs to
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    // Author of the comment
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Mentions in the comment (users who are mentioned)
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    // Attachments
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
    }],
    // Reactions to the comment
    reactions: [{
      emoji: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the model, check if it's already defined to prevent model redefinition error
const Comment = models.Comment || model('Comment', commentSchema);
export default Comment; 