import * as React from 'react';

export function Signup () {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.mailjet.com/pas-nc-embedded-v1.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '500px' }}>
      <iframe 
        data-w-type="embedded" 
        frameBorder={0} 
        scrolling="no" 
        marginHeight={0} 
        marginWidth={0} 
        src="https://xnj1m.mjt.lu/wgt/xnj1m/0zki/form?c=534d3030" 
        width="100%"
        style={{ minHeight: '500px', border: 'none' }}
      />
    </div>
  );
}
