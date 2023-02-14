import { RemixBrowser } from '@remix-run/react';
import { enableMapSet } from 'immer';
import * as React from 'react';
import { hydrate } from 'react-dom';

enableMapSet();

hydrate(<RemixBrowser />, document);
