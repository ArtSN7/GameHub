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
import Plinko from '@/pages/Plinko/Plinko';

import ProfilePage from '@/pages/ProfilePage/Profile';

import TermsPage from '@/pages/TermsAndConditions/Terms';
import PrivacyPage from '@/pages/TermsAndConditions/Privacy';


import ComingSoonPage from '@/pages/Utils/ComingSoon';
import NotFoundPage from '@/pages/Utils/Error';


export const routes = [
  { path: '/', Component: Home },

  { path: '/games/blackjack', Component: BlackjackPage },
  { path: '/games/texas', Component: ComingSoonPage },
  { path: '/games/slots', Component: SlotsPage },
  { path: '/games/scratch', Component: ScratchTheCardPage },
  { path: '/games/plinko', Component: Plinko },

  { path: '/balance', Component: ComingSoonPage },
  { path: '/leaderboard', Component: ComingSoonPage },
  { path: '/bets', Component: ComingSoonPage },

  { path: '/profile', Component: ProfilePage },

  { path: '/terms', Component: TermsPage },
  { path: '/privacy', Component: PrivacyPage },

  { path: '*', Component:  NotFoundPage },
];
