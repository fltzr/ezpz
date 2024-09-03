import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Form,
  FormField,
  Input,
  Modal,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';

import {
  type BudgetItem,
  type BudgetItemUpdate,
  type Category,
  isCategoryItem,
} from '../utils/types';
import { useBudgetState } from '../hooks/use-budget-state';

type EditBudgetItemModalProps = {
  visible: boolean;
  onClose: () => void;
  onEdit: (item: BudgetItemUpdate) => void;
  item: BudgetItem;
};

const budgetItemSchema = z.object({
  budget_item_name: z.string({ required_error: 'Budget item name is required.' }),
  projected_amount: z
    .number({ required_error: 'Budget amount for this item is required.' })
    .nonnegative('Budget amount must be a non-negative number.'),
  category_id: z.string({
    required_error: 'This budget item must be associated to a category.',
  }),
});

type BudgetItemSchema = z.infer<typeof budgetItemSchema>;

export const EditBudgetItemModal = ({
  visible,
  onClose,
  onEdit,
  item,
}: EditBudgetItemModalProps) => {
  const { data } = useBudgetState();
  const categories = (data?.filter(isCategoryItem) as Category[]) ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BudgetItemSchema>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      budget_item_name: item?.budget_item_name ?? '',
      projected_amount: item?.projected_amount ?? 0,
      category_id: item?.category_id,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && item) {
      reset({
        budget_item_name: item?.budget_item_name,
        projected_amount: item.projected_amount,
        category_id: item.category_id,
      });
    }
  }, [visible, item, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: BudgetItemSchema) => {
    const updates: BudgetItemUpdate = {
      id: item.id,
      ...Object.fromEntries(
        Object.entries(data).filter(
          ([key, value]) => value !== item[key as keyof BudgetItem]
        )
      ),
    };
    onEdit(updates);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleClose}
      header={`Edit ${item?.budget_item_name}`}
      footer={
        <Box float='right'>
          <SpaceBetween size='xs' direction='horizontal'>
            <Button variant='link' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='primary'
              disabled={!isDirty}
              onClick={() => handleSubmit(handleOnSubmit)()}>
              Update
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <Form>
        <SpaceBetween direction='vertical' size='l'>
          <Controller
            control={control}
            name='budget_item_name'
            render={({ field }) => (
              <FormField
                label='Budget item name'
                errorText={errors.budget_item_name?.message}>
                <Input
                  {...field}
                  ref={inputRef}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder={item?.budget_item_name ?? 'Enter a descriptive name'}
                  onChange={(event) => field.onChange(event.detail.value)}
                />
              </FormField>
            )}
          />

          <Controller
            control={control}
            name='projected_amount'
            render={({ field }) => (
              <FormField
                label='Projected amount'
                errorText={errors.projected_amount?.message}>
                <Input
                  {...field}
                  ref={inputRef}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  type='number'
                  inputMode='decimal'
                  placeholder='Enter the projected amount'
                  value={String(field.value)}
                  onChange={(event) => field.onChange(Number(event.detail.value))}
                />
              </FormField>
            )}
          />

          <Controller
            control={control}
            name='category_id'
            render={({ field }) => (
              <FormField label='Category' errorText={errors.category_id?.message}>
                <Select
                  {...field}
                  options={categories.map((category) => ({
                    label: category.category_name,
                    value: category.id,
                  }))}
                  selectedOption={
                    field.value
                      ? {
                          label: categories.find(
                            (category) => category.id === field.value
                          )?.category_name,
                          value: field.value,
                        }
                      : null
                  }
                  onChange={({ detail }) => field.onChange(detail.selectedOption.value)}
                />
              </FormField>
            )}
          />
        </SpaceBetween>
      </Form>
    </Modal>
  );
};

// export const EditBudgetItemModal = ({
//   visible,
//   onClose,
//   onEdit,
//   item,
// }: EditBudgetItemModalProps) => {
//   const visibleAndItemPresent = !!(visible && item);
//   const { data } = useBudgetState();
//   const categories = (data?.filter(isCategoryItem) as Category[]) ?? [];

//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm<BudgetItemSchema>({
//     resolver: zodResolver(budgetItemSchema),
//     defaultValues: {
//       budget_item_name: '',
//       projected_amount: 0,
//       category_id: '',
//     },
//   });
//   const watchedFields = watch();
//   const [hasChanges, setHasChanges] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (visible && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [visible]);

//   useEffect(() => {
//     if (visibleAndItemPresent) {
//       console.log(`visible and item present: `, item);
//       reset({
//         budget_item_name: item.budget_item_name,
//         projected_amount: item.projected_amount,
//         category_id: item.category_id,
//       });
//     }
//   }, [visible, item, reset]);

//   useEffect(() => {
//     if (item) {
//       const changes = pickBy(
//         {
//           ...watchedFields,
//         },
//         (value, key) => !isEqual(value, item[key as keyof BudgetItem])
//       );

//       setHasChanges(Object.keys(changes).length > 0);
//     }
//   }, [watchedFields, item]);

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   const handleOnSubmit = (data: BudgetItemSchema) => {
//     const updates: BudgetItemUpdate = {
//       id: item.id,
//     };

//     if (data.budget_item_name !== item.budget_item_name) {
//       updates.budget_item_name = data.budget_item_name;
//     }

//     if (data.projected_amount !== item.projected_amount) {
//       updates.projected_amount = data.projected_amount;
//     }

//     if (data.category_id !== item.category_id) {
//       updates.category_id = data.category_id;
//     }

//     console.log(updates);

//     onEdit(updates);
//     handleClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       onDismiss={handleClose}
//       header={`Edit ${item?.budget_item_name}`}
//       footer={
//         <Box float='right'>
//           <SpaceBetween size='xs' direction='horizontal'>
//             <Button variant='link' onClick={handleClose}>
//               Cancel
//             </Button>
//             <Button
//               variant='primary'
//               disabled={!hasChanges}
//               onClick={() => handleSubmit(handleOnSubmit)()}>
//               Update
//             </Button>
//           </SpaceBetween>
//         </Box>
//       }>
//       <Form>
//         <SpaceBetween direction='vertical' size='l'>
//           <Controller
//             control={control}
//             name='budget_item_name'
//             render={({ field }) => (
//               <FormField
//                 label='Budget item name'
//                 errorText={errors.budget_item_name?.message}>
//                 <Input
//                   {...field}
//                   ref={inputRef}
//                   disableBrowserAutocorrect
//                   autoComplete={false}
//                   placeholder={
//                     visibleAndItemPresent
//                       ? item.budget_item_name
//                       : 'Enter a descriptive name'
//                   }
//                   value={
//                     visibleAndItemPresent && !field.value
//                       ? item.budget_item_name
//                       : field.value
//                   }
//                   onChange={(event) => field.onChange(event.detail.value)}
//                 />
//               </FormField>
//             )}
//           />
//           <Controller
//             control={control}
//             name='projected_amount'
//             render={({ field }) => (
//               <FormField
//                 label='Projected amount'
//                 errorText={errors.projected_amount?.message}>
//                 <Input
//                   {...field}
//                   disableBrowserAutocorrect
//                   autoComplete={false}
//                   placeholder={
//                     visibleAndItemPresent
//                       ? String(item.projected_amount)
//                       : 'Enter the projected amount'
//                   }
//                   value={String(
//                     visibleAndItemPresent && !field.value
//                       ? item.projected_amount
//                       : field.value
//                   )}
//                   onChange={(event) => field.onChange(Number(event.detail.value))}
//                 />
//               </FormField>
//             )}
//           />
//           <Controller
//             control={control}
//             name='category_id'
//             render={({ field }) => (
//               <FormField label='Category' errorText={errors.category_id?.message}>
//                 <Select
//                   {...field}
//                   options={categories.map((category) => ({
//                     label: category.category_name,
//                     value: category.id,
//                   }))}
//                   selectedOption={
//                     visibleAndItemPresent
//                       ? {
//                           label: categories.find(
//                             (c) => c.id === (field.value || item.category_id)
//                           )?.category_name,
//                           value: field.value,
//                         }
//                       : null
//                   }
//                   onChange={({ detail }) => field.onChange(detail.selectedOption.value)}
//                 />
//               </FormField>
//             )}
//           />
//         </SpaceBetween>
//       </Form>
//     </Modal>
//   );
// };
