import type { SVGProps } from 'react'
import * as React from 'react'

const SvgReceipt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M17.714 9.714H20c.631 0 1.143-.511 1.143-1.143V6.286c0-.631-.512-1.143-1.143-1.143H4c-.631 0-1.143.512-1.143 1.143V8.57c0 .632.512 1.143 1.143 1.143h2.286"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      clipRule="evenodd"
      d="M6.286 5.143h11.428v13.143c0 .63-.511 1.143-1.143 1.143H7.428a1.143 1.143 0 0 1-1.142-1.143V5.143Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.714 13.143 12 15.429l2.286-2.286M12 15.429V8.57"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgReceipt
