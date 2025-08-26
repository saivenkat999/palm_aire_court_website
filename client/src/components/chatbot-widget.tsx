import { useEffect } from 'react';

export default function ChatbotWidget() {
  useEffect(() => {
    // Clean up any existing GoHighLevel scripts first
    const existingScripts = document.querySelectorAll('script[src*="leadconnectorhq.com"]');
    existingScripts.forEach(script => script.remove());

    // Create and inject the GoHighLevel chat widget script
    const script = document.createElement('script');
    script.src = 'https://widgets.leadconnectorhq.com/loader.js';
    script.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    script.setAttribute('data-widget-id', '68ad2f7bf01ba3272163c1cb');
    script.async = true;

    // Append to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[data-widget-id="68ad2f7bf01ba3272163c1cb"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  // This component doesn't render any visible UI
  // The GoHighLevel widget will inject itself into the page
  return null;
}
