interface SignInCardProps {
    setState: (state:SignInFlow)=>void
}
import React, { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'
import { SignInFlow } from '@/types/SignInFlow'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Spinner } from "@/components/ui/spinner"

const SignInCard:React.FC<SignInCardProps> = ({setState}) => {
  const [loading,setLoading] = useState(false)
  const router = useRouter()
    const formik = useFormik({
            initialValues:{
                email:"",
                password:"",
            },
             validationSchema: Yup.object({
                            email:Yup.string().required("Email is required"),
                            password:Yup.string().required("Password is required"),
                    }),
            onSubmit:async(values)=>{
                console.log(values);
                setLoading(true)
               try {
                const res = await signIn('credentials',{
                    redirect:false,
                    email:values.email,
                    password:values.password,
                });
                if(res?.error){
                  toast.error(res?.error)
                  setLoading(false)
                  return
                }else
                    toast.success("Logged in Successfully")
                    router.push('/')
               } catch (error) {
                toast.error("Something Wrong,Please try again!")
               }finally{
                setLoading(false)
               }
            }
        })
  return (
   <Card className='w-full h-full p-8'>
  <CardHeader className='pt-0 px-0'>
    <CardTitle>
    Login to continue
    </CardTitle>
<CardDescription>
    Use your email or other service to continue
</CardDescription>
  </CardHeader>
<CardContent className='space-y-5 px-0 pb-0'>
<form onSubmit={formik.handleSubmit} className='space-y-2.5'>
    <div>
    <Input name='email' disabled={false} value={formik.values.email} onChange={formik.handleChange} required type='email' placeholder='Email'/>
     {formik.touched.email && formik.errors.email ? (
        <p className='text-xs text-red-500 mt-1'>{formik.errors.email}</p>
      ) : null}
    </div>
    <div>
    <Input name="password" disabled={false} value={formik.values.password} onChange={formik.handleChange} required type='password' placeholder='Password'/>
    {formik.touched.password && formik.errors.password ? (
        <p className='text-xs text-red-500 mt-1'>{formik.errors.password}</p>
      ) : null}
    </div>
    <Button className='w-full' size={'lg'} type='submit' disabled={false}>
        {loading ?"Logging In...":"Sign In" }
    </Button>
</form>
<Separator/>
<div className='flex flex-col gap-y-2.5'>
<Button className='w-full relative' size={'lg'} variant='outline' type='button' disabled={false} onClick={()=>{}}>
    <FcGoogle className='size-5 absolute top-2.5 left-2.5'/>
Continue with Google
</Button>
<Button className='w-full relative' size={'lg'} variant='outline' type='button' disabled={false} onClick={()=>{}}>
    <BsGithub className='size-5 absolute top-2.5 left-2.5'/>
Continue with Github
</Button>
</div>
<p className='text-xs text-muted-foreground'>Don't have an Account.
    {"  "}
     <span onClick={()=>setState('signUp')} className='text-sky-700 hover:underline cursor-pointer'>Sign Up</span>
</p>
</CardContent>
<Spinner loading={loading}  />
</Card>
  )
}

export default SignInCard