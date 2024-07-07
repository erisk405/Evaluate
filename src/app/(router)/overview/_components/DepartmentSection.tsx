import Image from 'next/image'
import React from 'react'

const DepartmentSection = () => {
  const Department = [
    {
      id:"DEP01",
      name:"สำนักงานผู้อำนวยการ",
      img:"/test.png",
    },
    {
      id:"DEP02",
      name:"งานบริหารทั่วไป",
      img:"/test.png",
    },
    {
      id:"DEP03",
      name:"งานประกันคุณภาพและประเมินผล",
      img:"/test.png",
    },
    {
      id:"DEP04",
      name:"งานพัฒนาวิชาการและส่งเสริมการศึกษา",
      img:"/test.png",
    },
    {
      id:"DEP05",
      name:"งานทะเบียนและประมวลผล",
      img:"/test.png",
    },
    {
      id:"DEP06",
      name:"งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      img:"/test.png",
    },
    {
      id:"DEP07",
      name:"งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      img:"/test.png",
    },
    {
      id:"DEP08",
      name:"งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      img:"/test.png",
    },
    {
      id:"DEP09",
      name:"งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      img:"/test.png",
    },
    {
      id:"DEP10",
      name:"งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      img:"/test.png",
    },
    {
      id:"DEP11",
      name:"งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      img:"/test.png",
    },
  ]
  return (
    <>
    <div className='h-[550px] overflow-y-scroll scrollbar-gemini'>
      <h2 className='px-5 pt-5 text-xl font-bold'>Department</h2>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 m-4'>
        {Department.map((item)=>(
          <div key={item?.id} 
            className='overflow-hidden cursor-pointer col-span-1 rounded-2xl shadow-md
            hover:bg-neutral-700 hover:scale-105 active:scale-95 group transition-all'>
            <div className='flex items-center flex-col'>
              <Image
                src={item?.img}
                width={500}
                height={500}
                alt='BannerDeapartment'
                className='w-[250px] h-[120px] object-cover'
              />
              <h2 className='group-hover:text-white text-center p-4'>{item?.name}</h2>
            </div>
            
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default DepartmentSection