import { getInterviewById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import { getRandomInterviewCover } from '@/utils';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';

const Page = async ({params}: RouteParams) => {

    const {id} = await params;
    const interview = await getInterviewById(id);

    const user = await getCurrentUser();

    if (!interview) {
        return redirect('/');
    }
  return (
    <>
    <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
            <div className="flex flex-row gap-4 items-center">
                <Image src={getRandomInterviewCover()} alt='cover image' width={40} height={40} className='rounded-full object-cover size-[40px]'/>

                <h3 className="capitalize">{interview.role}</h3>
            </div>

            {/* <DisplayTechIcons techStack={interview.techstack}/> */}
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize font-medium text-[15px]">
            {interview.type}
        </p>
    </div>
    <Agent
    userName={user?.name || ""}
    userId={user?.id}
    type="interview"
    interviewId={id}
    questions={interview.questions}
    />

    
    </>
  )
}

export default Page