'use server'

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  
      // get user info from db
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
      // Invalid or expired session
      return null;
    }
  }

 export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    try {
        const interviewsSnapshot = await db
            .collection("interviews")
            .where("userid",'==', userId)
            .orderBy("createdAt", "desc")
            .get();

        // console.log(`Fetched ${interviewsSnapshot.docs.length} interviews for userId: ${userId}`);

        if (interviewsSnapshot.empty) {
            console.log("No interviews found.");
            return null;
        }

        return interviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Interview[];
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return null;
    }
}

  // Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
  }



  export async function getLatestInterviews(params:GetLatestInterviewsParams):Promise<Interview[] | null> {

    const {userId,limit = 20} = params;


    const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized" , '==' , true)
    .where("userid" , '!=' , userId)
    .limit(limit)
    .get();

    return interviews.docs.map((doc)=>(
        {
            id:doc.id,
            ...doc.data()
        }
    )) as Interview[];
  }

  export async function Logout() {
    const cookieStore = await cookies();

    try {
        cookieStore.set("session","", {
            maxAge:0,
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            path:"/",
            sameSite:"lax"
        });

        redirect("/sign-in")
        return {
            success:true,
            message:"Logged out successfully"
        }
    } catch (error) {
        console.log("Error logging out", error);
        
         return {
            success: false,
            message: "Failed to log out"
        };
    }
  }
