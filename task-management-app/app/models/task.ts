import mongoose, { Schema, models, model } from 'mongoose';

// Schema for the Task model
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
    },
    description: {
      type: String,
      default: '',
    },
    // Projects this task belongs to (a task can be in multiple projects)
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project',
    }],
    // Assignee
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // Due date
    dueDate: {
      type: Date,
    },
    // Task status
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
    },
    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    // Tags
    tags: [{
      type: String,
    }],
    // Subtasks
    subtasks: [{
      type: Schema.Types.ObjectId,
      ref: 'Task',
    }],
    // Parent task (if this is a subtask)
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    // Comments
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    // Created by
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Attachments
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    // Task completion status
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the model, check if it's already defined to prevent model redefinition error
const Task = models.Task || model('Task', taskSchema);
export default Task; 