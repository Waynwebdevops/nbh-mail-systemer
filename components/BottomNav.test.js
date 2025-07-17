import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import BottomNav from './BottomNav';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('BottomNav', () => {
  it('affiche tous les liens de navigation', () => {
    useRouter.mockReturnValue({ pathname: '/' });
    render(<BottomNav showOnDesktop={true} />);
    expect(screen.getByLabelText('Accueil')).toBeInTheDocument();
    expect(screen.getByLabelText('Courrier Arrivé')).toBeInTheDocument();
    expect(screen.getByLabelText('Courrier Départ')).toBeInTheDocument();
    expect(screen.getByLabelText('Partenaires')).toBeInTheDocument();
    expect(screen.getByLabelText('Paramètres')).toBeInTheDocument();
  });

  it('met en avant le lien actif', () => {
    useRouter.mockReturnValue({ pathname: '/dashboard/partenaires' });
    render(<BottomNav showOnDesktop={true} />);
    const partenaires = screen.getByLabelText('Partenaires');
    expect(partenaires.className).toMatch(/text-primary/);
  });
});
