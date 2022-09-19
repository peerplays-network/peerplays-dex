import React from 'react';
import IconAssets from '../svg/assets.svg'
import IconBlockchain from '../svg/blockchain.svg'
import IconBookOpen from '../svg/book-open.svg'
import IconDashboard from '../svg/dashboard.svg'
import IconExchange from '../svg/exchange.svg'
import Iconwithdrawal from '../svg/withdrawal.svg'
import IconVoting from '../svg/voting.svg'
import IconSettings from '../svg/settings.svg'

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
