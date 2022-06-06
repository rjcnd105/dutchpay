import * as React from 'react'
import { SVGProps } from 'react'

const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16.571 9.714 12 14.286 7.428 9.714" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgArrowDown
