import Vapi from '@vapi-ai/web';

// console.log("process.env.NEXT_PUBLIC_VAPI_API_KEY",process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!)