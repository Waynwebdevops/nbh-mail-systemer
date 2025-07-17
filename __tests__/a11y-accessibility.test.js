import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

// Mock NextRouter AVANT l'import des composants
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    events: { on: jest.fn(), off: jest.fn() },
    isFallback: false,
    basePath: '',
    locale: 'fr',
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
  }),
}));

// Mock AuthProvider AVANT l'import des composants
jest.mock('../components/AuthProvider', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
  useAuth: () => ({ user: { name: 'Test' }, logout: jest.fn() }),
}));

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MailModal from '../components/MailModal';
import MailTable from '../components/MailTable';

expect.extend(toHaveNoViolations);

describe('Accessibilité (a11y)', () => {
  it('Sidebar doit être accessible', async () => {
    const { container } = render(<Sidebar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it('Header doit être accessible', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it('MailModal doit être accessible', async () => {
    const { container } = render(<MailModal open mail={{}} onClose={() => {}} onSave={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it('MailTable doit être accessible', async () => {
    const { container } = render(<MailTable mails={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
