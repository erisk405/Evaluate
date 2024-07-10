import { Department } from '@/app/data/data-option'
import { Input } from '@/components/ui/input'
import { Pencil, Plus, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import FilterSection from './_components/FilterSection'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import SettingSection from './_components/SettingSection'
const page = () => {
  return (
    <div className='m-5 w-full grid grid-cols-6  gap-5'>
      <div className='col-span-4 '>
        <div className='bg-white w-full h-full shadow rounded-xl p-5'>
            <h2 className='text-2xl font-bold'>Department manage</h2>
            <div className='flex justify-between items-center mt-3 '>
              <div className='flex-1 max-w-[300px] relative'>
                <Input type="email" placeholder="Email" className='rounded-full' />
                <Search size={18} className='absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 text-gray-500' />
              </div>
              <div className='flex items-center gap-5'>
                <FilterSection/>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className='p-2 active:scale-95'><Plus/></Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create Department</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            
            <div className='w-full flex flex-col gap-3 my-4'>
              {Department?.map((item) => (
                <div key={item?.id} className='border-b p-4 rounded-xl flex items-center gap-3'>
                  <Image
                    src={item?.img}
                    width={100}
                    height={100}
                    alt='banner'
                    className='w-[100px] h-[70px] object-cover rounded-lg'
                  />
                  <div className='flex justify-between w-full items-center'>
                    <div className='ml-3'>
                      <h2>{item?.name}</h2>
                      <h2 className='text-gray-500'>{item?.quantity} คน</h2>
                    </div>
                    <div>
                      <SettingSection/>
                    </div>
                  </div>
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