import React from 'react'
import MyEvaluated from './_components/MyEvaluated'
import RightSection from './_components/RightSection'

const page = () => {
  return (
    <div className='m-5 grid grid-cols-6 gap-5'>
      <div className='xl:col-span-4 col-span-6'>
        <MyEvaluated/>
      </div>
      <div className='xl:col-span-2 col-span-6'>
        <RightSection/>
      </div>
    </div>
  )
}

export default page