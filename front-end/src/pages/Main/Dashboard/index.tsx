import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useProductionOrders } from '@/hooks/useProductionOrders';
import MainLayout from '@/layout/MainLayout';
import { bootstrapSession } from '@/services/auth/bootstrapSession';
import type { ProductionOrder, ProductionOrderStatus } from '@/types/productionOrder';
import Button from '@/ui/Button';
import Card from '@/ui/Card';
import Input from '@/ui/Input';
import Modal from '@/ui/Modal';
import Table, { type TableColumn } from '@/ui/Table';

import styles from './styles.module.css';

const sessionSchema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.').max(80, 'Use at most 80 characters.'),
  email: z.string().trim().email('Use a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.').max(64, 'Use at most 64 characters.'),
});

const createOrderSchema = z.object({
  orderNumber: z.string().trim().min(1, 'Order number is required.').max(120),
  productCode: z.string().trim().min(1, 'Product code is required.').max(60),
  productDescription: z
    .string()
    .trim()
    .min(1, 'Product description is required.')
    .max(240),
  quantity: z.coerce.number().min(0.01, 'Quantity must be greater than zero.'),
  unit: z.string().trim().max(20).optional().or(z.literal('')),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
});

type SessionFormValues = z.infer<typeof sessionSchema>;
type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

const kanbanFlow: ProductionOrderStatus[] = [
  'backlog',
  'ready',
  'in_progress',
  'paused',
  'done',
  'canceled',
];

function getNextStatus(status: ProductionOrderStatus): ProductionOrderStatus | null {
  const currentIndex = kanbanFlow.indexOf(status);

  if (currentIndex < 0 || currentIndex >= kanbanFlow.length - 2) {
    return null;
  }

  return kanbanFlow[currentIndex + 1] ?? null;
}

function formatOriginLabel(origin: ProductionOrder['source']['origin']) {
  return origin === 'erp-flex' ? 'ERP Flex' : 'Manual';
}

function formatDateTime(value: string | null) {
  if (!value) {
    return 'Not available';
  }

  return format(new Date(value), 'dd/MM/yyyy HH:mm');
}

function formatHistoryEvent(event: ProductionOrder['history'][number]) {
  switch (event.eventType) {
    case 'imported':
      return 'Imported from ERP Flex';
    case 'status_changed':
      return `Status changed to ${event.toStatus?.replaceAll('_', ' ') ?? 'unknown'}`;
    case 'created':
      return 'Manual order created';
    default:
      return event.eventType.replaceAll('_', ' ');
  }
}

export default function DashboardPage() {
  const { accessToken, isAuthenticated, signIn, signOut, userEmail, userName } = useAuth();
  const productionOrdersState = useProductionOrders(Boolean(accessToken));
  const {
    createOrder,
    error,
    isLoading,
    isSubmitting,
    isUpdatingStatus,
    moveOrder,
    orders,
    reload,
  } = productionOrdersState;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSessionSubmitting, setIsSessionSubmitting] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const sessionForm = useForm<SessionFormValues>({
    defaultValues: {
      name: 'Production Planner',
      email: 'planner@example.com',
      password: 'password123',
    },
  });
  const createOrderForm = useForm<CreateOrderFormValues>({
    defaultValues: {
      orderNumber: '',
      productCode: '',
      productDescription: '',
      quantity: 1,
      unit: 'pc',
      issueDate: '',
      dueDate: '',
      notes: '',
    },
  });

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null;

  const columns: TableColumn<ProductionOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order',
      render: (row) => (
        <div className={styles.tablePrimaryCell}>
          <button
            className={styles.orderLink}
            onClick={() => {
              setSelectedOrderId(row.id);
            }}
            type="button"
          >
            {row.orderNumber}
          </button>
          <span className={styles.tableMeta}>
            {row.item.productDescription}
            {row.source.externalOrderId ? ` · ERP ${row.source.externalOrderId}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'origin',
      header: 'Origin',
      align: 'center',
      render: (row) => <span className={styles.tableMeta}>{formatOriginLabel(row.source.origin)}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due date',
      align: 'right',
      render: (row) => (row.dueDate ? format(new Date(row.dueDate), 'dd/MM/yyyy') : 'Not set'),
    },
  ];

  const ordersByStatus = useMemo(
    () =>
      kanbanFlow.map((status) => ({
        status,
        items: orders.filter((order) => order.status === status),
      })),
    [orders],
  );

  const handleSessionAction = () => {
    if (isAuthenticated) {
      signOut();
      return;
    }

    setIsSessionModalOpen(true);
  };

  const handleSessionSubmit = sessionForm.handleSubmit(async (values) => {
    const parsedValues = sessionSchema.safeParse(values);

    if (!parsedValues.success) {
      const firstIssue = parsedValues.error.issues[0];

      if (firstIssue?.path[0]) {
        sessionForm.setError(firstIssue.path[0] as keyof SessionFormValues, {
          type: 'manual',
          message: firstIssue.message,
        });
      }

      return;
    }

    setIsSessionSubmitting(true);

    try {
      const session = await bootstrapSession(parsedValues.data);

      signIn({
        userName: session.user.name,
        userEmail: session.user.email,
        accessToken: session.accessToken,
      });
      sessionForm.reset(parsedValues.data);
      setIsSessionModalOpen(false);
    } catch (requestError) {
      sessionForm.setError('email', {
        type: 'manual',
        message:
          requestError instanceof Error
            ? requestError.message
            : 'Failed to start authenticated session.',
      });
    } finally {
      setIsSessionSubmitting(false);
    }
  });

  const handleCreateOrderSubmit = createOrderForm.handleSubmit(async (values) => {
    const parsedValues = createOrderSchema.safeParse(values);

    if (!parsedValues.success) {
      const firstIssue = parsedValues.error.issues[0];

      if (firstIssue?.path[0]) {
        createOrderForm.setError(firstIssue.path[0] as keyof CreateOrderFormValues, {
          type: 'manual',
          message: firstIssue.message,
        });
      }

      return;
    }

    try {
      const createdOrder = await createOrder({
        orderNumber: parsedValues.data.orderNumber,
        item: {
          productCode: parsedValues.data.productCode,
          productDescription: parsedValues.data.productDescription,
          quantity: parsedValues.data.quantity,
          unit: parsedValues.data.unit || undefined,
        },
        issueDate: parsedValues.data.issueDate || undefined,
        dueDate: parsedValues.data.dueDate || undefined,
        notes: parsedValues.data.notes || undefined,
      });

      setSelectedOrderId(createdOrder.id);
      createOrderForm.reset();
      setIsCreateModalOpen(false);
    } catch {
      return;
    }
  });

  return (
    <MainLayout
      actions={
        <>
          <Button
            disabled={!isAuthenticated}
            onClick={() => {
              void reload();
            }}
            variant="ghost"
          >
            Refresh orders
          </Button>
          <Button
            disabled={!isAuthenticated}
            onClick={() => {
              createOrderForm.reset();
              setIsCreateModalOpen(true);
            }}
          >
            New production order
          </Button>
        </>
      }
      isAuthenticated={isAuthenticated}
      onSessionToggle={handleSessionAction}
      sessionActionLabel={isAuthenticated ? 'Disconnect' : 'Connect API'}
      sessionLabel={isAuthenticated ? `${userName ?? 'Operator'} · ${userEmail ?? ''}` : 'No API session'}
      subtitle="Manual order creation, authenticated API consumption and kanban tracking for the MVP."
      title="Production Orders"
    >
      <div className={styles.heroGrid}>
        <Card
          actions={<StatusBadge status={isAuthenticated ? 'active' : 'pending'} />}
          description="Start an authenticated backend session to load orders and create new ones."
          title="Session"
        >
          <div className={styles.workspaceStack}>
            <p className={styles.workspaceName}>
              {isAuthenticated ? 'API connected' : 'Authentication required'}
            </p>
            <p className={styles.workspaceMeta}>
              Current operator:{' '}
              <strong>{isAuthenticated ? userName ?? 'Authenticated user' : 'Guest preview'}</strong>
            </p>
            <div className={styles.inlineActions}>
              <Button onClick={handleSessionAction} variant="secondary">
                {isAuthenticated ? 'Sign out from API' : 'Open session form'}
              </Button>
              <span className={styles.inlineHint}>
                The same credentials can be reused; the UI provisions the user only if needed.
              </span>
            </div>
          </div>
        </Card>

        <Card description="Orders currently loaded in the authenticated session." title="Loaded orders">
          <p className={styles.metricValue}>{orders.length}</p>
        </Card>

        <Card description="Orders created directly in the system without ERP import." title="Manual orders">
          <p className={styles.metricValue}>
            {orders.filter((order) => order.source.origin === 'manual').length}
          </p>
        </Card>

        <Card description="Orders already tagged as ERP-originated in the system." title="ERP-origin orders">
          <p className={styles.metricValue}>
            {orders.filter((order) => order.source.origin === 'erp-flex').length}
          </p>
        </Card>
      </div>

      <div className={styles.contentGrid}>
        <Card description="Use the table to review the active dataset and open a specific order." title="Order list">
          {!isAuthenticated ? (
            <p className={styles.loadingState}>Authenticate to load production orders from the backend.</p>
          ) : isLoading ? (
            <p aria-live="polite" className={styles.loadingState}>
              Loading production orders...
            </p>
          ) : (
            <Table columns={columns} data={orders} emptyMessage="No production orders created yet." />
          )}
          {error ? (
            <p className={styles.errorText} role="alert">
              {error}
            </p>
          ) : null}
        </Card>

        <Card
          description="Basic detail view to expose traceability, manual notes and the latest status history."
          title="Order details"
        >
          {selectedOrder ? (
            <div className={styles.detailStack}>
              <div className={styles.detailHeader}>
                <div>
                  <p className={styles.detailEyebrow}>{selectedOrder.item.productCode}</p>
                  <h2 className={styles.detailTitle}>{selectedOrder.orderNumber}</h2>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <dl className={styles.detailGrid}>
                <div>
                  <dt>Product</dt>
                  <dd>{selectedOrder.item.productDescription}</dd>
                </div>
                <div>
                  <dt>Quantity</dt>
                  <dd>
                    {selectedOrder.item.quantity} {selectedOrder.item.unit ?? ''}
                  </dd>
                </div>
                <div>
                  <dt>Origin</dt>
                  <dd>{formatOriginLabel(selectedOrder.source.origin)}</dd>
                </div>
                <div>
                  <dt>Due date</dt>
                  <dd>
                    {selectedOrder.dueDate
                      ? format(new Date(selectedOrder.dueDate), 'dd/MM/yyyy')
                      : 'Not set'}
                  </dd>
                </div>
                <div>
                  <dt>Imported at</dt>
                  <dd>{formatDateTime(selectedOrder.source.importedAt)}</dd>
                </div>
                <div>
                  <dt>Source URL</dt>
                  <dd className={styles.detailValueWrap}>
                    {selectedOrder.source.sourcePageUrl ? (
                      <a
                        className={styles.detailLink}
                        href={selectedOrder.source.sourcePageUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open ERP page
                      </a>
                    ) : (
                      'Not available'
                    )}
                  </dd>
                </div>
              </dl>

              <div className={styles.metadataBlock}>
                <p>
                  External ERP id: <strong>{selectedOrder.source.externalOrderId ?? 'Not available'}</strong>
                </p>
                <p>
                  Imported by user id:{' '}
                  <strong>{selectedOrder.source.importedByUserId ?? 'Not available'}</strong>
                </p>
                <p>
                  Notes: <strong>{selectedOrder.notes || 'No notes registered.'}</strong>
                </p>
              </div>

              <div className={styles.historyBlock}>
                <h3 className={styles.historyTitle}>Recent history</h3>
                <ul className={styles.historyList}>
                  {selectedOrder.history.slice().reverse().map((event) => (
                    <li className={styles.historyItem} key={event.id}>
                      <strong>{formatHistoryEvent(event)}</strong> ·{' '}
                      {format(new Date(event.createdAt), 'dd/MM/yyyy HH:mm')}
                      {event.notes ? <span className={styles.historyNotes}>{event.notes}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className={styles.loadingState}>Select an order from the list after authentication.</p>
          )}
        </Card>
      </div>

      <Card
        description="The kanban groups orders by operational stage and exposes a pragmatic move-to-next action."
        title="Production kanban"
      >
        {!isAuthenticated ? (
          <p className={styles.loadingState}>Authenticate to visualize the kanban fed by the backend.</p>
        ) : (
          <div className={styles.kanbanGrid}>
            {ordersByStatus.map((column) => (
              <section className={styles.kanbanColumn} key={column.status}>
                <header className={styles.kanbanColumnHeader}>
                  <div>
                    <h2 className={styles.kanbanColumnTitle}>{column.status.replaceAll('_', ' ')}</h2>
                    <p className={styles.kanbanColumnMeta}>{column.items.length} orders</p>
                  </div>
                  <StatusBadge status={column.status} />
                </header>

                <div className={styles.kanbanColumnBody}>
                  {column.items.length === 0 ? (
                    <p className={styles.emptyColumn}>No orders in this stage.</p>
                  ) : (
                    column.items.map((order) => {
                      const nextStatus = getNextStatus(order.status);

                      return (
                        <article className={styles.kanbanCard} key={order.id}>
                          <button
                            className={styles.kanbanCardTrigger}
                            onClick={() => {
                              setSelectedOrderId(order.id);
                            }}
                            type="button"
                          >
                            <span className={styles.kanbanOrderNumber}>{order.orderNumber}</span>
                            <span className={styles.kanbanDescription}>
                              {order.item.productDescription}
                            </span>
                          </button>

                          <div className={styles.kanbanMetaRow}>
                            <span>
                              {order.item.quantity} {order.item.unit ?? ''}
                            </span>
                            <span>{formatOriginLabel(order.source.origin)}</span>
                          </div>
                          {order.source.externalOrderId ? (
                            <p className={styles.kanbanTraceability}>
                              ERP id {order.source.externalOrderId}
                            </p>
                          ) : null}

                          <div className={styles.kanbanActions}>
                            {nextStatus ? (
                              <Button
                                disabled={isUpdatingStatus === order.id}
                                onClick={() => {
                                  void moveOrder(order.id, nextStatus).catch(() => undefined);
                                }}
                                size="sm"
                              >
                                {isUpdatingStatus === order.id
                                  ? 'Moving...'
                                  : `Move to ${nextStatus.replaceAll('_', ' ')}`}
                              </Button>
                            ) : (
                              <span className={styles.finalStateLabel}>Final state</span>
                            )}
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </Card>

      <Modal
        description="Provision the planner user if it does not exist yet, then open an authenticated API session."
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Connect backend session"
      >
        <form
          className={styles.form}
          onSubmit={(event) => {
            void handleSessionSubmit(event);
          }}
        >
          <Input
            errorMessage={sessionForm.formState.errors.name?.message}
            label="Display name"
            placeholder="Production Planner"
            {...sessionForm.register('name')}
          />
          <Input
            errorMessage={sessionForm.formState.errors.email?.message}
            helperText="The UI will create the user if this email is not registered yet."
            label="Email"
            placeholder="planner@example.com"
            type="email"
            {...sessionForm.register('email')}
          />
          <Input
            errorMessage={sessionForm.formState.errors.password?.message}
            label="Password"
            placeholder="Use a strong password"
            type="password"
            {...sessionForm.register('password')}
          />

          <div className={styles.modalActions}>
            <Button onClick={() => setIsSessionModalOpen(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isSessionSubmitting} type="submit">
              {isSessionSubmitting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        description="Create a manual production order when the ERP import is not being used yet."
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New production order"
      >
        <form
          className={styles.form}
          onSubmit={(event) => {
            void handleCreateOrderSubmit(event);
          }}
        >
          <Input
            errorMessage={createOrderForm.formState.errors.orderNumber?.message}
            label="Order number"
            placeholder="OP-2026-001"
            {...createOrderForm.register('orderNumber')}
          />
          <Input
            errorMessage={createOrderForm.formState.errors.productCode?.message}
            label="Product code"
            placeholder="PRD-001"
            {...createOrderForm.register('productCode')}
          />
          <Input
            errorMessage={createOrderForm.formState.errors.productDescription?.message}
            label="Product description"
            placeholder="Steel coil"
            {...createOrderForm.register('productDescription')}
          />
          <div className={styles.formGrid}>
            <Input
              errorMessage={createOrderForm.formState.errors.quantity?.message}
              label="Quantity"
              min="0.01"
              step="0.01"
              type="number"
              {...createOrderForm.register('quantity')}
            />
            <Input
              errorMessage={createOrderForm.formState.errors.unit?.message}
              label="Unit"
              placeholder="pc"
              {...createOrderForm.register('unit')}
            />
          </div>
          <div className={styles.formGrid}>
            <Input
              errorMessage={createOrderForm.formState.errors.issueDate?.message}
              label="Issue date"
              type="date"
              {...createOrderForm.register('issueDate')}
            />
            <Input
              errorMessage={createOrderForm.formState.errors.dueDate?.message}
              label="Due date"
              type="date"
              {...createOrderForm.register('dueDate')}
            />
          </div>
          <Input
            errorMessage={createOrderForm.formState.errors.notes?.message}
            helperText="Optional operational context for the production team."
            label="Notes"
            placeholder="Cutting priority, line allocation, material constraint..."
            {...createOrderForm.register('notes')}
          />

          <div className={styles.modalActions}>
            <Button onClick={() => setIsCreateModalOpen(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isSubmitting || !isAuthenticated} type="submit">
              {isSubmitting ? 'Creating...' : 'Create order'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
