import React from 'react'
import Link from 'next/link'

function Marketing() {
  return (
        <div className='flex justify-center align-middle'>
            <div className='flex flex-col w-[78.125vw]'>
            <div className='flex justify-center'>
            <div className='font-polyamine text-7xl w-[60vw] text-center my-4'>EMPOWER YOUR HEALTHCARE JOURNEY WITH HIVECARE</div>
                </div>
                
                <div className='text-hivegreen font-poppins text-xl text-center'>Connecting patients, providers and care like never before</div>
                <div className='flex justify-center'>
                    <div className='bg-hivegreen text-hivewhite rounded-xl py1 px-3 my-3 h-7 flex justify-center align-middle' ><Link href='#'>Try it Now&#8599;</Link></div>
                </div>
                <div className='h-[100vh] bg-hiveoffwhite rounded-lg'>    </div>
            </div>
        </div>
  )
}

export default Marketing
