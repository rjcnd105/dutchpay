import * as React from 'react'
import { SVGProps } from 'react'

const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg width={21} height={21} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.5 10.5h10M10.5 5.5v10" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgPlus
