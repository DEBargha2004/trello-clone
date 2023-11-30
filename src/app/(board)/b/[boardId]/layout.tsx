import BoardSidebar from '@/components/custom/board-sidebar'
import BoardProvider from '@/provider/board-provider'

export default async function BoardLayout ({
  children,
  params
}: {
  children: React.ReactNode
  params: { boardId: string }
}) {
  return (
    <BoardProvider>
      <section className='h-full flex justify-between items-start relative'>
        <div className='w-1/4 h-full bg-[#000000af]'>
          <BoardSidebar active_board_id={params.boardId} />
        </div>
        <div className='w-3/4 h-full'>{children}</div>
      </section>
    </BoardProvider>
  )
}
