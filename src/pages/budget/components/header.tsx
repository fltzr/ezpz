import { Header } from '@cloudscape-design/components';

export const ViewBudgetHeader = ({ name }: { name: string }) => {
  return <Header variant='h1'>{name}'s Budget Dashboard</Header>;
};
