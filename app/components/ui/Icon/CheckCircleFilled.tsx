import * as React from 'react'
import { SVGProps } from 'react'

const SvgCheckCircleFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#1C1C1C" />
    <path d="m6 13.1 3.4 3.4L17.9 8" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgCheckCircleFilled
