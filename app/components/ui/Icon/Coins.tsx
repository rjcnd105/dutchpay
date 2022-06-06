import * as React from 'react'
import { SVGProps } from 'react'

const SvgCoins = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M21.143 13.143v3.428c0 1.486-3.582 3.429-8 3.429s-8-1.943-8-3.428v-2.858"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.479 14.01c.988 1.312 4.045 2.543 7.664 2.543 4.418 0 8-1.835 8-3.413 0-.885-1.128-1.856-2.899-2.537"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.714 7.429v3.428c0 1.485-3.581 3.429-8 3.429-4.418 0-8-1.944-8-3.429V7.43"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      clipRule="evenodd"
      d="M9.714 10.838c4.418 0 8-1.834 8-3.412 0-1.578-3.581-3.426-8-3.426-4.418 0-8 1.848-8 3.426s3.582 3.412 8 3.412Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgCoins
