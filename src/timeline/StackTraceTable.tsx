import { CheckCircleTwoTone, CheckSquareTwoTone, CloseCircleTwoTone, CloseSquareTwoTone, LoadingOutlined, MinusCircleTwoTone, PlayCircleTwoTone, QuestionCircleTwoTone, WarningTwoTone } from "@ant-design/icons";
import { Spin, Table, Tooltip } from "antd";
import React from "react";
import { CharmonySlice, CharmonyStackTrace } from "../types/CharmonyJson";
import './StackTraceTable.css'

interface StackTraceTableState {
    processTableData: ProcessTableData[];
}

interface StackTraceTableProps {
    currentStackTrace: CharmonySlice;
    threadNames: Record<string, string>
}

export type ProcessTableData = {
    process: {
        name: string;
        status: string;
    };
    stacktrace: string;
    variables: string;
}

class StackTraceTable extends React.Component<StackTraceTableProps, StackTraceTableState> {
    constructor(props: StackTraceTableProps) {
        super(props);

        let showStackTraceVariables = (level: number, pid: string) => {
            const stackTrace = this.props.currentStackTrace.idToStackTrace[pid];
            const trace = stackTrace.callStack[level];
            if (trace)
                return Object.entries(trace.vars).map(([name, value]) => {
                    return `${name} = ${this.formatVariableValue(value)}`;
                }).join("\n");
            else
                return "";
        }

        let mapProcesses = (obj: Record<string, CharmonyStackTrace>) => Object.keys(obj).map((pid, rowNumber) => {
            const traceData = obj[pid];
            let convertedTree: ProcessTableData = {
                process: {
                    name: this.props.threadNames[pid],
                    status: traceData.fullStatus
                },
                stacktrace: traceData.callStack.map((stack, level) => stack.method).join("\n"),
                variables: showStackTraceVariables(0, pid)
            }
            return convertedTree;
        });

        this.state = {
            processTableData: mapProcesses(this.props.currentStackTrace.idToStackTrace)
        };
    }

    formatVariableValue(v: any) {
        const typeofV = typeof v;
        if (typeofV === "string") {
            if (v.startsWith("?")) {
                return `${v}`;
            } else {
                return `"${v}"`;
            }
        }
        if (typeofV === "boolean" || typeofV === "number") {
            const s = v.toString()
            return s[0].toUpperCase() + s.substring(1);
        }
        if (v == null) {
            return 'None';
        } else {
            return JSON.stringify(v);
        }
    }

    render() {
        const columns = [
            {
                title: 'Process',
                dataIndex: 'process',
                key: 'process',
                render: (text: { name: string; status: string }) => {
                    let statusRender = (status: string) => {
                        switch (status) {
                            case "running":
                                return <PlayCircleTwoTone twoToneColor="#7cb305" />;
                            case "running atomic":
                                return <PlayCircleTwoTone twoToneColor="#7cb305" />;
                            case "running atomic read-only":
                                return <PlayCircleTwoTone twoToneColor="#7cb305" />;
                            case "runnable":
                                return <CheckCircleTwoTone twoToneColor="#7cb305" />;
                            case "runnable atomic":
                                return <CheckCircleTwoTone twoToneColor="#7cb305" />;
                            case "runnable atomic read-only":
                                return <CheckCircleTwoTone twoToneColor="#7cb305" />;
                            case "failed":
                                return <CloseSquareTwoTone twoToneColor="#a8071a" />;
                            case "blocked":
                                return <MinusCircleTwoTone twoToneColor="#a8071a" />;
                            case "blocked atomic":
                                return <MinusCircleTwoTone twoToneColor="#a8071a" />;
                            case "blocked atomic read-only":
                                return <MinusCircleTwoTone twoToneColor="#a8071a" />;
                            case "terminated":
                                return <CheckSquareTwoTone twoToneColor="#7cb305" />;
                            case "choosing":
                                return <QuestionCircleTwoTone twoToneColor="#d4b106" />;
                            default:
                                console.log(status);
                                return <WarningTwoTone />;
                        }
                    }

                    return (<span>
                        <Tooltip title={text.status}>{statusRender(text.status)}</Tooltip>  {text.name}
                    </span>);
                }
            },
            {
                title: 'Stack Trace',
                dataIndex: 'stacktrace',
                key: 'stacktrace',
                render: (text: string) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Variables',
                dataIndex: 'variables',
                key: 'variables',
                render: (text: string) => (
                    <span>
                        {text}
                    </span>
                )
            },];
        return (
            <Table
                className="stacktrace-table"
                style={{ whiteSpace: 'pre' }}
                columns={columns}
                dataSource={this.state.processTableData}
                pagination={false} />
        );
    }
}

export default StackTraceTable;
