import { getTechLogos } from '@/utils'
import Image from 'next/image'
import React from 'react'

const DisplayTechIcons = async ({techstack}:TechIconProps) => {
    const techIcons = await getTechLogos(techstack)
  return (
    <div className='flex'>{techIcons.slice(0,4).map(({tech,url} , index)=> (
       <div key={index} className={`relative group bg-dark-300 rounded-full p-2 flex-center w-10 h-10 ${index >= 1 && '-ml-3'}`}>
            <span className='tech-tooltip '>
                {tech}
            </span>

            <Image src={url} alt='tech' width={100} height={100}
            className='size-5'
            />
        </div>
    ))}</div>
  )
}

export default DisplayTechIcons