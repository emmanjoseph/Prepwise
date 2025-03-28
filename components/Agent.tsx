'use client'
import { cn } from '@/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}

interface SavedMessage{
    role:"user" | "agent" ,
    content:string
}

const Agent: React.FC<AgentProps> = ({ userName ,userId,type,interviewId,questions}) => {
    const router = useRouter();

    const [isSpeaking, setIsSpeaking] = useState(false)
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE); 
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED); 
    
        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage: SavedMessage = {
                    role: message.role as "user" | "agent", // ✅ Explicitly cast to the correct type
                    content: message.transcript
                };
        
                setMessages((prev) => [...prev, newMessage]); // ✅ Now the types match correctly
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error:Error) => console.log("error",error);

        vapi.on("call-start",onCallStart);
        vapi.on("call-end",onCallEnd);
        vapi.on("message",onMessage);
        vapi.on("speech-start",onSpeechStart);
        vapi.on("speech-end",onSpeechEnd);
        vapi.on("error",onError);
        

        return () => {
            vapi.off("call-start",onCallStart);
            vapi.off("call-end",onCallEnd);
            vapi.off("message",onMessage);
            vapi.off("speech-start",onSpeechStart);
            vapi.off("speech-end",onSpeechEnd);
            vapi.off("error",onError);
        }
    }, []); // ✅ Runs only once on mount

    const handleGenerateFeedback = async (messages:SavedMessage[]) => {
        console.log("generate feedback here");

        const {success,feedbackId:id} = await createFeedback({
            interviewId:interviewId!,
            userId:userId!,
            transcript:messages
        })


        if (success && id) {
            router.push(`/interview/${interviewId}/feedback`)
        }else{
            console.log('Error saving feedback');
            router.push('/')
        }
        
    }


    useEffect(()=>{

        if(callStatus === CallStatus.FINISHED){
            if(type === 'generate'){
                router.push('/')
            }else{
                handleGenerateFeedback(messages)
            }
        }

        
    },[messages,callStatus,type,userId]);

    const handleCall = async () =>{
        setCallStatus(CallStatus.CONNECTING);

        if (type === 'generate') {
           await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID! , {
            variableValues:{
                username:userName,
                userid:userId,
            }
        }) 
        } else {
            let formattedQuestions = "";

            if(questions){
                formattedQuestions = questions
                .map((question)=> `-${question}`)
                .join("\n");
            }

            await vapi.start( interviewer, {
                variableValues: {
                    questions:formattedQuestions,

                }
            })
        }

        
    }

    const handleDisconnect = async () =>{
        setCallStatus(CallStatus.FINISHED)
        vapi.stop();
    }

    const latestMessage = messages[messages.length -1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


    return (
        <>
            <div className='call-view'>
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" alt='vapi' width={45} height={45}
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
                        <Image src="/man.png" alt='avatar' width={400} height={400} className='size-24 rounded-full object-cover' />

                        <h3 className="text-base font-medium">
                            {userName}
                        </h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p className={cn('transition-opacity duration-300 opacity-0', 'animate-fadeIn opacity-100','text-[15px]')} key={latestMessage}>{latestMessage}</p>
                    </div>
                </div>
            )}


            <div className='w-full flex justify-center'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button
                    className='relative btn-call'
                    onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75',
                            callStatus === CallStatus.CONNECTING && 'hidden' 
                        )}/>
                        <span className='text-sm'>
                            {isCallInactiveOrFinished ? "Call" : "On call ..."}
                        </span>
                    </button>
                ) : (
                    <button className='btn-disconnect' onClick={handleDisconnect}>
                        <span>End Call</span>
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent;
