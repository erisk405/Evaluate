import { Flame, FolderClock, LayoutDashboard, PersonStanding, Settings, UserRound } from "lucide-react";

const OptionSideBar = [
    {
        id: 'OSide01',
        name: 'Overview',
        icon: <LayoutDashboard />,
        path: '/overview'
    },
    {
        id: 'OSide02',
        name: 'Employee',
        icon: <PersonStanding />,
        path: '/employee'
    },
    {
        id: 'OSide05',
        name: 'Evaluated',
        icon: <Flame />,
        path: '/flame'
    },
    {
        id: 'OSide06',
        name: 'History',
        icon: <FolderClock />,
        path: '/flame'
    },
    {
        id: 'OSide03',
        name: 'Account',
        icon: <UserRound />,
        path: '/profile/1'
    },
    {
        id: 'OSide04',
        name: 'Setting',
        icon: <Settings />,
        path: '/setting'
    },
]


export{
    OptionSideBar
}