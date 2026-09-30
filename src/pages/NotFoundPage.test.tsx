import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders the 404 message and a home link', () => {
    render(
      <MemoryRouter initialEntries={['/en/404']}>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByText('Page Not Found')).toBeDefined();
    expect(screen.getByText('Go to Home')).toBeDefined();
  });
});
