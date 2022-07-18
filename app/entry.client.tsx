import { RemixBrowser } from '@remix-run/react';
import { enableMapSet } from 'immer';
import * as React from 'react';
import type { InspectParams } from 'react-dev-inspector';
import { Inspector } from 'react-dev-inspector';
import { hydrateRoot } from 'react-dom/client';

enableMapSet();

hydrateRoot(
  document,
  <>
    <RemixBrowser />
    {process.env.NODE_ENV === 'development' && (
      <Inspector
        // props see docs:
        // https://github.com/zthxxx/react-dev-inspector#inspector-component-props
        keys={['shift', 'option', 'c']}
        disableLaunchEditor={true}
        onClickElement={(p: InspectParams) => {
          console.log('el', p.name, p.element);
          if (!p.codeInfo?.absolutePath) return;
          const { absolutePath, lineNumber, columnNumber } = p.codeInfo;
          // you can change the url protocol if you are using in Web IDE
          window.open(`webstorm://file/${absolutePath}:${lineNumber}:${columnNumber}`);
        }}
      />
    )}
  </>,
);
