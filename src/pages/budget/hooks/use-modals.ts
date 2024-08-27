import { useState } from 'react';

export const useModals = () => {
  const [modals, setModals] = useState({
    addCategory: false,
    deleteCategory: false,
    addBudgetLineItem: false,
  });

  const openModal = (modal: keyof typeof modals) => () =>
    setModals((prev) => ({ ...prev, [modal]: true }));
  const closeModal = (modal: keyof typeof modals) => () =>
    setModals((prev) => ({ ...prev, [modal]: false }));

  return { modals, openModal, closeModal };
};
