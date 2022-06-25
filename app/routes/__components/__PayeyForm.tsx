import type { DataFunctionArgs } from '@remix-run/node'

export const loader = (args: DataFunctionArgs) => {
  console.log('__PayeyForm.tsx', 'args', args)
  return null
}

export default function PayerForm() {
  return <div>PayerForm</div>
}
