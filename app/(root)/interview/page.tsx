import Agent from '@/components/Agent'
import React from 'react'
import {getCurrentUser} from '../../../lib/actions/auth.action'

const Page = async () => {
  const user = await getCurrentUser();
  // console.log(user?.name);
  
  return (
    <>
    <h3 className='text-lg font-medium'>Interview Generation</h3>
        <Agent userName={user?.name || "You"} userId={user?.id} type="generate"/>
    </>
  )
}

export default Page