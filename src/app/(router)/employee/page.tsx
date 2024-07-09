"use client"
import { SquareUserRound } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { ListEmployee } from './_components/ListEmployee'

const page = () => {
  
const OptionEmployee = [
    {
      id: "OEP01",
      name: "Total Employee",
      quantity: 100,
      img: '/team.svg',
      color: 'from-red-300 to-pink-300',
    },
    {
      id: "OEP02",
      name: "New Employee",
      quantity: 15,
      img: '/NewEmployee.svg',
      color: 'from-green-200 to-emerald-300'
    },
    {
      id: "OEP03",
      name: "Male",
      quantity: 65,
      img: '/male.svg',
      color: 'from-blue-300 to-cyan-300'
    },
    {
      id: "OEP04",
      name: "Female",
      quantity: 20,
      img: '/female.svg',
      color: 'from-purple-300 to-fuchsia-300'
    },
]
  return (
    <div className='p-10 w-full'>
      <h2 className='text-3xl font-bold'>Employee</h2>
      <div className='flex justify-around gap-3 flex-wrap my-10'>
        {OptionEmployee.map((item) => (
          <div key={item?.id} className='flex-1 min-w-[250px] max-w-[300px] cursor-pointer '>
            <div 
              className={`flex rounded-lg gap-3 relative overflow-hidden
              items-center px-8 py-7 shadow-xl
              bg-gradient-to-r bg-neutral-900 hover:from-neutral-700 hover:to-black group hover:scale-105 active:scale-95
              transition-all `}
            >
              <Image
                src={item?.img}
                width={70}
                height={70}
                alt='icon'
                className='w-[50px] h-[50px] object-cover z-10'
              />
              <div className='text-white group-hover:text-white z-10'>
                <h2 className='font-semibold text-md'>{item?.name}</h2>
                <h2 className=''>{item?.quantity}</h2>
              </div>

              <div 
              className='absolute top-0 z-0 right-0 opacity-0 blur-sm 
              group-hover:animate-pulse group-hover:blur-0 group-hover:opacity-70 group-hover:translate-x-1
              transition-all duration-1000'>
                <Image
                  src={'/bg.jpg'}
                  width={400}
                  height={150}
                  alt='icon'
                  className='w-[300px] h-[150px] object-cover'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=''>
        <ListEmployee/>
      </div>
    </div>
  )
}

export default page