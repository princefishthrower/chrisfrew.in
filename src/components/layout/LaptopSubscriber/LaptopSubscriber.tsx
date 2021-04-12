import * as React from 'react';
import { LineOne } from './LineOne';
import { LineTwo } from './LineTwo';
import { LineThree } from './LineThree';
import { useState } from 'react';


export function LaptopSubscriber () {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  if (!isVisible) {
    return <></>
  }

  return (
      <div className="laptop-subscriber">
        <form
                action="https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&amp;id=b1729bbdce"
                method="post"
                target="_blank"
                noValidate
            >
            <pre> ______________</pre>
            <LineOne/>
            <LineTwo/>
            <LineThree/>
            <pre style={{display: 'inline'}}>||</pre><input type="submit" value="<Subscribe!>"></input><pre style={{display: 'inline'}}>||</pre>
            <button onClick={() => setIsVisible(false)}><pre>|| {'<'}CLOSE{'>'} :( ||</pre></button>
            <pre>||____________||</pre>
            <pre> \\############\\</pre>
            <pre>  \\############\\</pre>
            <pre>   \      ____    \</pre>
            <pre>    \_____\___\____\</pre>
            </form>
            </div>
  );
}
