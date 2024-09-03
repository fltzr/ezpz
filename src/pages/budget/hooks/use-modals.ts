import { useState } from 'react';
import type { BudgetItem, BudgetTableItem, Category } from '../utils/types';

type ModalType =
  | 'addIncomeSource'
  | 'updateIncomeSource'
  | 'deleteIncomeSource'
  | 'addCategory'
  | 'addBudgetItem'
  | 'editBudgetItem'
  | 'deleteItem';

type ModalState = {
  type: ModalType | null;
  props?: {
    item?: BudgetTableItem;
    category?: Category;
    budgetItem?: BudgetItem;
  };
};

export const useModals = () => {
  const [modalState, setModalState] = useState<ModalState>({ type: null, props: {} });

  const openModal = (type: ModalType, props = {}) => {
    setModalState({ type, props });
  };

  const closeModal = () => {
    setModalState({ type: null, props: {} });
  };

  return {
    modalState,
    openModal,
    closeModal,
  };
};
