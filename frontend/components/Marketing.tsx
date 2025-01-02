import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Card from './Card'

function Marketing() {
  return (
        <div>
        <div className='flex justify-center align-middle w-[100%]'>
            <div className='flex flex-col w-[78.125vw]'>
            <div className='flex justify-center'>
            <div className='font-polyamine text-7xl w-[60vw] text-center my-4'>EMPOWER YOUR HEALTHCARE JOURNEY WITH HIVECARE</div>
                </div>
                
                <div className='text-hivegreen font-poppins text-xl text-center'>Connecting patients, providers and care like never before</div>
                <div className='flex justify-center'>
                    <div className='bg-hivegreen text-hivewhite rounded-xl py1 px-3 my-3 h-7 flex justify-center align-middle' ><Link href='#'>Try it Now&#8599;</Link></div>
                </div>
                <div className='h-[100vh] bg-hiveoffwhite rounded-lg my-[192px]'>    </div>
            </div>

           
        </div>
         <div className='bg-hivegreen w-[100%] h-[720px] bg-cover bg-center bg-no-repeat bg-background-texture flex flex-col justify-center align-middle'>
         <div className='flex flex-col'>
             <div className='font-polyamine text-5xl text-center text-hivegoldenyellow'>Revolutionizing Healthcare Management</div>
             <div className='font-poppins text-xl text-center text-hiveoffwhite my-4 px-7'>HiveCare is an all-in-one platform designed to streamline patient care and hospital management. From finding nearby hospitals to accessing health records, HiveCare connects you with the healthcare ecosystem effortlessly.</div>
         </div>
        </div>
         <div className='bg-hivewhite w-[100%] h-[756px]'>
            <div className='h-[100%] w-[100%] flex flex-col justify-center'>
                <div className='text-black text-5xl font-polyamine text-center my-[54px]'>How We Simplify Healthcare for You</div>
                <div className='flex justify-center'>
                    <div className="flex justify-between  w-[90%]"> 
                        <Card image_path={"Hospital.svg"} heading={"Find Care Near You, Fast."} content={"Find and access nearby hospitals with real-time data and detailed information"}></Card>
                        <Card image_path={"Vault.svg"} heading={"Your Health Data, Safely Stored."} content={"Easily store, update, and manage your health details securely over time."}></Card>
                        <Card image_path={"Database.svg"} heading={"Your Records, Anytime, Anywhere."} content={"View and manage your medical history, prescriptions, and lab results from multiple providers."}></Card>
                        <Card image_path={"CalendarDots.svg"} heading={"Simplify Your Appointments."} content={"Book, reschedule, or cancel appointments with healthcare providers effortlessly."}></Card>
                    </div>
                </div>
            </div>
            
        </div>
         <div className='bg-hivewhite w-[100%] h-[756px] flex flex-col'>
            <div className="flex justify-center mt-[7.5%]">
                <div className='text-hivegreen text-6xl text-center font-polyamine'>Your Data, Protected Always.</div>
            </div>
            <div className="flex justify-center ">
                <div className='w-[76.5%] h-[594px] my-[10%]'>
                    <div className='text-center font-poppins text-xl mb-5 '>
                        At HiveCare, your healthcare data's security and privacy are our top priorities. We collect only essential information, such as personal details, health records, and location data, to provide and enhance services like health record management, appointment scheduling, and nearby hospital locators. Your data is never sold and is shared only with trusted providers or services, strictly with your consent.
                        </div>
<div className='text-center font-poppins text-xl mt-5 '>

Our robust measures, including end-to-end encryption, multi-factor authentication, and HIPAA compliance, ensure your data remains protected. You retain full control to access, update, or delete your records at any time. For questions or concerns, contact us at <span className='text-hivegreen'>privacy@hivecare.com.</span> Your trust is the foundation of everything we do.</div>
</div>
            </div>
            
        </div>

     </div>
  )
}

export default Marketing
