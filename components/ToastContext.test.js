import { render, screen } from '@testing-library/react';
import { ToastProvider } from './ToastContext';
import '@testing-library/jest-dom';

describe('ToastContext', () => {
  it('fournit le contexte Toast', () => {
    render(<ToastProvider><div>Test</div></ToastProvider>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
