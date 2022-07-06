import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cssHasPseudo from 'css-has-pseudo/browser';
import { StrictMode, useEffect, useLayoutEffect } from 'react';

import styles from './styles/app.css';
import pretendardCss from './styles/fonts/pretendard.css';
import globalStyles from './styles/global.css';
import globalComponentStyle from './styles/globalComponentStyle.css';
import pageStyles from './styles/page.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: '덮집회의',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: pretendardCss },
  { rel: 'stylesheet', href: globalComponentStyle },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: pageStyles },
];

export default function App() {
  typeof window !== 'undefined'
    ? useLayoutEffect(() => {
        cssHasPseudo(document);
      }, [])
    : () => null;
  return (
    <html lang="en" className="font-Pretendard text-body2 text-darkgrey100">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
