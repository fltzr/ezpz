import { Container, KeyValuePairs } from '@cloudscape-design/components';

export const Summary = () => {
  return (
    <Container>
      <KeyValuePairs
        columns={2}
        items={[
          {
            label: 'Total amount',
            value: 50,
          },
          {
            label: 'Net change',
            value: 50,
          },
        ]}
      />
    </Container>
  );
};
