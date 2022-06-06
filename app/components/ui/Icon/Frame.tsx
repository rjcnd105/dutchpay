import * as React from 'react'
import { SVGProps } from 'react'

const SvgFrame = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 13.143a1.143 1.143 0 1 0 0-2.286 1.143 1.143 0 0 0 0 2.286ZM12 7.429a1.143 1.143 0 1 0 0-2.286 1.143 1.143 0 0 0 0 2.286ZM12 18.857a1.143 1.143 0 1 0 0-2.286 1.143 1.143 0 0 0 0 2.286Z"
      fill="#000"
    />
  </svg>
)

export default SvgFrame
