'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
// import { CircleX } from "lucide-react";
import { AnimatePresence } from "framer-motion";
// import toast, { Toaster } from 'react-hot-toast';
const Login = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  useEffect(() => {
    document.getElementById('pass').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (document.getElementById('email').value === 'admin' && document.getElementById('pass').value === 'admin') {
          router.push('/election-commission')
        }
        else {
          toast('Invalid email/password combination');
        }
      }
    })
    document.getElementById('email').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (document.getElementById('email').value === 'admin' && document.getElementById('pass').value === 'admin') {
          router.push('/election-commission')
        }
        else
          toast('Invalid email/password combination');
      }
    })
  }, [])
  return (
    <>
    <div>
      {/* <Toaster/> */}
    </div>
      <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white px-40 py-24">
        <div className="bg-white/5 p-10 mt-20 rounded-3xl min-w-[50vw] flex flex-col items-center justify-center gap-5">
          <div className="w-full">
            <p className="text-2xl pb-2">
              Email Id
            </p>
            <Input id='email' />
          </div>
          <div className="w-full">
            <p className="text-2xl pb-2">
              Password
            </p>
            <Input id='pass' type="password"/>
          </div>
          <div className="w-full flex gap-5 items-center">
            <div onClick={() => {
              if (document.getElementById('email').value === 'admin' && document.getElementById('pass').value === 'admin') {
                router.push('/election-commission')
              }
              else{
                toast('Invalid email/password combination');
              }
            }} role="button" className="px-5 py-2 rounded-xl bg-black w-fit">
              Login
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
