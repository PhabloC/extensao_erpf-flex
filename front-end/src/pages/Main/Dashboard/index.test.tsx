import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import DashboardPage from './index';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    accessToken: 'token',
    isAuthenticated: true,
    signIn: vi.fn(),
    signOut: vi.fn(),
    userEmail: 'planner@example.com',
    userName: 'Planner',
  }),
}));

vi.mock('@/hooks/useProductionOrders', () => ({
  useProductionOrders: () => ({
    orders: [
      {
        id: 'd4d6aab0-33fa-4ec0-b5f9-2776855e4785',
        orderNumber: 'OP-ERP-20458',
        item: {
          productCode: 'ERP-001',
          productDescription: 'Bobina Importada',
          quantity: 22,
          unit: 'kg',
        },
        issueDate: '2026-06-05',
        dueDate: '2026-06-06',
        notes: 'Importada com prioridade alta.',
        status: 'backlog',
        source: {
          origin: 'erp-flex',
          externalOrderId: 'ERP-OP-20458',
          sourcePageUrl: 'https://erp-flex.example.com/orders/20458',
          importedAt: '2026-06-05T13:15:00.000Z',
          importedByUserId: '0d7437db-4618-464c-bec6-5cf17dbca736',
        },
        createdAt: '2026-06-05T13:16:00.000Z',
        createdByUserId: '0d7437db-4618-464c-bec6-5cf17dbca736',
        history: [
          {
            id: 'afe36b37-41ea-4ab2-a08d-59815f8fd1bd',
            eventType: 'imported',
            fromStatus: null,
            toStatus: 'backlog',
            notes:
              'ERP external id: ERP-OP-20458 | Source page: https://erp-flex.example.com/orders/20458 | Capture strategy: structured+dom | Captured at: 2026-06-05T13:15:00.000Z',
            createdAt: '2026-06-05T13:16:00.000Z',
            createdByUserId: '0d7437db-4618-464c-bec6-5cf17dbca736',
          },
        ],
      },
    ],
    isLoading: false,
    isSubmitting: false,
    isUpdatingStatus: null,
    error: null,
    reload: vi.fn(),
    createOrder: vi.fn(),
    moveOrder: vi.fn(),
  }),
}));

describe('DashboardPage', () => {
  it('renders traceability details for ERP-imported orders', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /production orders/i })).toBeInTheDocument();
    expect(screen.getAllByText('ERP Flex').length).toBeGreaterThan(0);
    expect(screen.getByText('ERP-OP-20458')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open erp page/i })).toHaveAttribute(
      'href',
      'https://erp-flex.example.com/orders/20458',
    );
    expect(screen.getByText(/capture strategy: structured\+dom/i)).toBeInTheDocument();
  });
});
