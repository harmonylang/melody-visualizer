import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './loading/LoadingScreen';
import Timeline from './timeline/Timeline';
import { ConfigProvider } from 'antd';
import { darkTheme } from '@ant-design/compatible';

function App() {
  const [harmonyData, setHarmonyData] = useState(undefined);
  const [harmonyGV, setHarmonyGV] = useState(undefined);
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
        case 'load-graph':
          setHarmonyGV(jsonData);
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
    <ConfigProvider theme={darkTheme}>
      <div className={isFadingOut ? "main-fadeout" : "main-fadein"}>
        {(harmonyData && !isFadingOut)
          ? <Timeline displayStr={harmonyMsg} harmonyData={harmonyData} />
          : <LoadingScreen displayStr={harmonyMsg} harmonyGV={harmonyGV} />}
      </div>
    </ConfigProvider>
  );
}

export default App;
