import React, { createContext, useContext, useState, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 1. Define explicit types for the Context State
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Utility helper to safely merge Tailwind classes dynamically
const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

/**
 * Root Component: Establishes context scope for state synchronization
 */
export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full flex flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sub-Component: Flex container managing the tab triggers
 */
Tabs.List = function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn('flex border-b border-gray-200 dark:border-gray-700 space-x-2', className)}>
      {children}
    </div>
  );
};

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * Sub-Component: Clickable element that updates active state
 */
Tabs.Trigger = function TabTrigger({ value, children, className }: TabTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Trigger must be wrapped within a <Tabs /> provider');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-[2px]',
        isActive
          ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * Sub-Component: Conditionally renders content matching active value
 */
Tabs.Panel = function TabPanel({ value, children, className }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Panel must be wrapped within a <Tabs /> provider');

  const { activeTab } = context;
  if (activeTab !== value) return null;

  return (
    <div className={cn('py-4 animate-fade-in text-gray-900 dark:text-gray-100', className)}>
      {children}
    </div>
  );
};
