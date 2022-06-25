import { useOutletContext } from 'react-router'

import type { OutletData } from './'

const result = () => {
  const data = useOutletContext<OutletData>()

  return <div></div>
}
export default result
