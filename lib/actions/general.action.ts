'use server'

import { db } from "@/firebase/admin";

 export async function getInterviewById(id: string): Promise<Interview | null> {
    try {
        const interview = await db
        .collection("interviews")
        .doc(id)
        .get();

        return interview.data() as Interview | null ;

    } catch (error) {
        console.error("Error fetching interviews:", error);
        return null;
    }
}