import type { SVGProps } from 'react'
import * as React from 'react'

const SvgPlusSquare = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M18.857 16.571V7.43a2.286 2.286 0 0 0-2.286-2.286H7.43a2.286 2.286 0 0 0-2.286 2.286v9.142a2.286 2.286 0 0 0 2.286 2.286h9.142a2.286 2.286 0 0 0 2.286-2.286Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 8.571v6.922M15.428 12H8.572" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgPlusSquare
