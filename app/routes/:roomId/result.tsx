import { useOutletContext } from 'react-router'

import type { OutletData } from '../:roomId'

const result = () => {
  const data = useOutletContext<OutletData>()
  console.log('result.tsx', 'data', data)

  return <div></div>
}
export default result
