import * as React from 'react'
import { SVGProps } from 'react'

const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M5.25 3.985h13.5A2.25 2.25 0 0 1 21 6.235v13.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 19.735v-13.5a2.25 2.25 0 0 1 2.25-2.25Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3 8.485h18" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M6 3.714V3a1 1 0 0 1 1-1v0a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.2M16 3.714V3a1 1 0 0 1 1-1v0a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.2"
      stroke="#000"
      strokeLinecap="round"
    />
    <circle cx={6.586} cy={16.431} r={0.984} fill="#1C1C1C" />
    <circle cx={6.586} cy={12.001} r={0.984} fill="#1C1C1C" />
    <circle cx={11.016} cy={12.001} r={0.984} fill="#1C1C1C" />
  </svg>
)

export default SvgCalendar
