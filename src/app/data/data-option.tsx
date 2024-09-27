import { BarChart3, Flame, FolderClock, LayoutDashboard, PersonStanding, Settings, ShieldCheck, UserRound } from "lucide-react";


const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;

const OptionSideBar = [
    {
        id: 'OSide01',
        name: 'Overview',
        icon: <LayoutDashboard />,
        path: '/overview',
        session: 'user'
    },
    {
        id: 'OSide02',
        name: 'Employee',
        icon: <PersonStanding />,
        path: '/employee',
        session: 'user'
    },
    {
        id: 'OSide05',
        name: 'Evaluated',
        icon: <Flame />,
        path: '/evaluated',
        session: 'user'
    },
    {
        id: 'OSideAdmin',
        name: 'Management',
        icon: <ShieldCheck />,
        path: '#',
        session: 'Admin',
        SubOptionSideBar:[
            {
                id: 'subOSide1',
                name: 'Department & Role',
                path: '/management/department_role',
            },
            {
                id: 'subOSide2',
                name: 'Form',
                path: '/management/manage_form',
            },
            {
                id: 'subOSide3',
                name: 'User',
                path: '/management/manage_user',
            },
        ]
    },
    {
        id: 'OSide06',
        name: 'History',
        icon: <FolderClock />,
        path: '/history',
        session: 'user'
    },
    {
        id: 'OSideAdmin2',
        name: 'Evaluation',
        icon: <BarChart3 />,
        path: '#',
        session: 'Admin',
        SubOptionSideBar:[
            {
                id: 'subOSide4',
                name: 'All result',
                path: '/All_result',
            },
            {
                id: 'subOSide5',
                name: 'Export',
                path: '/Export',
            },
        ]
    },
    {
        id: 'OSide03',
        name: 'Account',
        icon: <UserRound />,
        path: '/profile',
        session: 'user'
    },
    {
        id: 'OSide04',
        name: 'Setting',
        icon: <Settings />,
        path: '/setting',
        session: 'user'
    },
]

const Department = [
    {
      id:"DEP01",
      name:"สำนักงานผู้อำนวยการ",
      img:"/test.png",
      quantity:'43'
    },
    {
      id:"DEP02",
      name:"งานบริหารทั่วไป",
      img:"/test.png",
      quantity:'33'
    },
    {
      id:"DEP03",
      name:"งานประกันคุณภาพและประเมินผล",
      img:"/test.png",
      quantity:'89'
    },
    {
      id:"DEP04",
      name:"งานพัฒนาวิชาการและส่งเสริมการศึกษา",
      img:"/test.png",
      quantity:'73'
    },
    {
      id:"DEP05",
      name:"งานทะเบียนและประมวลผล",
      img:"/test.png",
      quantity:'12'
    },
    {
      id:"DEP06",
      name:"งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      img:"/test.png",
      quantity:'56'
    },
  ]
export{
    OptionSideBar,
    Department,
    apiUrl
}