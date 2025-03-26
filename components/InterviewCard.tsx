import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image';
import { getRandomInterviewCover } from '@/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

const InterviewCard = async ({id,userId,role,type,techstack,createdAt}:InterviewCardProps) => {
    const feedback = userId && id ? await getFeedbackByInterviewId({interviewId:id,userId:""}) : null;
    
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type; 
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("DD MMM YYYY");
  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
        <div className="card-interview">
            <div>
                   <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                     <p className='badge-text'>{normalizedType}</p>
                   </div>

                   <Image src={getRandomInterviewCover()} alt='cover image' width={90} height={90} className='rounded-full object-fit size-[70px]'/>

                   <h3 className='mt-5 capitalize text-lg'>{role} interview</h3>

                   <div className='flex flex-row gap-5 mt-3'>
                       <div className="flex flex-row gap-2">
                          <Image src='/calendar.svg' alt='calendar' width={22} height={22}/>

                          <p className='text-sm'>{formattedDate}</p>
                       </div>

                       <div className='flex flex-row gap-2'>
                        <Image src="/star.svg" alt="star" width={20} height={20}/>
                        <p className="text-sm">{feedback?.totalScore || "---"} / 100</p>
                       </div>
                   </div>


                   <p className='line-clamp-2 mt-5 text-[15px]'>
                      {feedback?.finalAssessment || "You haven't taken this interview yet. Take it now to improve your skills"}
                   </p>
            </div>

            <div className="flex flex-row justify-between">
                
                <DisplayTechIcons techstack={techstack}/>

                <Button className='btn-primary' asChild>
                    <Link href={feedback ? 
                        `/interview/${id}/feedback` 
                        : `/interview/${id}`
                    }>
                       {feedback ? "Check feedback" : "Take Interview"}
                    </Link>
                </Button>
            </div>
        </div>
    </div>
  )
}

export default InterviewCard