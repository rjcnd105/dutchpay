import * as React from 'react'
import { SVGProps } from 'react'

const SvgExternal = (props: SVGProps<SVGSVGElement>) => (
  <svg width={21} height={21} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m14.5 7.5-3.978-4-4.022 4M10.522 3.521V15.5M7.5 10.5h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgExternal
