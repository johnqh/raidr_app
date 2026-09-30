import { useTranslation } from 'react-i18next';
import { Badge, Text } from '@sudobility/components';
import type { McpTool } from '@sudobility/raidr_types';
import { formatToolRequest, isMutatingTool, toolInputFields } from '@sudobility/raidr_lib';

/**
 * Manifest tools as a table: name (with a badge when mutating), request line,
 * inputs with their location, description. Formatting comes from raidr_lib;
 * the wrapper scrolls horizontally on narrow screens.
 */
export function ToolsTable({ tools }: { tools: McpTool[] }) {
  const { t } = useTranslation();
  if (tools.length === 0) {
    return <Text color="muted">{t('mcp.noTools', 'This manifest has no tools.')}</Text>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2 pr-4 font-medium">{t('mcp.tool', 'Tool')}</th>
            <th className="py-2 pr-4 font-medium">{t('mcp.request', 'Request')}</th>
            <th className="py-2 pr-4 font-medium">{t('mcp.inputs', 'Inputs')}</th>
            <th className="py-2 font-medium">{t('mcp.description', 'Description')}</th>
          </tr>
        </thead>
        <tbody>
          {tools.map(tool => {
            const fields = toolInputFields(tool);
            return (
              <tr key={tool.name} className="border-b border-border align-top">
                <td className="py-3 pr-4 whitespace-nowrap">
                  <code className="font-mono">{tool.name}</code>
                  {isMutatingTool(tool) ? (
                    <Badge variant="warning" size="sm" className="ml-2">
                      {t('mcp.mutates', 'mutates')}
                    </Badge>
                  ) : null}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <code className="font-mono text-xs">{formatToolRequest(tool)}</code>
                </td>
                <td className="py-3 pr-4">
                  {fields.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <ul className="space-y-0.5">
                      {fields.map(f => (
                        <li key={f.name} className="font-mono text-xs">
                          {f.name}
                          {f.required ? '' : '?'}: {f.type}{' '}
                          <span className="text-muted-foreground">({f.location})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="py-3 min-w-[16rem]">{tool.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
