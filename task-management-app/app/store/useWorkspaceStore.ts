'use client';

import { create } from 'zustand';

// Define types for workspace
export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMember[];
  projectCount: number;
  teamCount: number;
}

// Define the store state
interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWorkspaces: () => Promise<void>;
  fetchWorkspaceById: (id: string) => Promise<void>;
  createWorkspace: (data: { name: string; description?: string }) => Promise<void>;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  addMember: (workspaceId: string, memberData: Omit<WorkspaceMember, 'id'>) => Promise<void>;
  removeMember: (workspaceId: string, memberId: string) => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
}

const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  // Fetch all workspaces for current user
  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/workspaces');
      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }
      const data = await response.json();
      set({ workspaces: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  // Fetch a specific workspace by ID
  fetchWorkspaceById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workspaces/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workspace');
      }
      const data = await response.json();
      
      // Set as current workspace
      set({ currentWorkspace: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  // Create a new workspace
  createWorkspace: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }

      const newWorkspace = await response.json();
      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        currentWorkspace: newWorkspace,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  // Update an existing workspace
  updateWorkspace: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update workspace');
      }

      const updatedWorkspace = await response.json();
      set((state) => ({
        workspaces: state.workspaces.map((workspace) => 
          workspace.id === id ? updatedWorkspace : workspace
        ),
        currentWorkspace: state.currentWorkspace?.id === id 
          ? updatedWorkspace 
          : state.currentWorkspace,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  // Delete a workspace
  deleteWorkspace: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workspace');
      }

      set((state) => ({
        workspaces: state.workspaces.filter((workspace) => workspace.id !== id),
        currentWorkspace: state.currentWorkspace?.id === id 
          ? null 
          : state.currentWorkspace,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  // Add a member to a workspace
  addMember: async (workspaceId, memberData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        throw new Error('Failed to add member');
      }

      // Refresh the workspace to get updated members
      await get().fetchWorkspaceById(workspaceId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  // Remove a member from a workspace
  removeMember: async (workspaceId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      // Refresh the workspace to get updated members
      await get().fetchWorkspaceById(workspaceId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  // Set current workspace
  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
  },
}));

export default useWorkspaceStore; 