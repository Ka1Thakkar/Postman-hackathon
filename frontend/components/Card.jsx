import React from "react"
import Image from "next/image"

function Card({ image_path, heading, content }) {
  return (
    <div className="w-[400px] h-[400px] bg-hiveoffwhite mx-2 rounded-xl flex flex-col justify-center">
      <div className="flex justify-center">
        <div>
          <Image src={image_path} width={100} height={100} alt={image_path} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-center text-hivegreen text-xl font-poppins my-5">{heading}</div>
      </div>
      <div className="flex justify-center">
        <div className="text-center text-[20px] w-[86.5%] h-[90px] font-poppins mt-3">{content}</div>
      </div>
    </div>
  )
}

export default Card
