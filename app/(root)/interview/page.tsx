import Agent from '@/components/Agent'
import React from 'react'

const Page = () => {
  return (
    <>
    <h3 className='text-lg font-medium'>Interview Generation</h3>
        <Agent userName="You" userId="user1" type="generate"/>
    </>
  )
}

export default Page