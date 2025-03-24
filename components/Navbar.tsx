import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth.action';


const Navbar = async () => {
      const user = await getCurrentUser();
    
  return (
    <nav className='flex items-center justify-between'>
    <Link href='/' className='flex items-center gap-2'>
      <Image src='/logo.svg' alt="logo" width={38} height={32}/>
      <h2 className='text-primary-100 text-xl font-bold'>Prepwise</h2>
    </Link>

    <div className='font-bold'>
      {user?.name}
    </div>
  </nav>
  )
}

export default Navbar