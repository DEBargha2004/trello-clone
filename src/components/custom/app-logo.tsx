import { Trello } from 'lucide-react'

function AppLogo () {
  return (
    <div className='flex justify-between items-center gap-1'>
      <Trello />
      <p className='font-semibold'>RemindMe</p>
    </div>
  )
}

export default AppLogo
