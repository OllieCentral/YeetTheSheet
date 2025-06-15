import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ExpenseList from './ExpenseList';

var useQueryMock: ReturnType<typeof vi.fn>;
var useMutationMock: ReturnType<typeof vi.fn>;

vi.mock('convex/react', () => {
  useQueryMock = vi.fn();
  useMutationMock = vi.fn();
  return {
    useQuery: useQueryMock,
    useMutation: () => useMutationMock,
  };
});

describe('ExpenseList', () => {
  it('renders loading spinner when data is undefined', () => {
    useQueryMock.mockReturnValueOnce(undefined);
    const { container } = render(<ExpenseList />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
