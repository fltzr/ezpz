import { useEffect, useState } from 'react';
import {
  Container,
  Header,
  Box,
  Input,
  Button,
  KeyValuePairs,
  SpaceBetween,
  Spinner,
  StatusIndicator,
} from '@cloudscape-design/components';

import { formatCurrency } from '../../../common/utils/format-currency';
import { useBudgetState } from '../hooks/use-budget-state';
import { isBudgetItem } from '../utils/types';
import { BudgetPercentageChart } from './budget-percentage-chart';

const getBudgetStatus = (amount: number, budget: number) => {
  const difference = amount - budget;
  const differenceFormatted = formatCurrency(Math.abs(difference));

  if (difference < 0)
    return (
      <StatusIndicator type='success'>{differenceFormatted} under budget</StatusIndicator>
    );
  if (difference > 0)
    return (
      <StatusIndicator type='error'>{differenceFormatted} over budget</StatusIndicator>
    );
  return <StatusIndicator type='info'>On budget</StatusIndicator>;
};

export const BudgetOverview = () => {
  const { data, isLoading } = useBudgetState();

  const [isEditing, setIsEditing] = useState(false);
  const [amountToBudget, setAmountToBudget] = useState(0);
  const [newAmountToBudget, _setNewAmountToBudget] = useState(amountToBudget);

  const amountSpent =
    data?.reduce(
      (acc, curr) => (isBudgetItem(curr) ? acc + curr.projected_amount : acc),
      0
    ) ?? 0;

  useEffect(() => {
    if (amountToBudget === 0) {
      const amount = Number(localStorage.getItem('amount-to-budget') ?? 0);
      setAmountToBudget(amount);
    }
  }, []);

  return (
    <Container
      fitHeight
      header={<Header variant='h2'>Overview</Header>}
      footer={
        isEditing ? (
          <Box float='right'>
            <SpaceBetween direction='horizontal' size='m'>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button
                variant='primary'
                disabled={newAmountToBudget === amountToBudget}
                onClick={() => {
                  setIsEditing(false);
                }}>
                Save
              </Button>
            </SpaceBetween>
          </Box>
        ) : undefined
      }>
      {isLoading ? (
        <Spinner size='normal' />
      ) : (
        <>
          {isEditing ? (
            <Input
              value={amountToBudget.toString()}
              onChange={(e) => setAmountToBudget(Number(e.detail.value))}
            />
          ) : (
            <KeyValuePairs
              columns={3}
              items={[
                {
                  label: 'Amount to budget',
                  value: formatCurrency(amountToBudget),
                  info: (
                    <Button
                      variant='inline-icon'
                      disabled={isEditing || isLoading}
                      iconName='edit'
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    />
                  ),
                },
                { label: 'Amount spent', value: formatCurrency(amountSpent) },
                {
                  label: 'Amount left',
                  value: getBudgetStatus(amountSpent, amountToBudget),
                },
              ]}
            />
          )}
        </>
      )}
    </Container>
  );
};
