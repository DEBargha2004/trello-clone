import BoardSidebar from '@/components/custom/board-sidebar'

export default async function BoardLayout ({
  children,
  params
}: {
  children: React.ReactNode
  params: { boardId: string }
}) {
  return (
    <section className='h-full flex justify-between items-start'>
      <div className='w-1/4 h-full'>
        <BoardSidebar active_board_id={params.boardId} />
      </div>
      <div className='w-3/4 h-full'>{children}</div>
    </section>
  )
}
