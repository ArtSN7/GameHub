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


export const routes = [
  { path: '/', Component: Home },
  { path: '/games/blackjack', Component: BlackjackPage },
];
