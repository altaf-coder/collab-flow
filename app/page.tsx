import AuthScreen from '@/components/ui/auth/auth-screen'
import { ModeToggle } from '@/components/mode-toggle'
import React from 'react'

const page = () => {
  return (
    <div className='h-full min-h-screen bg-background relative flex items-center justify-center overflow-hidden font-sans selection:bg-orange-500 selection:text-white'>
       {/* Background Effects */}
       <div className="absolute inset-0 -z-10 h-full w-full bg-[#020617] 
         [background-image:linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] 
         [background-size:40px_40px] opacity-20">
       </div>
       
       {/* Bold Gradients */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[10%] left-[10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-3000"></div>
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-75"></div>
          <div className="absolute -bottom-[10%] left-[30%] w-[600px] h-[600px] bg-orange-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-150"></div>
       </div>

       <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      
      <div className="z-10 w-full max-w-md px-4">
        <AuthScreen/>
      </div>
    </div>
  )
}

export default page