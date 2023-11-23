'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import AppLogo from './app-logo'
import { Separator } from '@radix-ui/react-separator'

function Navbar () {
  const { isSignedIn } = useUser()

  return isSignedIn ? (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex justify-between items-center gap-2'>
          <AppLogo />
        </div>
        <div className='flex justify-between items-start gap-2'>
          <UserButton />
        </div>
      </div>
      <Separator
        className='h-[1px] bg-slate-300 my-1'
        orientation='horizontal'
      />
    </>
  ) : null
}

export default Navbar
