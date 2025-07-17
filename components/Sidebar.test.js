import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import '@testing-library/jest-dom';
jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn(), pathname: '/' })
}));

describe('Sidebar', () => {
  it('affiche les liens de navigation', () => {
    render(<Sidebar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
