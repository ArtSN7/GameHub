/**
 * @typedef {object} Route
 * @property {string} path
 * @property {import('react').ComponentType} Component
 * @property {string} [title]
 * @property {import('react').JSX.Element} [icon]
 */

/**
 * @type {Route[]}
 */


import Home from '@/pages/HomePage/Home';
import BlackjackPage from '@/pages/Blackjack/Blackjack';
import ScratchTheCardPage from '@/pages/Scratch/Scratch';
import SlotsPage from '@/pages/Slots/Slots';
import ProfilePage from '@/pages/ProfilePage/Profile';

import ComingSoonPage from '@/pages/Utils/ComingSoon';
import NotFoundPage from '@/pages/Utils/Error';


export const routes = [
  { path: '/', Component: Home },
  { path: '/games/blackjack', Component: BlackjackPage },
  { path: '/games/texas', Component: ComingSoonPage },
  { path: '/games/slots', Component: SlotsPage },
  { path: '/games/scratch', Component: ScratchTheCardPage },
  { path: '/balance', Component: ComingSoonPage },
  { path: '/leaderboard', Component: ComingSoonPage },
  { path: '/bets', Component: ComingSoonPage },
  { path: '/profile', Component: ProfilePage },

  { path: '*', Component:  NotFoundPage },
];
