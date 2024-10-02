import { LoadingBar } from '@cloudscape-design/chat-components';
import { PropsWithChildren, Suspense } from 'react';

export const SuspenseLoadingBar = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<LoadingBar variant='gen-ai-masked' />}>{children}</Suspense>
);
