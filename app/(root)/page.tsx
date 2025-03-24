import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser, getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Home = async () => {
   const user = await getCurrentUser();
   if (!user) {
      return <p className="text-center">Please log in to see your interviews.</p>;
   }

   const [userInterviews, latestInterviews] = await Promise.all([
      getInterviewsByUserId(user.id),
      getLatestInterviews({ userId: user.id })
   ]);

   const hasPastInterviews = userInterviews?.length > 0;
   const hasUpcomingInterviews = latestInterviews?.length > 0;

   return (
      <>
         <section className='card-cta'>
            <div className="flex flex-col gap-6 max-w-lg">
               <h2>Get interview ready with AI-powered practice & feedback</h2>
               <p className="text-lg">Practice real interview questions and get instant feedback</p>

               <Button asChild className='btn-primary max-sm:w-full'>
                  <Link href="/interview">Start an Interview</Link>
               </Button>
            </div>

            <Image src='/robot.png' alt="robot" className='max-sm:hidden' width={400} height={400} />
         </section>

         {/* Your Interviews Section */}
         <section className="flex flex-col gap-6 mt-8">
            <h2 className='text-xl'>Your Interviews</h2>

            <div className="interviews-section">
               {hasPastInterviews ? (
                  userInterviews.map((interview) => (
                     <InterviewCard key={interview.id} {...interview} />
                  ))
               ) : (
                  <div className="flex items-center justify-center w-full py-14">
                     <p className='font-medium text-light-100'>You haven&apos;t completed any interviews yet</p>
                  </div>
               )}
            </div>
         </section>

         {/* Take an Interview Section */}
         <section className="flex flex-col gap-6 mt-8">
            <h2 className='text-lg'>Take an interview</h2>

            <div className="interviews-section">
               {hasUpcomingInterviews ? (
                  latestInterviews.map((interview) => (
                     <InterviewCard key={interview.id} {...interview} />
                  ))
               ) : (
                  <div className="flex items-center justify-center w-full py-14">
                     <p className='font-medium text-light-100'>No upcoming interviews available</p>
                  </div>
               )}
            </div>
         </section>
      </>
   );
};

export default Home;
