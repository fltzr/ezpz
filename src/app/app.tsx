import { createPortal } from 'react-dom';
import {
  AppLayout,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  TopNavigation,
} from '@cloudscape-design/components';
import type { PropsWithChildren } from 'react';

export const TopNavigationPortal = ({ children }: PropsWithChildren) => {
  const dom = document.querySelector('#h');

  return dom ? createPortal(children, dom) : null;
};

export const App = () => {
  return (
    <>
      <TopNavigationPortal>
        <TopNavigation
          identity={{
            href: '/',
            title: 'ezpz',
          }}
        />
      </TopNavigationPortal>
      <AppLayout
        headerSelector="#h"
        content={
          <ContentLayout
            defaultPadding
            disableOverlap
            header={<Header variant="h1">Welcome!</Header>}
          >
            <SpaceBetween size="xxl">
              <Container>Container!</Container>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </>
  );
};
