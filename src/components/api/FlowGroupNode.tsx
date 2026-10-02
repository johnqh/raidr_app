import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { GROUP_PREVIEW_ROWS, type FlowNode } from '@sudobility/raidr_lib';
import { LocalizedLink } from '@/components/layout/LocalizedLink';
import { links } from '@/config/links';

/**
 * Members' paths without the segments they all share, so rows show what
 * tells them apart: `/v2/accounts/{accountId}/withdrawals/{id}/docs` →
 * `…/{id}/docs`.
 */
function distinctPaths(paths: string[]): string[] {
  const split = paths.map(p => p.split('/'));
  const shortest = Math.min(...split.map(s => s.length));
  let shared = 0;
  while (shared < shortest - 1 && split.every(s => s[shared] === split[0]?.[shared])) shared++;
  if (shared <= 1 || paths.length < 2) return paths;
  return split.map(s => `…/${s.slice(shared).join('/')}`);
}

export interface FlowGroupData extends Record<string, unknown> {
  node: FlowNode;
  dim: boolean;
  onToggle: (groupId: string) => void;
}

/**
 * A group tile: endpoints one source feeds the same value to, listed as
 * rows. Each row opens its playground; "+N more" expands the tile and the
 * map re-lays itself out around the taller tile.
 */
export function FlowGroupNode({ data }: NodeProps) {
  const { node, dim, onToggle } = data as FlowGroupData;
  const { t } = useTranslation();
  const members = node.members ?? [];
  const shown = node.expanded ? members : members.slice(0, GROUP_PREVIEW_ROWS);
  const more = members.length - shown.length;
  const paths = distinctPaths(members.map(m => m.detail.slice(m.method.length + 1)));
  const pathOf = new Map(members.map((m, i) => [m.detail, paths[i] ?? m.detail]));
  return (
    <div
      className={`h-full w-full rounded-md border-2 border-sky-400 bg-sky-50 text-sky-950 shadow-sm dark:bg-sky-950/40 dark:text-sky-100 transition-opacity ${dim ? 'opacity-15' : ''}`}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <div className="px-3 pt-2 pb-1 text-sm font-semibold leading-tight truncate">
        {node.label} · {members.length}
      </div>
      <ul className="px-1.5">
        {shown.map(m => (
          <li key={m.detail}>
            {m.ref ? (
              <LocalizedLink
                to={links.endpoint(m.ref)}
                className="nodrag nopan flex h-[26px] items-center gap-2 rounded px-1.5 hover:bg-sky-100 dark:hover:bg-sky-900/50"
                title={`${m.label}\n${m.detail}`}
              >
                <span className="w-12 shrink-0 font-mono text-[10px] font-semibold opacity-70">
                  {m.method}
                </span>
                <span className="truncate font-mono text-[11px]">{pathOf.get(m.detail)}</span>
              </LocalizedLink>
            ) : (
              <span className="flex h-[26px] items-center px-1.5 font-mono text-[11px] truncate">
                {m.detail}
              </span>
            )}
          </li>
        ))}
        {more > 0 || node.expanded ? (
          <li>
            <button
              type="button"
              className="nodrag nopan h-[26px] w-full rounded px-1.5 text-left text-xs font-medium underline-offset-2 hover:underline"
              onClick={event => {
                event.stopPropagation();
                onToggle(node.id);
              }}
            >
              {node.expanded
                ? t('flow.less', 'Show fewer')
                : t('flow.more', '+{{count}} more', { count: more })}
            </button>
          </li>
        ) : null}
      </ul>
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </div>
  );
}
