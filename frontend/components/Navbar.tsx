import Link from "next/link"
import Image from "next/image"
export default function Navbar() {
  return (
    <div className="flex justify-between h-[10vh] items-center w-[100%]">
      <div className="flex justify-around">
        <div className="text-2xl font-polyamine mx-[2vw]">
          <div className="flex">
            <Image src={"Group 1.svg"} alt={"Company logo"} height={40} width={40} /> <div className="text-center m-auto">HIVECARE</div>
          </div>
        </div>
      </div>
      <div className="flex justify-around w-[40vw]">
        <Link href="#" className="font-poppins">
          About
        </Link>
        <Link href="#" className="font-poppins">
          Features
        </Link>
        <Link href="#" className="font-poppins">
          Testimonials
        </Link>
        <Link href="#" className="font-poppins">
          Security & Privacy
        </Link>
      </div>
      <div className="flex justify-around w-[10vw] font-poppins">
        <div>
          <Link href="/signup">Sign Up</Link>
        </div>
        <div className="text-white bg-hivegreen rounded-xl px-4 font-poppins">
          <Link href="/login">Login</Link>
        </div>
        {/* <div className="text-white bg-hivegreen rounded-xl px-4 font-poppins"><Link href="/login">Login</Link></div> */}
      </div>
    </div>
  )
}
