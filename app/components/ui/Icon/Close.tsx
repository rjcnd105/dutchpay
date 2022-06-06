import * as React from 'react'
import { SVGProps } from 'react'

const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m8.572 8.571 6.857 6.858M15.429 8.571 8.572 15.43"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgClose
