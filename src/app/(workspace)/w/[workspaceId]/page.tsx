import React from 'react'

function page ({ params }: { params: { workspaceId: string } }) {
  return <div>{params.workspaceId}</div>
}

export default page
