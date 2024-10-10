import { UIMatch, useMatches, useNavigate } from 'react-router-dom';

import { BreadcrumbGroup } from '@cloudscape-design/components';

export const Breadcrumbs = () => {
  const navigate = useNavigate();
  const matches = useMatches() as UIMatch<undefined, { crumb?: string }>[];

  const crumbs = matches.filter((item) => !!item.handle);

  return (
    <BreadcrumbGroup
      items={crumbs.map((item) => ({
        text: item.handle.crumb!,
        href: item.pathname,
      }))}
      onClick={(event) => {
        event.preventDefault();
        navigate(event.detail.href, { replace: true });
      }}
    />
  );
};
