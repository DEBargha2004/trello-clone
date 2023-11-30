import React from 'react'

function ErrorMessage ({ children }: { children: React.ReactNode }) {
  return <p className='text-sm font-medium my-1 text-red-500'>{children}</p>
}

export default ErrorMessage
