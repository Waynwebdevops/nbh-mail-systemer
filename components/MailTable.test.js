import { render, screen } from '@testing-library/react';
import MailTable from './MailTable';
import '@testing-library/jest-dom';

describe('MailTable', () => {
  it('affiche le tableau des courriers', () => {
    render(<MailTable mails={[]} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
