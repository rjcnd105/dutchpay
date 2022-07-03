import { useOutletContext } from 'react-router'

import type { OutletContextData } from '~/routes/$roomId'

const result = () => {
  const data = useOutletContext<OutletContextData>()

  console.log('result.tsx', 'data', data)

  return (
    <>
      <div>zzz</div>
    </>
  )
}
export default result
