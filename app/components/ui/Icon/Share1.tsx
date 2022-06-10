import type { SVGProps } from 'react'
import * as React from 'react'

const SvgShare1 = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={18.286} cy={5.714} r={2.786} stroke="#000" />
    <circle cx={5.714} cy={12.571} r={2.786} stroke="#000" />
    <circle cx={18.286} cy={18.286} r={2.786} stroke="#000" />
    <path
      d="m15.429 6.857-6.858 4M8.571 14.286l6.858 2.857"
      stroke="#000"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgShare1
