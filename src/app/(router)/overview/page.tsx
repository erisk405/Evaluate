import React from 'react'
import MyEvaluated from './_components/MyEvaluated'
import RightSection from './_components/RightSection'

const page = () => {
  return (
    <div className='m-10 grid grid-cols-6 grid-rows-2 gap-10 '>
      <div className='col-span-4 row-span-1'>
        <MyEvaluated/>
      </div>
      <div className='col-span-2 row-span-1'>
        <RightSection/>
      </div>
    </div>
  )
}

export default page