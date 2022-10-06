import { RemixBrowser } from '@remix-run/react';
import { enableMapSet } from 'immer';
import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';

enableMapSet();

hydrateRoot(
  document,
  <>
    <RemixBrowser />
  </>,
);
