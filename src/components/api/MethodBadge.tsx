import type { HttpMethod } from '@sudobility/raidr_types';
import { Badge, type BadgeProps } from '@sudobility/components';

const VARIANT: Record<HttpMethod, NonNullable<BadgeProps['variant']>> = {
  GET: 'info',
  POST: 'success',
  PUT: 'warning',
  PATCH: 'warning',
  DELETE: 'danger',
};

/** HTTP method, colored by effect (reads blue, writes green/amber, deletes red). */
export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <Badge variant={VARIANT[method]} size="sm" className="font-mono min-w-[3.75rem] justify-center">
      {method}
    </Badge>
  );
}
