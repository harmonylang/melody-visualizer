import React from "react";
import './LoadingScreen.css'
import GraphViewer from '../graphviewer/GraphViewer';
import HarmonyIcon from '../logo.svg'
import { Button } from "antd";
import Markdown from "react-markdown";

interface LoadingScreenState {
    displayStr?: string;
    harmonyGV?: string;
    displayGraph: boolean;
}

interface LoadingScreenProps {
    displayStr?: string;
    harmonyGV?: string;
}

class LoadingScreen extends React.Component<LoadingScreenProps, LoadingScreenState> {
    constructor(props: LoadingScreenProps) {
        super(props);

        this.state = {
            displayStr: this.props.displayStr,
            harmonyGV: this.props.harmonyGV,
            displayGraph: false
        }
    }

    shouldComponentUpdate(nextProps: LoadingScreenProps, _: any) {
        if ((this.props.harmonyGV !== nextProps.harmonyGV) || (this.props.displayStr !== nextProps.displayStr)) {
            this.setState({
                displayStr: nextProps.displayStr,
                harmonyGV: nextProps.harmonyGV,
                displayGraph: (this.props.harmonyGV !== nextProps.harmonyGV)
            });
        }
        return true;
    }

    render() {
        const loadingFun = [
            "Strumming threads...",
            "Simulating parallel universes...",
            "Revising the halting problem...",
            "Adding the 51st state...",
            "Testing for the delta invariant...",
            "Modeling ecological collapse...",
            "Guaranteeing money back...",
            "Some assembly required..."
        ];
        return (<>
            {(this.state.displayGraph) ?
                <>
                    <Button className="hide-graph-btn" onClick={() => { this.setState({ displayGraph: false }) }}>Back</Button>
                    <GraphViewer harmonyGV={this.state.harmonyGV ?? ""} />
                </> :
                <>
                    <img src={HarmonyIcon} alt="Harmony Logo" width={128} height={128} className="harmony-icon" />
                    
                    <h2 className="harmony-icon-subtitle">
                        <Markdown>{this.state.displayStr ?? loadingFun[Math.floor(Math.random() * loadingFun.length)]}</Markdown>
                        {(this.state.harmonyGV) ?
                        <Button className="see-graph-btn" onClick={() => { this.setState({ displayGraph: true }) }}>
                            See Graph
                        </Button> : (this.state.displayStr) &&
                        <Button className="see-graph-btn" onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            parent.window.postMessage({ command: "requestGraph", data: null }, "*");
                        }}>
                            Generate Graph
                        </Button>}
                    </h2>
                    
                    <svg className="hero-waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28 " preserveAspectRatio="none">
                        <defs>
                            <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                        </defs>
                        <g className="wave1">
                            <use xlinkHref="#wave-path" x="50" y="2" fill="rgba(255,255,255, .1)" />
                        </g>
                        <g className="wave2">
                            <use xlinkHref="#wave-path" x="50" y="0" fill="rgba(255,255,255, .2)" />
                        </g>
                        <g className="wave3">
                            <use xlinkHref="#wave-path" x="50" y="8" fill="#fff" />
                        </g>
                    </svg>
                    <div className="hero-bottom-bar" />
                </>
            }
        </>
        );
    }
}

export default LoadingScreen;
