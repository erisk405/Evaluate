import { Department } from '@/app/data/data-option'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import FilterSection from './_components/FilterSection'

const page = () => {
  return (
    <div className='m-5 w-full grid grid-cols-6  gap-5'>
      <div className='col-span-4 '>
        <div className='bg-white w-full h-full shadow rounded-xl p-5'>
            <h2 className='text-2xl font-bold'>Department manage</h2>
            <div className='flex justify-between'>
              <div className='mt-3 flex-1 max-w-[300px] relative'>
                <Input type="email" placeholder="Email" className='rounded-full' />
                <Search size={18} className='absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 text-gray-500' />
              </div>
              <div>
                <FilterSection/>
              </div>
            </div>
            
            
            <div className='flex flex-wrap gap-3 my-4'>
              {Department?.map((item) => (
                <div key={item?.id} className='flex-1 min-w-[200px] max-w-[300px] border p-3 rounded-xl flex items-center gap-3'>
                  <Image
                    src={item?.img}
                    width={50}
                    height={50}
                    alt='banner'
                    className='w-[50px] h-[50px] object-cover rounded-lg'
                  />
                  <h2>{item?.name }</h2>
                </div>
              ))}
            </div>
        </div>
      </div>
      <div className='col-span-2 '>
        <div className='bg-white w-full h-full shadow rounded-xl p-5'>

        </div>
      </div>
    </div>
  )
}

export default page