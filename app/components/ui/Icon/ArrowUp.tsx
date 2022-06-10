import type { SVGProps } from 'react'
import * as React from 'react'

const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.428 14.286 12 9.714l4.571 4.572" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgArrowUp
