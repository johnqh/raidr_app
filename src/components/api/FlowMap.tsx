/**
 * The API page's flow map: how its endpoints feed each other, left to right
 * ("Log in → Browse products → Product details"). raidr_lib's
 * `buildFlowGraph` groups fan-out and lays the tiles out with dagre; this
 * component only draws the result with React Flow.
 *
 * Tiles: this API's endpoints (card color, click opens the playground),
 * endpoints on other API domains (amber, click opens that API's page), the
 * log-in step (green) and groups of endpoints fed the same value (blue, one
 * row per endpoint). Hovering or tapping a tile lights its upstream and
 * downstream path and dims the rest; on touch screens a second tap opens it.
 * Auth links are dashed; inferred links are lighter.
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { flowPath, type FlowGraph, type FlowNode } from '@sudobility/raidr_lib';
import { Text } from '@sudobility/components';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import { links } from '@/config/links';
import { FlowGroupNode } from './FlowGroupNode';

const TILE: Record<Exclude<FlowNode['kind'], 'group'>, string> = {
  endpoint: 'border-border bg-card text-foreground',
  external: 'border-amber-400 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100',
  login:
    'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100',
};

interface TileData extends Record<string, unknown> {
  node: FlowNode;
  dim: boolean;
  focused: boolean;
}

function TileNode({ data }: NodeProps) {
  const { node, dim, focused } = data as TileData;
  const tone = TILE[node.kind === 'group' ? 'endpoint' : node.kind];
  return (
    <div
      className={`h-full w-full cursor-pointer rounded-md border-2 px-3 py-2 text-left shadow-sm transition-opacity ${tone} ${dim ? 'opacity-15' : ''} ${focused ? 'ring-2 ring-primary ring-offset-1' : ''}`}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <div className="text-sm font-semibold leading-tight line-clamp-2">{node.label}</div>
      {node.detail ? (
        <div className="mt-1 font-mono text-[10px] opacity-70 truncate" title={node.detail}>
          {node.detail}
        </div>
      ) : null}
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </div>
  );
}

// Not `group`: React Flow reserves that type for its own parent nodes.
const NODE_TYPES: NodeTypes = { tile: TileNode, endpointGroup: FlowGroupNode };
/** Above this drawing width a minimap helps find your way around. */
const MINIMAP_WIDTH = 1100;
const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;

export function FlowMap({
  graph,
  onToggleGroup,
}: {
  graph: FlowGraph;
  onToggleGroup: (groupId: string) => void;
}) {
  const { t } = useTranslation();
  const { navigate } = useLocalizedNavigate();
  const [focus, setFocus] = useState<string | null>(null);
  const path = useMemo(() => (focus ? flowPath(graph, focus) : null), [graph, focus]);

  const { flowNodes, flowEdges } = useMemo(() => {
    const flowNodes: Node[] = graph.nodes.map(node => ({
      id: node.id,
      type: node.kind === 'group' ? 'endpointGroup' : 'tile',
      position: { x: node.x, y: node.y },
      width: node.width,
      height: node.height,
      style: { width: node.width, height: node.height },
      data: {
        node,
        dim: !!path && !path.nodes.has(node.id),
        focused: node.id === focus,
        onToggle: onToggleGroup,
      },
      connectable: false,
      draggable: false,
    }));
    const flowEdges: Edge[] = graph.edges.map(edge => {
      const lit = !!path && path.edges.has(edge.id);
      const dim = !!path && !lit;
      const intoGroup = edge.target.startsWith('group:');
      const label =
        edge.label && (lit || intoGroup)
          ? edge.count > 1
            ? `${edge.label} ×${edge.count}`
            : edge.label
          : undefined;
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        pathOptions: { borderRadius: 10 },
        label,
        labelStyle: { fontSize: 10 },
        labelBgPadding: [4, 2] as [number, number],
        markerEnd: { type: MarkerType.ArrowClosed },
        zIndex: lit ? 1 : 0,
        style: {
          strokeWidth: lit ? 2.5 : edge.evidence === 'observed' ? 1.75 : 1.25,
          opacity: dim ? 0.08 : edge.back ? 0.3 : edge.evidence === 'observed' || lit ? 1 : 0.55,
          strokeDasharray: edge.kind === 'auth' ? '6 4' : undefined,
          stroke: lit ? '#0284c7' : undefined,
        },
      };
    });
    return { flowNodes, flowEdges };
  }, [graph, path, focus, onToggleGroup]);

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

  const open = (node: FlowNode) => {
    if (node.kind === 'external' && node.apiHost) navigate(links.api(node.apiHost));
    else if (node.ref) navigate(links.endpoint(node.ref));
  };

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
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-sky-400 bg-sky-50" />
          {t('flow.legend.group', 'Endpoints that take the same value')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-amber-400 bg-amber-50" />
          {t('flow.legend.external', 'Another API domain (opens its page)')}
        </span>
        <span>
          {t(
            'flow.legend.lines',
            'Dashed: credential. Lighter: inferred from the API’s shape. Hover a tile to trace its flow.'
          )}
        </span>
      </div>
      <div
        className="rounded-lg border border-border bg-background"
        style={{ height: Math.min(720, Math.max(280, graph.height + 40)) }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={(_, rfNode) => setFocus(rfNode.id)}
          onNodeMouseLeave={() => setFocus(null)}
          onNodeClick={(_, rfNode) => {
            const node = (rfNode.data as TileData).node;
            if (node.kind === 'group') {
              setFocus(node.id);
              return;
            }
            // Touch: the first tap traces the flow, the second opens the tile.
            if (!canHover() && focus !== node.id) {
              setFocus(node.id);
              return;
            }
            open(node);
          }}
          onPaneClick={() => setFocus(null)}
          nodesConnectable={false}
          nodesDraggable={false}
          fitView
          fitViewOptions={{ padding: 0.1, minZoom: 0.5, maxZoom: 1 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
        >
          <Background />
          <Controls showInteractive={false} />
          {graph.width > MINIMAP_WIDTH ? (
            <MiniMap pannable zoomable className="max-sm:!hidden" />
          ) : null}
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
