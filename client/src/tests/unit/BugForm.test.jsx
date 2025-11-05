import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BugForm from '../../components/BugForm';

describe('BugForm', () => {
  it('calls onSubmit with payload when fields filled', async () => {
    const onSubmit = jest.fn();
    render(<BugForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Enter bug title'), { target: { value: 'Bug A' } });
    fireEvent.change(screen.getByPlaceholderText('Enter bug description'), { target: { value: 'desc' } });
    fireEvent.change(screen.getByPlaceholderText('Enter category'), { target: { value: 'test' } });
    const prioritySelects = screen.getAllByRole('combobox');
    const prioritySelect = prioritySelects[0]; // First select is priority
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit bug/i }));
      // Wait for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [err, payload] = onSubmit.mock.calls[0];
    expect(err).toBeNull();
    expect(payload.title).toBe('Bug A');
    expect(payload.priority).toBe('high');
  });

  it('returns validation error when missing fields', () => {
    const onSubmit = jest.fn();
    render(<BugForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /submit bug/i }));
    // The form should not submit when validation fails, so onSubmit should not be called
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
