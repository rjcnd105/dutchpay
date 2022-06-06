import * as React from 'react'
import { SVGProps } from 'react'

const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13.143 16.571 8.572 12l4.571-4.571" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgArrowLeft
