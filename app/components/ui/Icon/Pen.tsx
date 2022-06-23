import type { SVGProps } from 'react'
import * as React from 'react'

const SvgPen = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M19.429 4.571a2.424 2.424 0 0 1 0 3.429L8.57 18.857 4 20l1.143-4.507L16.004 4.576a2.418 2.418 0 0 1 3.274-.143l.15.138Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m17.714 7.429 1.143 1.142" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgPen
