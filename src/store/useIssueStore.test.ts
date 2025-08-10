import { act } from '@testing-library/react';
import { toast } from 'react-toastify';
import { useIssueStore } from '../store/useIssueStore';
import { mockFetchIssues, mockUpdateIssue } from '../utils/api';
import { Issue } from '../types';

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock API functions
jest.mock('../utils/api', () => ({
  mockFetchIssues: jest.fn(),
  mockUpdateIssue: jest.fn(),
}));

const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Fix login bug',
    status: 'Backlog',
    priority: 'high',
    severity: 3,
    createdAt: '2025-07-09T10:00:00Z',
    assignee: 'alice',
    tags: ['auth', 'bug'],
  },
  {
    id: '2',
    title: 'Improve dashboard loading',
    status: 'In Progress',
    priority: 'medium',
    severity: 2,
    createdAt: '2025-07-08T12:00:00Z',
    assignee: 'bob',
    tags: ['performance'],
  },
];

describe('useIssueStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useIssueStore.setState({ issues: [], lastSyncedTime: '' }); // reset store
  });

  describe('fetchIssuesData', () => {
    it('should fetch and set issues with lastSyncedTime', async () => {
      (mockFetchIssues as jest.Mock).mockResolvedValue(mockIssues);

      await act(async () => {
        await useIssueStore.getState().fetchIssuesData();
      });

      const { issues, lastSyncedTime } = useIssueStore.getState();
      expect(issues).toEqual(mockIssues);
      expect(lastSyncedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should merge local updates with server data', async () => {
      useIssueStore.setState({
        issues: [{ ...mockIssues[0], priority: 'low' }], // local change
      });

      (mockFetchIssues as jest.Mock).mockResolvedValue(mockIssues);

      await act(async () => {
        await useIssueStore.getState().fetchIssuesData();
      });

      const updatedIssue = useIssueStore.getState().issues.find(i => i.id === '1');
      expect(updatedIssue?.priority).toBe('low'); // local value preserved
    });

    it('should handle fetch error if it exists', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (mockFetchIssues as jest.Mock).mockRejectedValue(new Error('Network error'));

      await act(async () => {
        await useIssueStore.getState().fetchIssuesData();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch issues:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('updateIssue', () => {
    beforeEach(() => {
      useIssueStore.setState({ issues: mockIssues });
    });

    it('should optimistically update and then merge server response', async () => {
      const serverUpdated = { ...mockIssues[0], status: 'Done' };
      (mockUpdateIssue as jest.Mock).mockResolvedValue(serverUpdated);

      await act(async () => {
        await useIssueStore.getState().updateIssue('1', { status: 'In Progress' });
      });

      // After optimistically updateing the UI
      const afterOptimistic = useIssueStore.getState().issues.find(i => i.id === '1');
      expect(afterOptimistic?.status).toBe('Done'); // final server response
    });

    it('should rollback and show toast on update failure', async () => {
      (mockUpdateIssue as jest.Mock).mockRejectedValue(new Error('Server error'));

      await act(async () => {
        await useIssueStore.getState().updateIssue('1', { status: 'In Progress' });
      });

      const reverted = useIssueStore.getState().issues.find(i => i.id === '1');
      expect(reverted?.status).toBe('Backlog'); // original value restored
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to update issue. Changes were reverted.'
      );
    });
  });
});
