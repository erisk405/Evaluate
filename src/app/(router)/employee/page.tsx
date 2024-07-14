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
    <div className='p-10 w-full '>
      <h2 className='text-2xl font-bold'>Employee</h2>
      <div className='flex justify-around gap-6 flex-wrap my-5 bg-gray-100 p-5 rounded-3xl'>
        {OptionEmployee.map((item) => (
          <div key={item?.id} className='flex-1 min-w-[250px] max-w-[300px] cursor-pointer '>
            <div 
              className={`flex rounded-3xl gap-3 relative overflow-hidden
              items-center px-8 py-7 shadow-xl
              bg-gradient-to-r bg-neutral-900 from-neutral-700 to-neutral-900 group 
              transition-all `}
            >
              <div className='text-white w-full group-hover:text-white z-10'>
                <div className=''>
                  <h2 className='text-sm text-neutral-400'>Avaliable Balance</h2>
                  <h2 className='text-lg'>{item?.name}</h2>
                </div>
                <div className='flex justify-between mt-20'>
                  <h2>View more</h2>
                  <h2 className=''>{item?.quantity}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='bg-gray-100 p-5 rounded-3xl'>
        <h2 className='text-xl font-semibold'>All Employee List</h2>
        <p className='text-gray-500'>The request is in the state Waiting for success</p>
        <ListEmployee/>
      </div>
    </div>
  )
}

export default page