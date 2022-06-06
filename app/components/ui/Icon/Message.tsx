import * as React from 'react'
import { SVGProps } from 'react'

const SvgMessage = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M18.857 4a2.286 2.286 0 0 1 2.286 2.286v11.428A2.286 2.286 0 0 1 18.857 20l-3.427-.001-2.622 2.621a1.143 1.143 0 0 1-1.508.095l-.108-.095L8.57 20 5.143 20a2.286 2.286 0 0 1-2.286-2.286V6.286A2.286 2.286 0 0 1 5.143 4h13.714Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.999 13.143c.571 0 1.143-.572 1.143-1.143 0-.572-.572-1.143-1.143-1.143-.572 0-1.142.572-1.142 1.143 0 .571.57 1.143 1.142 1.143Zm-4.572 0C8 13.143 8.57 12.57 8.57 12c0-.572-.571-1.143-1.143-1.143-.571 0-1.141.572-1.141 1.143 0 .571.57 1.143 1.141 1.143Zm9.143 0c.572 0 1.143-.572 1.143-1.143 0-.572-.572-1.143-1.143-1.143-.571 0-1.142.572-1.142 1.143 0 .571.57 1.143 1.142 1.143Z"
      fill="#000"
    />
  </svg>
)

export default SvgMessage
