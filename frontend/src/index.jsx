import './mockEnv.js';
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { Root } from '@/components/Root.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
