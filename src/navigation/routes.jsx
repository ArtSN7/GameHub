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

import ComingSoonPage from '@/pages/Additional/ComingSoon';
import NotFoundPage from '@/pages/Additional/Error';


export const routes = [
  { path: '/', Component: Home },
  { path: '/games/blackjack', Component: BlackjackPage },
  { path: '/games/texas', Component: ComingSoonPage },
  { path: '/games/slots', Component: ComingSoonPage },
  { path: '/games/scratch', Component: ScratchTheCardPage },
  { path: '/balance', Component: ComingSoonPage },
  { path: '/leaderboard', Component: ComingSoonPage },
  { path: '/bets', Component: ComingSoonPage },
  { path: '/profile', Component: ComingSoonPage },

  { path: '*', Component:  NotFoundPage },
];
