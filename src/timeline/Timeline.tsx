import "allotment/dist/style.css";
import './Timeline.css'
import { Button, Drawer } from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Layout, { Content } from "antd/lib/layout/layout";
import { Allotment } from "allotment";
import { CharmonySlice, CharmonyTopLevel, ExecutionPath } from "../types/CharmonyJson";
import AssemblyCard from "./AssemblyCard";
import TimelineEditor from "./TimelineEditor";
import React from "react";
import SharedVariableCard from "./SharedVariableCard";
import StackTraceTable from "./StackTraceTable";
import Markdown from "react-markdown";

interface TimelineProps {
    displayStr?: string;
    harmonyData: CharmonyTopLevel & ExecutionPath;
}

interface TimelineState {
    displayStr?: string;
    consoleOpen: boolean;
    stepValue: number;
    currentPc: number;
    currentSlice: CharmonySlice;
}

class Timeline extends React.Component<TimelineProps, TimelineState> {
    constructor(props: TimelineProps) {
        super(props);
        let currentStep = this.props.harmonyData.microSteps[0];
        let currentSlice = this.props.harmonyData.slices[currentStep.sliceIdx];

        this.state = {
            consoleOpen: false,
            stepValue: 0,
            currentPc: 0,
            currentSlice: currentSlice
        }
    }

    toggleConsole = () => {
        this.setState(prevState => ({
            consoleOpen: !prevState.consoleOpen
        }));
    }

    setStepValue(value: number) {
        let currentStep = this.props.harmonyData.microSteps[value];
        if (currentStep) {
            let currentSlice = this.props.harmonyData.slices[currentStep.sliceIdx];

            this.setState({
                stepValue: value,
                currentPc: currentStep.pc,
                currentSlice: currentSlice
            });
        }
    }

    render() {
        return (
            <Layout className="fullscreen">
                <Content className="fullscreen">
                    <Allotment vertical={true} defaultSizes={[700, 300]}> {/* split="horizontal" minSize={300} defaultSize={"70%"}> */}
                        <Allotment.Pane minSize={300}>
                            <Allotment>{/* <Allotment split="vertical" minSize={100} defaultSize={300}> */}
                                <div className="fullscreen">
                                    <Button className="issue-header" type="default" onClick={this.toggleConsole} icon={<ExclamationCircleOutlined />}>
                                        {this.props.harmonyData.issue}
                                    </Button>
                                    {/* <Allotment split="horizontal" minSize={200} defaultSize={"60%"}> */}
                                    <Allotment vertical={true}>
                                        <AssemblyCard code={this.props.harmonyData.executedCode} pcValue={this.state.currentPc} />
                                        <SharedVariableCard
                                            key={JSON.stringify(this.state.currentSlice.sharedValues)}
                                            sharedVariables={this.state.currentSlice.sharedValues} />
                                    </Allotment>
                                </div>
                                <StackTraceTable
                                    key={JSON.stringify(this.state.currentSlice)}
                                    currentStackTrace={this.state.currentSlice}
                                    threadNames={this.props.harmonyData.idToThreadName} />
                            </Allotment>
                        </Allotment.Pane>
                        <TimelineEditor
                            stepValue={this.state.stepValue}
                            setStepValue={(v) => this.setStepValue(v)}
                            blocks={this.props.harmonyData.macroSteps}
                            slices={this.props.harmonyData.slices} />
                    </Allotment>
                </Content>
                <Drawer
                    title="Execution Report"
                    placement="left"
                    width={500}
                    onClose={this.toggleConsole}
                    open={this.state.consoleOpen}
                >
                    <Markdown>{this.props.displayStr}</Markdown>
                </Drawer>
            </Layout>
        );
    }
}

export default Timeline;
