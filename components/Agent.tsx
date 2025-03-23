
'use client'
import { cn } from '@/utils';
import Image from 'next/image'
import React, { useState } from 'react'

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}



const Agent: React.FC<AgentProps> = ({ userName }) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.FINISHED);
    const isSpeaking = true;

    const messages = [
        "Whats your name?",
        "My name is Iris , nice to meet you"
    ]

    const lastMessage = messages[messages.length -1]

    return (
        <>
            <div className='call-view'>
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" alt='vapi' width={65} height={65}
                            className='object-cover'
                        />
                        {isSpeaking && <span className='animate-speak' />}
                    </div>

                    <h3 className="text-base font-medium">
                        AI Interviewer
                    </h3>
                </div>

                <div className="card-border">
                    <div className='card-content'>
                        <Image src="/user-avatar.png" alt='avatar' width={400} height={400} className='size-24 rounded-full object-cover' />

                        <h3 className="text-base font-medium">
                            {userName}
                        </h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100','text-[15px]')} key={lastMessage}>{lastMessage}</p>
                    </div>
                </div>
            )}


            <div className='w-full flex justify-center'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button
                    className='relative btn-call'
                    onClick={() => setCallStatus(CallStatus.ACTIVE)}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75',
                            callStatus === CallStatus.CONNECTING && 'hidden' 
                        )}/>
                        <span>
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Call" : "..."}
                        </span>
                    </button>
                ) : (
                    <button className='btn-disconnect' onClick={() => setCallStatus(CallStatus.FINISHED)}>
                        <span>End Call</span>
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent;
