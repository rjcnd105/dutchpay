import type { DataFunctionArgs } from '@remix-run/node'
import { useParams } from 'react-router'

export function loader({ request }: DataFunctionArgs) {
  return null
}

export default function RoomBy() {
  const d = useParams()

  return <div>{d.roomId}</div>
}
