import './GraphViewer.css'
import React from "react";
import { Graphviz } from 'graphviz-react';

interface GraphViewerProps {
    harmonyGV: string;
}

interface GraphViewerState { }

class GraphViewer extends React.Component<GraphViewerProps, GraphViewerState> {

    render() {
        return (
            <Graphviz options={{
                zoom: true,
                width: "100%",
                height: "100vh"
            }} dot={this.props.harmonyGV.replace(`rankdir = "LR"`, `rankdir = "LR"
                bgcolor="black"
                node[style=outline, color=white, fontcolor=white]
                edge[color=white, fontcolor=white]
            `)} />
        );
    }
}

export default GraphViewer;
