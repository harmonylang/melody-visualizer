import { DownOutlined, ProjectOutlined } from "@ant-design/icons";
import { Card, Tree } from "antd";
import React from "react";

interface SharedVariableCardState {
    sharedValues: VariableTreeType[];
}

interface SharedVariableCardProps {
    sharedVariables: Record<string, unknown>;
}

export type VariableTreeType = {
    title: string;
    key: string;
    children: VariableTreeType[];
}

class SharedVariableCard extends React.Component<SharedVariableCardProps, SharedVariableCardState> {
    constructor(props: SharedVariableCardProps) {
        super(props);

        let treeify = (obj: any) => Object.entries(obj).map(([k, v]) => {
            let convertedTree: VariableTreeType;
            if (v == null || typeof v !== 'object') {
                convertedTree = {
                    title: `${k}: ${this.formatVariableValue(v)}`,
                    key: k,
                    children: []
                };
            } else {
                convertedTree = {
                    title: k,
                    key: k,
                    children: treeify(v)
                };
            }
            return convertedTree;
        });
        this.state = {
            sharedValues: treeify(this.props.sharedVariables)
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
        return (
            <Card size="small" title={<><ProjectOutlined /> Variables</>} className="variables-card">
                <Tree
                    showIcon
                    defaultExpandAll
                    defaultSelectedKeys={['0-0-0']}
                    switcherIcon={<DownOutlined />}
                    treeData={this.state.sharedValues}
                />
            </Card>
        );
    }
}

export default SharedVariableCard;
