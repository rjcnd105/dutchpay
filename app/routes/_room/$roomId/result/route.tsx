import { useOutletContext } from 'react-router';
import type { RoomOutletContextData } from '~/routes/_room/_index';

const route = () => {
  const data = useOutletContext<RoomOutletContextData>();

  console.log('result.tsx', 'data', data);

  return (
    <>
      <div>zzz</div>
    </>
  );
};
export default route;
