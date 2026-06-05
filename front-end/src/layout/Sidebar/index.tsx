import { NavLink } from 'react-router-dom';

import { cn } from '@/utils/cn';

import styles from './styles.module.css';

export interface NavigationItem {
  label: string;
  to: string;
  description: string;
}

export interface SidebarProps {
  items: NavigationItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandBlock}>
        <span className={styles.brandTag}>ERP Flow</span>
        <h2 className={styles.brandTitle}>Production Board</h2>
        <p className={styles.brandText}>
          Manual creation, operational kanban and future ERP Flex import in the same workflow.
        </p>
      </div>

      <nav className={styles.navigation}>
        {items.map((item) => (
          <NavLink
            className={({ isActive }) => cn(styles.link, isActive && styles.activeLink)}
            key={item.to}
            to={item.to}
          >
            <span className={styles.linkLabel}>{item.label}</span>
            <span className={styles.linkDescription}>{item.description}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
