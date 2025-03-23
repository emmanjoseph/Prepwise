import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { doneInterviews, dummyInterviews } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <>
       <section className='card-cta'>
        <div className="flex flex-col gap-6 max-w-lg">
        <h2>Get interview ready AI-Powered practice & feedback</h2>
        <p className="text-lg">Practice on real interview questions and get instant feed</p>

        <Button asChild className='btn-primary max-sm:w-full'>
           <Link href="/interview">
              Start an Interview
           </Link>
        </Button>
        </div>

        <Image src='/robot.png' alt="robot"
        className='max-sm:hidden'
        width={400} height={400}/>
       </section>

       <section className="flex flex-col gap-6 mt-8">
          <h2 className='text-xl'>Your Interviews</h2>

          <div className="interviews-section">
            {/* <p>You haven&apos;t taken any interviews yet</p> */}
             {doneInterviews.map((interview)=>(
              <InterviewCard key={interview.id} {...interview}/>
          ))}
          </div>
          
       </section>

       <section className="flex flex-col gap-6 mt-8">
         <h2 className='text-lg'>Take an interview</h2>

         <div className="interviews-section">
          {dummyInterviews.map((interview)=>(
              <InterviewCard key={interview.id} {...interview}/>
          ))}
         </div>
       </section>
    </>
  )
}

export default Home