import { generateText} from 'ai'

export async function GET() {
    return Response.json({
        succes:true,
        data:"Thankyou"
    }, {status:200});
}

export async function POST(request:Request) {
    const {type,role,level,techstack,amount,userid} = await request.json();

    try {
        const {text} = await generateText({
            model:"gemini-2.0-flash-001",
            prompt:"Prepare questions for a job interview"
        })
    } catch (error) {
        console.log(error);
        
        return Response.json({
            success:false,
            error
        },{status:500})
    }
}