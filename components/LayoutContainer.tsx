import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function LayoutContainer({ children }: Props) {
  return <div className="max-w-full px-4 sm:px-6">{children}</div>
}
