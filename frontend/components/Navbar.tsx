
import Link from "next/link"
export default function Navbar() {
  return (
    <div className="flex justify-between h-[10vh] items-center w-[100%]">
        <div className="flex justify-around">
            <div className="text-2xl font-polyamine mx-[4vw]">HIVECARE</div>
        </div>
        <div className="flex justify-around w-[40vw]">
            <Link href="#" className="font-poppins">About</Link>
            <Link href="#" className="font-poppins">Features</Link>
            <Link href="#" className="font-poppins">Testimonials</Link>
            <Link href="#" className="font-poppins">Security & Privacy</Link>
        </div>
        <div className="flex justify-around w-[10vw] font-poppins">
            <div >Sign Up</div>
            <div className="text-white bg-hivegreen rounded-xl px-4 font-poppins"><Link href="/login">Login</Link></div>
        </div>
      
    </div>
  )
}

