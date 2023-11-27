'use client'

import { useRouter } from 'next/navigation'

function CustomLink ({
  children,
  href
}: {
  children: React.ReactNode
  href: string
}) {
  const router = useRouter()
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target.id === 'star') return

    router.push(href)
  }
  return <div onClick={handleClick}>{children}</div>
}

export default CustomLink
