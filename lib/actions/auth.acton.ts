'use server'

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signUp(params:SignUpParams) {
    const {uid,name,email} = params;

   

    try {
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists) {
            return {
                success:false,
                message:"User already exists. Please sign in instead"
            }
        }

        await db.collection("users").doc(uid).set({
            name,
            email,
        });

        return {
            success:true,
            message:"Account created successfully"
        }

    } catch (error:any) {
        console.log(`Error creating a user`,error);

        if (error.code === "auth/email-already-exists") {
            return {
                success:false,
                message:"This email already exists"
            }
        }

        return {
            success:false,
            message:"Failed to create an account"
        }
        
    }
}

export async function setSessionCookie(idToken:string) {

     const ONE_WEEK = 60 * 60 * 24 * 7 ;
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken , {
        expiresIn:60 * 60 * 24 * 7 * 1000
    });

    cookieStore.set("session" , sessionCookie , {
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        path:"/",
        sameSite:"lax"
    })
}

export async function signIn(params:SignInParams) {
    const {email,idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success:false,
                message:"User does not exist please create an account"
            }
        }

        await setSessionCookie(idToken)
    } catch (error) {
        console.log(error);

        return {
            success:false,
            message:"Failed to log in"
        }
        
    }
}