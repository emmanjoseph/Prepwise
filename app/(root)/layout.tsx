
import Navbar from '@/components/Navbar'
import React, { ReactNode } from 'react'

const RootLayout = ({children}:{children : ReactNode}) => {
  return (
    <div className='root-layout'>
     <Navbar/>
      {children}
    </div>
  )
}

export default RootLayout