"use client"
 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {Form,} from "@/components/ui/form"

import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.acton"
import { useState } from "react"
 
const authFormSchema =(type:FormType)=>{
    return z.object({
        name:type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email:z.string().email(),
        password:z.string().min(3),

    })
}

const AuthForm = ({type}:{type:FormType}) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const formSchema = authFormSchema(type);

     // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email:"",
      password:""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
   try {
    if (type === 'sign-up') {
        setIsLoading(true)
        const {name,email,password} = values;

        const userCredentials = await createUserWithEmailAndPassword(auth,email,password);

        const result = await signUp({
            uid:userCredentials.user.uid,
            name:name!,
            email,
            password
        });

        if (!result?.success) {
            toast.error(result?.message);
            return;
        }

        toast.success("Account created successfully");
        router.push('/sign-in')
        console.log("Signing up", values);
        
    } else{
        setIsLoading(true)
        const {email,password} = values;

        const userCredential = await signInWithEmailAndPassword(auth,email,password);

        const idToken = await userCredential.user.getIdToken();
         
        if (!idToken) {
            toast.error('Failed to sign in');
            return;
        }

        await signIn({
            email,
            idToken
        })
        toast.success("Signed in successfully");
        console.log("Signing In", values);
        router.push('/')

    }
   } catch (error) {
    console.log(error);
    toast.error(`There was an error: ${error}`);
   }
  }

  const isSignIn = type === 'sign-in'

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src='/logo.svg' alt="logo" height={32} width={38}/>
                <h2 className="text-primary-100">Prepwise</h2>
            </div>
            <h1 className="text-center">Practice job interview with AI</h1>

                <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 mt-4 form">
        {!isSignIn && (
            <FormField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Your Username"
            type="text"
            />
        )}

         <FormField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="Your Email address"
            type="email"
            />

         <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Your Password"
            type="password"
            />
      
        <Button type="submit"
        className="btn"
        >
            {isSignIn ? "Sign in" : "Create an Account"}
            {isLoading && (
                <Image src='/loader.png' alt="spinner" width={15} height={15}
                className="animate-spin"
                />
            )}

            </Button>
      </form>
    </Form>

    <p className="text-center">
        {isSignIn ? "Don't have an account?" : "Already have an account?" }
        <Link href={isSignIn ? '/sign-up' : '/sign-in' }
        className="font-bold text-user-primary ml-1"
        > 
        {isSignIn ? 'Sign up' : 'Sign in'}
         </Link>
    </p>
        </div>

      
    </div>
  )
}

export default AuthForm