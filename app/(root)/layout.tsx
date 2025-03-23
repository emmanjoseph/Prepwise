import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const RootLayout = ({children}:{children : ReactNode}) => {
  return (
    <div className='root-layout'>
      <nav className='flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt="logo" width={38} height={32}/>
          <h2 className='text-primary-100'>Prepwise</h2>
        </Link>

        <div className='font-bold'>
          EM
        </div>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout