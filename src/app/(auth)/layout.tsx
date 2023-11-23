export default function AuthLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <section className='h-full flex justify-center items-center'>
      {children}
    </section>
  )
}
