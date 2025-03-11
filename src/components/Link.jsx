import { classNames, useUtils } from '@telegram-apps/sdk-react';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Define a custom Link component that extends react-router-dom's Link functionality
 * @param {import('react-router-dom').LinkProps} props - Type definition for props, expecting LinkProps from react-router-dom
 * @return {JSX.Element} - Returns a JSX element (the rendered link)
 */

export function Link({
  className,         
  onClick: propsOnClick,
  to,                
  ...rest            
}) {
  
  // Get Telegram utility functions (like openTelegramLink and openLink) using the SDK's useUtils hook
  const utils = useUtils();

  const onClick = useCallback((e) => { 
    propsOnClick?.(e); 

    let path; // Variable to store the computed path for the link

    // Check if the 'to' prop is a string (e.g., "/home" or "https://example.com")
    if (typeof to === 'string') {
      path = to;
    } else {
      const { search = '', pathname = '', hash = '' } = to;
      // Construct the full path from pathname, search, and hash (e.g., "/home?id=1#section")
      path = `${pathname}?${search}#${hash}`;
    }

    // Create a full URL object from the path, using the current window location as the base
    const targetUrl = new URL(path, window.location.toString());

    // Check if the link points to a Telegram URL (host is 't.me')
    if (targetUrl.host === 't.me') {
      e.preventDefault();
      // Use Telegram's SDK to open the Telegram-specific link (e.g., chat or channel)
      return utils.openTelegramLink(targetUrl.toString());
    }

    // Create a URL object for the current page's location
    const currentUrl = new URL(window.location.toString());

    // Determine if the target URL is external by comparing protocol and host
    const isExternal = targetUrl.protocol !== currentUrl.protocol
      || targetUrl.host !== currentUrl.host;

    // If the link is external (different protocol or host from current page)
    if (isExternal) {
      e.preventDefault();
      // Use Telegram's SDK to open the external link in an appropriate way
      return utils.openLink(targetUrl.toString());
    }

    // If it's not a Telegram or external link, let RouterLink handle it as an internal route
  }, [to, propsOnClick, utils]); 

  // Render the RouterLink component with our custom logic
  return (
    <RouterLink
      {...rest}         
      to={to}            
      onClick={onClick}  
      className={classNames(className, 'link')} 
    />
  );
}