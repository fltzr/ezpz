import { Container, Header, SpaceBetween } from '@cloudscape-design/components';

import { useAuth } from '@/pages/auth/hooks/use-auth';

const ProfileOverview = () => {
  const { user } = useAuth();

  return (
    <SpaceBetween direction='vertical' size='l'>
      <Header variant='h2'>Profile overview</Header>

      <Container>{JSON.stringify(user, null, 2)}</Container>
    </SpaceBetween>
  );
};

export default ProfileOverview;
