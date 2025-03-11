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


export const routes = [
  { path: '/', Component: Home },
  { path: '/games/*', Component: Home },
];
