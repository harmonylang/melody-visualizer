import { BugOutlined } from "@ant-design/icons";
import { Card, List, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import React from "react";
import { CharmonyExecutedCode } from "../types/CharmonyJson";
import './AssemblyCard.css'

interface AssemblyCardState {
    listRefs: Map<number, React.RefObject<any>>;
}

interface AssemblyCardProps {
    pcValue: number;
    code: CharmonyExecutedCode[];
}

class AssemblyCard extends React.Component<AssemblyCardProps, AssemblyCardState> {
    constructor(props: AssemblyCardProps) {
        super(props);

        this.state = {
            listRefs: this.props.code.reduce((acc, value) => {
                acc.set(value.initialPc, React.createRef());
                return acc;
            }, new Map())
        }
    }

    shouldComponentUpdate(nextProps: AssemblyCardProps, _: any) {
        this.scrollToValue(nextProps.pcValue);
        return this.props.code !== nextProps.code;
    }

    scrollToValue(pcValue: number) {
        this.state.listRefs.get(pcValue)?.current.scrollIntoView({
            behavior: 'auto',
            block: 'start',
        });
    }

    render() {
        return (
            <Card size="small" title={<><BugOutlined /> Assembly</>} className="assembly-card">
                <List
                    size="small"
                    className="card-list"
                    dataSource={this.props.code}
                    renderItem={item => <>
                        {item.assembly.map((c, idx) => {
                            const pc = idx + item.initialPc;
                            return <List.Item className="assembly-list-item" key={pc}>
                                <div ref={this.state.listRefs.get(pc)}>
                                <Tooltip
                                    title={item.sourceCode}>
                                    <Text disabled>{pc}</Text>&nbsp;
                                    {c.assembly}
                                    <Text type="warning" className="assembly-list-text">
                                        {item.file.substring(item.file.lastIndexOf('/') + 1).replace(".hny", "")}:{item.line}
                                    </Text>
                                </Tooltip>
                                </div>
                            </List.Item>
                        })}
                    </>}
                />
            </Card>
        );
    }
}

export default AssemblyCard;
