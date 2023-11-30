function List ({
  children,
  title,
  addCard,
  listId
}: {
  children: React.ReactNode
  title: string
  addCard: (listId: string) => React.JSX.Element
  listId: string
}) {
  return (
    <div className='bg-[#0000009c] rounded-xl p-3'>
      <h1 className='font-semibold text-primary-foreground pl-2'>{title}</h1>
      <div>{children}</div>
      <div>{addCard(listId)}</div>
    </div>
  )
}

export default List
