import React from 'react';
import {
    IconAssets,
    IconBlockchain,
    IconBookOpen,
    IconDashboard,
    IconExchange, 
    IconSettings,
    Iconwithdrawal,
    IconVoting
} from "../svg/index";

export const menuList = [
    {
        link: '/',
        tag: 'dashboard',
        icon: <IconDashboard />,
    },
    {
        link: '/exchange',
        tag: 'exchange',
        icon: <IconExchange />,
    },
    {
        link: '/assets',
        tag: 'assets',
        icon: <IconAssets />,
    },
    {
        link: '/blockchain',
        tag: 'blockchain',
        icon: <IconBlockchain />,
    },
    {
        link: '/voting-vesting',
        tag: 'voting',
        icon: <IconVoting />,
    },
    {
        link: '/settings',
        tag: 'settings',
        icon: <IconSettings />,
    },
    {
        link: '/bitcoin',
        tag: 'bitcoin',
        icon: <IconBookOpen/>,
    },
    {
        link: '/hive-hbd',
        tag: 'hive',
        icon: <Iconwithdrawal/>,
    }
];
