import { CaretRightOutlined, PauseOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { Button, Col, List, Row, Slider } from "antd";
import React from "react";
import { CharmonyMacroStep, CharmonySlice } from "../types/CharmonyJson";
import "./TimelineEditor.css"

const BAR_LEN_FACTOR = 5;
const COLOR_MAP = ['#c62828', '#AD1457', '#6A1B9A', '#4527A0', '#283593', '#1565C0', '#0277BD', '#00838F',
    '#00695C', '#2E7D32', '#558B2F', '#9E9D24', '#F9A825', '#FF8F00', '#EF6C00', '#D84315', '#4E342E',
    '#424242', '#37474F'
];

interface TimelineEditorProps {
    stepValue: number;
    setStepValue: (v: number) => void;
    blocks: CharmonyMacroStep[];
    slices: CharmonySlice[];
}

interface TimelineEditorState {
    playing: boolean;
    totalDuration: number;
    processLabels: String[];
    processBars: ProcessBar[];
}

interface ProcessBlock {
    start: number;
    length: number;
    color: string;
}

interface ProcessBar {
    blocks: ProcessBlock[];
}

class TimelineEditor extends React.Component<TimelineEditorProps, TimelineEditorState> {
    interval: NodeJS.Timeout | undefined;
    processBarsRef: React.RefObject<HTMLDivElement>;

    constructor(props: TimelineEditorProps) {
        super(props);

        let totalDuration = 0;
        let processObjects = new Map<string, ProcessBar>();
        let processLabels: String[] = [];
        let processBars: ProcessBar[] = [];

        props.blocks?.forEach((mas) => {
            const { tid, name, startSliceIdx, lastSliceIdx } = mas;
            if (!processObjects.has(tid)) {
                // Label Generation
                processLabels.push(name);

                // Row Generation
                processObjects.set(tid, { blocks: [] });
            }

            const processBar = processObjects.get(tid);

            for (let i = startSliceIdx; i < lastSliceIdx; i++) {
                const s = props.slices[i];
                processBar?.blocks.push({ start: totalDuration, length: s.duration, color: "" });
                totalDuration += s.duration;
            }
        });

        let processNum = 0;
        processObjects.forEach((processBar) => {
            processBar.blocks.forEach((block) => block.color = COLOR_MAP[processNum % COLOR_MAP.length]);
            processBars.push(processBar);
            processNum++;
        });

        this.processBarsRef = React.createRef();

        this.state = {
            playing: false,
            totalDuration: totalDuration,
            processLabels: processLabels,
            processBars: processBars
        }
    }

    tick() {
        let oldValue = this.props.stepValue;
        if (this.state.playing) {
            if (oldValue < this.state.totalDuration) {
                this.processBarsRef.current?.scrollTo({
                    top: 0,
                    left: oldValue * BAR_LEN_FACTOR,
                    behavior: 'auto'
                  });
                this.props.setStepValue(oldValue + 1);
            } else
                this.setState({ playing: false });
        }

    }

    stepForwards() {
        let oldValue = this.props.stepValue;
        if (oldValue < this.state.totalDuration)
            this.props.setStepValue(oldValue + 1);
    }

    stepBackwards() {
        let oldValue = this.props.stepValue;
        if (oldValue > 0)
            this.props.setStepValue(oldValue - 1);
    }

    togglePlaying() {
        this.setState({ playing: !this.state.playing });
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 100);
    }

    componentWillUnmount() {
        if (this.interval)
            clearInterval(this.interval);
    }

    render() {
        return (
            <Col>
                <Row className="timeline-bar">
                    <Button shape="circle"
                        icon={<StepBackwardOutlined />}
                        size="middle" className="timeline-bar-btn"
                        onClick={() => this.stepBackwards()} />
                    <Button shape="circle"
                        icon={this.state.playing ? <PauseOutlined /> : <CaretRightOutlined />}
                        size="middle"
                        className="timeline-bar-btn"
                        onClick={() => this.togglePlaying()} />
                    <Button shape="circle"
                        icon={<StepForwardOutlined />}
                        size="middle"
                        className="timeline-bar-btn"
                        onClick={() => this.stepForwards()} />
                    <Slider onChange={(v) => this.props.setStepValue(v)} value={this.props.stepValue} style={{ flexGrow: 1 }} max={this.state.totalDuration} className="timeline-slider" />
                </Row>
                <Row style={{ overflowY: 'scroll' }}>
                    <Col span={6}>
                        <List
                            bordered
                            dataSource={this.state.processLabels}
                            renderItem={item => (
                                <List.Item style={{ height: '3em' }}>
                                    {item}
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={18} ref={this.processBarsRef} style={{ overflowX: 'scroll' }}>
                        <List
                            bordered
                            dataSource={this.state.processBars}
                            style={{ width: this.state.totalDuration * BAR_LEN_FACTOR }}
                            renderItem={item => (
                                <List.Item style={{ position: 'relative', padding: 0, height: '3em', }}>
                                    {item.blocks.map((block) => <div
                                        style={{
                                            position: 'absolute',
                                            left: block.start * BAR_LEN_FACTOR,
                                            width: block.length * BAR_LEN_FACTOR,
                                            height: '3em',
                                            backgroundColor: block.color
                                        }}>
                                    </div>)}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default TimelineEditor;
