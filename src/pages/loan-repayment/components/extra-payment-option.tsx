import { useState } from 'react';

import {
  Box,
  Button,
  Container,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

type ExtraPaymentOptionProps = {
  isDisabled: boolean;
  onAddExtraPayment: (payment: number) => void;
  onRemoveExtraPayment: (payment: number) => void;
};

export const ExtraPaymentOption = ({
  isDisabled,
  onAddExtraPayment,
  onRemoveExtraPayment,
}: ExtraPaymentOptionProps) => {
  const [extraPayment, setExtraPayment] = useState(0);

  const handleAddExtraPayment = (payment: number) => {
    onAddExtraPayment(payment);
  };

  const handleRemoveExtraPayment = (payment: number) => {
    onRemoveExtraPayment(payment);
  };

  return (
    <Container
      header={
        <Header variant='h2'>What if I made an extra one time payment of...</Header>
      }
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button
              disabled={isDisabled}
              variant='primary'
              onClick={() => handleAddExtraPayment(extraPayment)}>
              Check
            </Button>
            <Button
              disabled={isDisabled}
              variant='link'
              onClick={() => handleRemoveExtraPayment(extraPayment)}>
              Remove payment
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <Input
        disabled={isDisabled}
        value={String(extraPayment)}
        onChange={({ detail }) => setExtraPayment(Number(detail.value))}
      />
    </Container>
  );
};
