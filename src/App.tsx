import React, { useState } from 'react';
import './App.css';
import Timeline from './timeline/Timeline';

function App() {
  const [harmonyData, setHarmonyData] = useState(undefined);

  React.useEffect(() => {
    const handler = (event: MessageEvent<any>) => {
      const { command, jsonData } = event.data; // The command and JSON data our extension sent
      switch (command) {
        case 'load':
          console.log(jsonData);
          setHarmonyData(jsonData);
          break;
        case 'message':
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
    <>
      {harmonyData &&
        <Timeline harmonyData={harmonyData} />
      }
    </>
  );
}

export default App;
