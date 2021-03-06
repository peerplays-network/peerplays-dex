import React from 'react';
import {
    IconAssets,
    IconBlockchain,
    IconBusiness, IconContacts,
    IconDashboard,
    IconExchange, IconQuestion,
    IconSettings,
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
        link: '/voting',
        tag: 'voting',
        icon: <IconVoting />,
    },
    {
        link: '/business',
        tag: 'business',
        icon: <IconBusiness />,
    },
    {
        link: '/settings',
        tag: 'settings',
        icon: <IconSettings />,
    },
    {
        link: '/contacts',
        tag: 'contacts',
        icon: <IconContacts />,
    },
    {
        link: '/help',
        tag: 'help',
        icon: <IconQuestion />,
    }
];
