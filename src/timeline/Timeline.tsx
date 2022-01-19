import { PageHeader } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Layout, { Content } from "antd/lib/layout/layout";
import SplitPane from "react-split-pane";
import { CharmonySlice, CharmonyTopLevel, ExecutionPath } from "../types/CharmonyJson";
import './Timeline.css'
import AssemblyCard from "./AssemblyCard";
import TimelineEditor from "./TimelineEditor";
import React from "react";
import SharedVariableCard from "./SharedVariableCard";
import StackTraceTable from "./StackTraceTable";

interface TimelineProps {
    harmonyData: CharmonyTopLevel & ExecutionPath;
}

interface TimelineState {
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
            stepValue: 0,
            currentPc: 0,
            currentSlice: currentSlice
        }
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
            <Layout className="fullscreen" >
                <Content className="fullscreen">
                    <SplitPane split="horizontal" minSize={300} defaultSize={"70%"}>
                        <SplitPane split="vertical" minSize={100} defaultSize={300}>
                            <div>
                                <PageHeader
                                    className="issue-header"
                                    title={<><ExclamationCircleOutlined />&nbsp;&nbsp;{this.props.harmonyData.issue}</>}
                                />
                                <SplitPane split="horizontal" minSize={200} defaultSize={"60%"}>
                                    <AssemblyCard code={this.props.harmonyData.executedCode} pcValue={this.state.currentPc} />
                                    <SharedVariableCard
                                        key={JSON.stringify(this.state.currentSlice.sharedValues)}
                                        sharedVariables={this.state.currentSlice.sharedValues} />
                                </SplitPane>
                            </div>
                            <StackTraceTable
                                key={JSON.stringify(this.state.currentSlice)}
                                currentStackTrace={this.state.currentSlice}
                                threadNames={this.props.harmonyData.idToThreadName} />
                        </SplitPane>
                        <TimelineEditor
                            stepValue={this.state.stepValue}
                            setStepValue={(v) => this.setStepValue(v)}
                            blocks={this.props.harmonyData.macroSteps}
                            slices={this.props.harmonyData.slices} />
                    </SplitPane>
                </Content>
            </Layout>
        );
    }
}

export default Timeline;
