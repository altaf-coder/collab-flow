'use client'
interface SignUpCardProps {
    setState: (state:SignInFlow)=>void
}
import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'
import { SignInFlow } from '@/types/SignInFlow'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { HiChevronLeft } from "react-icons/hi2";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { MdCameraAlt, MdImage } from 'react-icons/md'
// import ProfileUpload from './ProfileUpload'
import { Spinner } from "@/components/ui/spinner"

const SignUpCard:React.FC<SignUpCardProps> = ({setState}) => {
    const [step, setStep] = useState(1);
    const [loading,setLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [uploadMode, setUploadMode] = useState<'camera' | 'upload' | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter()

  const nextStep = async () => {
    if (step === 1) {
      await formik.setTouched({
        email: true,
        password: true,
        confirmPassword: true,
      });
      await formik.validateField('email');
      await formik.validateField('password');
      await formik.validateField('confirmPassword');
      if (!formik.errors.email && !formik.errors.password && !formik.errors.confirmPassword && formik.values.email && formik.values.password && formik.values.confirmPassword) {
        setStep((s) => s + 1);
      }
    } else if (step === 2) {
      await formik.setTouched({
        fullname: true,
        username: true,
      });
      await formik.validateField('fullname');
      await formik.validateField('username');
      if (!formik.errors.fullname && !formik.errors.username && formik.values.fullname && formik.values.username) {
        setStep((s) => s + 1);
      }
    }
  };

  const prevStep = () => {
    if (step === 3) {
      stopCamera();
      setUploadMode(null);
      setAvatar(null);
    }
    setStep((s) => s - 1);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        
        const handleLoadedMetadata = () => {
          if (video.readyState >= 2) {
            video.play().then(() => {
              setIsCameraReady(true);
            }).catch((error) => {
              console.error('Error playing video:', error);
              setIsCameraReady(true);
            });
          }
        };

        if (video.readyState >= 2) {
          handleLoadedMetadata();
        } else {
          video.onloadedmetadata = handleLoadedMetadata;
        }
      }
    } catch (error) {
      toast.error('Camera access denied. Please allow camera permission.');
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraReady(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setAvatar(dataUrl);
      stopCamera();
    }
  };

  const handleUploadChange = (base64: string) => {
    setAvatar(base64);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);
  
    const formik = useFormik({
        initialValues:{
            email:"",
            password:"",
            confirmPassword:"",
            fullname:"",
            username:""
        },
        validationSchema: Yup.object({
                email:Yup.string().email("Invalid email address").required("Email is required"),
                password:Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
                confirmPassword:Yup.string()
                .oneOf([Yup.ref('password'), ],"Passwords must match")
                .required("Confirm Password is required"),
                fullname:Yup.string().required("Full Name is required"),
                username:Yup.string().required("Username is required"),
        }),
        onSubmit:async(values)=>{
            setLoading(true);
            try {
              const submitData = {
                ...values,
                avatarUrl: avatar || null
              };
              const res =  await axios.post('/api/user/signup',submitData)
              toast.success(res.data.message);
              if(res.data.message==="User created successfully"){
                router.push('/')
              }
            } catch (error:any) {
               if (error.response && error.response.data && error.response.data.message) {
               toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
            }finally{
              setLoading(false)
            }
          }
    })

  const handleFormSubmit = () => {
    formik.handleSubmit();
  };

  return (
       <Card className="bg-white/90 dark:bg-[#020617]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-none shadow-2xl w-full h-full p-8 relative">
            {step > 1 && (
                <button
                    onClick={prevStep}
                    className="absolute right-4 top-7 flex items-center gap-1 text-sm text-blue-700 hover:underline cursor-pointer"
                >
                    <HiChevronLeft size={22} />
                    Back
                </button>
            )}
  <CardHeader className='pt-0 px-0'>
    <CardTitle className="text-2xl font-bold">
    Sign Up to continue
    </CardTitle>
<CardDescription>
    Use your email or other service to continue
</CardDescription>
  </CardHeader>
<CardContent className='space-y-5 px-0 pb-0'>
<form className='space-y-2.5' onSubmit={formik.handleSubmit}>
  {step===1&&(
    <div className='flex flex-col gap-2.5'>
<div>
<Input name='email' disabled={false} value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} required type='email' placeholder='Email'/>
{formik.touched.email && formik.errors.email ? (
        <p className='text-xs text-red-500 mt-1'>{formik.errors.email}</p>
      ) : null}
    </div>
   <div>
    <Input name='password' disabled={false} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} required type='password' placeholder='Password'/>
    {formik.touched.password && formik.errors.password ? (
        <p className='text-xs text-red-500 mt-1'>{formik.errors.password}</p>
      ) : null}
   </div>
   <div>
<Input name='confirmPassword' disabled={false} value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} required type='password' placeholder='Confirm Password'/>
{formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        <p className='text-xs text-red-500 mt-1'>{formik.errors.confirmPassword}</p>
      ) : null}
   </div>
    </div>
  )}
    
   { step === 2 && (
    <div className='flex flex-col gap-2.5'>
   <div>
<Input name='fullname' disabled={false} value={formik.values.fullname} onChange={formik.handleChange} onBlur={formik.handleBlur} required type='text' placeholder='Full Name'/>
{formik.touched.fullname && formik.errors.fullname ? (
        <p className='text-xs text-red-500 mt-1'>{formik.errors.fullname}</p>
      ) : null}
   </div>
   <div>
<Input name='username' disabled={false} value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} required type='text' placeholder='Username'/>
{formik.touched.username && formik.errors.username ? (
        <p className='text-xs text-red-500 mt-1'>{formik.errors.username}</p>
      ) : null}
   </div>
   </div>
)}
{ step === 3 && (
    <div className='flex flex-col gap-4 items-center'>
      {!uploadMode ? (
        <div className='flex flex-col gap-3 w-full'>
          <Button
            onClick={() => {
              setUploadMode('camera');
              startCamera();
            }}
            className='w-full'
            size={'lg'}
            variant='outline'
            type='button'
          >
            <MdCameraAlt size={20} className='mr-2' />
            Take Photo
          </Button>
          <Button
            onClick={() => setUploadMode('upload')}
            className='w-full'
            size={'lg'}
            variant='outline'
            type='button'
          >
            <MdImage size={20} className='mr-2' />
            Upload from Gallery
          </Button>
        </div>
      ) : uploadMode === 'camera' ? (
        <>
          {!avatar ? (
            <>
              <div className='relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden'>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className='w-full h-full object-cover'
                />
                {!isCameraReady && (
                  <div className='absolute inset-0 w-full h-full flex items-center justify-center text-white bg-black bg-opacity-50'>
                    <div className='text-center'>
                      <MdCameraAlt size={48} className='mx-auto mb-2' />
                      <p>Loading camera...</p>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={capturePhoto}
                className='w-full'
                size={'lg'}
                disabled={!isCameraReady}
                type='button'
              >
                <MdCameraAlt size={20} className='mr-2' />
                Capture
              </Button>
            </>
          ) : (
            <>
              <div className='relative w-full max-w-md aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50'>
                <img
                  src={avatar}
                  alt='Avatar preview'
                  className='w-full h-full object-cover'
                />
              </div>
              <Button
                onClick={() => {
                  setAvatar(null);
                  startCamera();
                }}
                className='w-full'
                size={'lg'}
                variant='outline'
                type='button'
              >
                Retake
              </Button>
            </>
          )}
        </>
      ) : (
        <div className='w-full'>
          {/* <ProfileUpload
            onChange={handleUploadChange}
            value={avatar || undefined}
            disabled={loading}
          /> */}
        </div>
      )}
      <Button
        onClick={handleFormSubmit}
        className='w-full'
        size={'lg'}
        disabled={loading}
        type='button'
      >
        {loading ? 'Signing Up...' : 'Continue'}
      </Button>
      <Button
        onClick={handleFormSubmit}
        className='w-full'
        size={'lg'}
        variant='ghost'
        disabled={loading}
        type='button'
      >
        Skip
      </Button>
    </div>
)}
{ step===1 && (
<Button onClick={nextStep} className='w-full' size={'lg'}  disabled={false} type='button'>
        Next
    </Button>
)}
{ step===2 && (
<Button onClick={nextStep} className='w-full' size={'lg'}  disabled={false} type='button'>
        Next
    </Button>
)}
    
</form>
{step < 3 && (
  <>
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
<p className='text-xs text-muted-foreground'>Already have an Account.
    {"  "}
     <span onClick={()=>setState('signIn')} className='text-sky-700 hover:underline cursor-pointer'>Sign In</span>
</p>
  </>
)}
      </CardContent>
      <canvas ref={canvasRef} className='hidden' />
<Spinner loading={loading}  />
</Card>
  )
}

export default SignUpCard
