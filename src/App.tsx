import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './loading/LoadingScreen';
import Timeline from './timeline/Timeline';

function App() {
  const [harmonyData, setHarmonyData] = useState(undefined);
  const [harmonyMsg, setHarmonyMsg] = useState(undefined);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Retrieves the data from our panel
  React.useEffect(() => {
    const handler = (event: MessageEvent<any>) => {
      const { command, jsonData } = event.data; // The command and JSON data our extension sent
      switch (command) {
        case 'load':
          setIsFadingOut(true);
          setTimeout(() => setIsFadingOut(false), 200);
          setHarmonyData(jsonData);
          break;
        case 'message':
          setHarmonyMsg(jsonData);
          break;
        case 'start':
          break;
      }
    }

    window.addEventListener("message", handler);

    // eslint-disable-next-line no-restricted-globals
    parent.window.postMessage({ command: "iframeReady", data: null }, "*");

    // clean up
    return () => window.removeEventListener("message", handler)
  }, []);

  return (
    <div className={isFadingOut ? "main-fadeout" : "main-fadein"}>
      {(harmonyData && !isFadingOut)
        ? <Timeline harmonyData={harmonyData} />
        : <LoadingScreen key={harmonyMsg} displayStr={harmonyMsg} />}
    </div>
  );
}

export default App;
