
import Link from "next/link"
export default function Navbar() {
  return (
    <div className="flex justify-between h-[10vh] items-center bg-[]">
        <div className="flex justify-around">
            <div className="text-2xl">HIVECARE</div>
        </div>
        <div className="flex justify-around w-[40vw]">
            <Link href="#">About</Link>
            <Link href="#">Features</Link>
            <Link href="#">Testimonials</Link>
            <Link href="#">Security & Privacy</Link>
        </div>
        <div className="flex justify-around w-[10vw]">
            <div >Sign Up</div>
            <div className="text-white bg-[#0AB568] rounded-xl px-4">Login</div>
        </div>
      
    </div>
  )
}

