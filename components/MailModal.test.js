import { render, screen } from '@testing-library/react';
import MailModal from './MailModal';
import '@testing-library/jest-dom';

describe('MailModal', () => {
  it('affiche le formulaire de courrier', () => {
    render(<MailModal open mail={{}} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
