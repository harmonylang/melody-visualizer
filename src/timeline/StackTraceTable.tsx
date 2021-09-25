import { Table } from "antd";
import React from "react";
import { CharmonySlice, CharmonyStackTrace } from "../types/CharmonyJson";
import './AssemblyCard.css'

interface StackTraceTableState {
    processTableData: ProcessTableData[];
}

interface StackTraceTableProps {
    currentStackTrace: CharmonySlice;
    threadNames: Record<string, string>
}

export type ProcessTableData = {
    process: string;
    status: string;
    stacktrace: string;
    variables: string;
}

class StackTraceTable extends React.Component<StackTraceTableProps, StackTraceTableState> {
    constructor(props: StackTraceTableProps) {
        super(props);

        let mapProcesses = (obj: Record<string, CharmonyStackTrace>) => Object.keys(obj).map((pid, rowNumber) => {
            const traceData = obj[pid];
            let convertedTree: ProcessTableData = {
                process: this.props.threadNames[pid],
                status: traceData.fullStatus,
                stacktrace: traceData.callStack.map((stack, level) => stack.method).join("\n"),
                variables: ""
            }
            return convertedTree;
        });

        this.state = {
            processTableData: mapProcesses(this.props.currentStackTrace.idToStackTrace)
        };
    }

    render() {
        const columns = [
            {
                title: 'Process',
                dataIndex: 'process',
                key: 'process',
                render: (text: string) => (
                    <span>
                      {text}
                    </span>
                  )
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (text: string) => (
                    <span>
                      {text}
                    </span>
                  )
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
            }];
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
