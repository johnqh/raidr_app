/**
 * The API page's flow map: how its endpoints feed each other, left to right
 * ("Log in → Browse products → Product details"). Built by raidr_lib's
 * `buildFlowGraph`; this component only draws it with React Flow.
 *
 * Tiles: this API's endpoints (card color, click opens the playground),
 * endpoints on other API domains (amber, click opens that API's page), and
 * the log-in step (green). Auth links are dashed; inferred links are faint.
 */
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FlowGraph, FlowNode } from '@sudobility/raidr_lib';
import { Text } from '@sudobility/components';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import { links } from '@/config/links';

const COLUMN_WIDTH = 300;
const ROW_HEIGHT = 112;
const TILE_WIDTH = 240;

const TILE: Record<FlowNode['kind'], string> = {
  endpoint: 'border-border bg-card text-foreground',
  external: 'border-amber-400 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100',
  login:
    'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100',
};

function Tile({ node }: { node: FlowNode }) {
  return (
    <div className="text-left">
      <div className="text-sm font-semibold leading-tight line-clamp-2">{node.label}</div>
      {node.detail ? (
        <div className="mt-1 font-mono text-[10px] opacity-70 break-all line-clamp-2">
          {node.detail}
        </div>
      ) : null}
    </div>
  );
}

export function FlowMap({ graph }: { graph: FlowGraph }) {
  const { t } = useTranslation();
  const { navigate } = useLocalizedNavigate();

  const { flowNodes, flowEdges } = useMemo(() => {
    const flowNodes: Node[] = graph.nodes.map(node => ({
      id: node.id,
      position: { x: node.column * COLUMN_WIDTH, y: node.row * ROW_HEIGHT },
      data: { label: <Tile node={node} />, node },
      // react-flow's stylesheet fixes default nodes at 150px, so a class width loses.
      style: { width: TILE_WIDTH },
      className: `rounded-md border-2 px-3 py-2 cursor-pointer shadow-sm ${TILE[node.kind]}`,
      connectable: false,
    }));
    const flowEdges: Edge[] = graph.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label ?? undefined,
      labelStyle: { fontSize: 10 },
      markerEnd: { type: MarkerType.ArrowClosed },
      style: {
        strokeWidth: edge.evidence === 'observed' ? 2 : 1.25,
        opacity: edge.evidence === 'observed' ? 1 : 0.6,
        strokeDasharray: edge.kind === 'auth' ? '6 4' : undefined,
      },
    }));
    return { flowNodes, flowEdges };
  }, [graph]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);
  // useNodesState only seeds from its argument; keep it in step with the graph.
  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  if (graph.nodes.length === 0) {
    return (
      <Text color="muted">
        {t('flow.empty', 'No flow between endpoints is known for this API yet.')}
      </Text>
    );
  }

  const rows = Math.max(...graph.nodes.map(n => n.row)) + 1;
  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-emerald-500 bg-emerald-50" />
          {t('flow.legend.login', 'Log in')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-border bg-card" />
          {t('flow.legend.endpoint', 'This API (opens the playground)')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-amber-400 bg-amber-50" />
          {t('flow.legend.external', 'Another API domain (opens its page)')}
        </span>
        <span>
          {t('flow.legend.lines', 'Dashed: credential. Faint: inferred from the API’s shape.')}
        </span>
      </div>
      <div
        className="rounded-lg border border-border bg-background"
        style={{ height: Math.min(640, Math.max(260, rows * ROW_HEIGHT + 80)) }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, rfNode) => {
            const node = (rfNode.data as { node: FlowNode }).node;
            if (node.kind === 'external' && node.apiHost) navigate(links.api(node.apiHost));
            else if (node.ref) navigate(links.endpoint(node.ref));
          }}
          nodesConnectable={false}
          fitView
          fitViewOptions={{ padding: 0.15, minZoom: 0.6, maxZoom: 1 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      {graph.hidden > 0 ? (
        <Text size="xs" color="muted" className="mt-2">
          {t('flow.hidden', '{{count}} less connected endpoints are not shown.', {
            count: graph.hidden,
          })}
        </Text>
      ) : null}
    </div>
  );
}
