import { PropsWithChildren, Suspense } from 'react';

import { LoadingBar } from '@cloudscape-design/chat-components';

export const SuspenseLoadingBar = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<LoadingBar variant='gen-ai-masked' />} name={children?.toString()}>
    {children}
  </Suspense>
);
