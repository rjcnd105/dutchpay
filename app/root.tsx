import type {
  ErrorBoundaryComponent,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { ToastContainer } from 'react-toastify';

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
  console.log('app');
  return (
    <html lang="ko" className="font-Pretendard text-body2 text-darkgrey300">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          closeButton={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          hideProgressBar
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <html lang="ko">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
};
