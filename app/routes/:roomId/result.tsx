import { useOutletContext } from 'react-router'

import type { OutletData } from '../:roomId'

const result = () => {
  const data = useOutletContext<OutletData>()

  return <div></div>
}
export default result
