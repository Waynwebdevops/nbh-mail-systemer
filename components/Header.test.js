import { render, screen } from '@testing-library/react';
import Header from './Header';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn(), pathname: '/' })
}));
jest.mock('./AuthProvider', () => ({
  useAuth: () => ({ user: { name: 'Test' }, logout: jest.fn() })
}));

describe('Header', () => {
  it('affiche le header avec accessibilité', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
