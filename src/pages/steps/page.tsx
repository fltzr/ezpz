import { Box, Header, Steps } from '@cloudscape-design/components';

const StepsPage = () => {
  return (
    <Steps
      steps={[
        {
          header: <Header variant='h3'>Step 1</Header>,
          status: 'success',
          details: <Box variant='span'>Step 1 details!</Box>,
        },
        {
          header: <Header variant='h3'>Step 2</Header>,
          status: 'error',
          details: <Box variant='span'>Step 2 details!</Box>,
        },
      ]}
    />
  );
};

export default StepsPage;
