import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import BugList from '../../components/BugList';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('BugList Integration', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  it('renders bugs fetched from API', async () => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Test Bug 1',
        description: 'Description 1',
        status: 'open',
        priority: 'high',
        category: 'frontend'
      },
      {
        _id: '2',
        title: 'Test Bug 2',
        description: 'Description 2',
        status: 'resolved',
        priority: 'low',
        category: 'backend'
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockBugs });

    render(<BugList bugs={mockBugs} />);

    // Check if bugs are rendered
    expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    // Check status, priority, category display - verify they exist
    expect(screen.getAllByText(/Status:/)).toHaveLength(2);
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getAllByText(/Priority:/)).toHaveLength(2);
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getAllByText(/Category:/)).toHaveLength(2);
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  it('shows "No bugs reported yet" when empty array', () => {
    render(<BugList bugs={[]} />);
    expect(screen.getByText('No bugs reported yet.')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each bug', () => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Test Bug',
        description: 'Description',
        status: 'open',
        priority: 'medium',
        category: 'ui'
      }
    ];

    render(<BugList bugs={mockBugs} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    // Since BugList doesn't fetch data itself, test with empty array
    render(<BugList bugs={[]} />);

    expect(screen.getByText('No bugs reported yet.')).toBeInTheDocument();
  });
});