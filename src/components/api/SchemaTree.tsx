import type { ApiJsonSchema } from '@sudobility/raidr_types';

/** Type label for a schema: `string`, `integer | null`, `array of object`, `one of 2`. */
function typeLabel(schema: ApiJsonSchema): string {
  if (schema.anyOf?.length) return `one of ${schema.anyOf.length}`;
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
  const main = types.join(' | ') || 'any';
  if (types.includes('array') && schema.items) return `array of ${typeLabel(schema.items)}`;
  return schema.format ? `${main} (${schema.format})` : main;
}

/** The fields nested under a schema: object properties, array items' properties, union branches. */
function childrenOf(schema: ApiJsonSchema): Array<[string, ApiJsonSchema, boolean]> {
  const target = schema.items?.properties ? schema.items : schema;
  const required = new Set(target.required ?? []);
  const fields = Object.entries(target.properties ?? {}).map(
    ([name, child]) => [name, child, required.has(name)] as [string, ApiJsonSchema, boolean]
  );
  const branches = (schema.anyOf ?? []).map(
    (branch, i) => [`option ${i + 1}`, branch, false] as [string, ApiJsonSchema, boolean]
  );
  return [...fields, ...branches];
}

function Field({
  name,
  schema,
  required,
  depth,
}: {
  name: string;
  schema: ApiJsonSchema;
  required: boolean;
  depth: number;
}) {
  const children = depth < 8 ? childrenOf(schema) : [];
  return (
    <li className="py-1">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-muted-foreground">{typeLabel(schema)}</span>
        {required ? <span className="text-xs text-destructive">required</span> : null}
        {schema.enum?.length ? (
          <span className="font-mono text-xs text-muted-foreground">
            {schema.enum.map(v => JSON.stringify(v)).join(' · ')}
          </span>
        ) : null}
      </div>
      {schema.description ? (
        <p className="text-sm text-muted-foreground">{schema.description}</p>
      ) : null}
      {children.length > 0 ? (
        <ul className="ml-4 border-l border-border pl-3">
          {children.map(([childName, child, childRequired]) => (
            <Field
              key={childName}
              name={childName}
              schema={child}
              required={childRequired}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** A JSON Schema as a nested field list: name, type, required, allowed values and description. */
export function SchemaTree({ schema }: { schema: ApiJsonSchema }) {
  const children = childrenOf(schema);
  if (children.length === 0) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        {typeLabel(schema)}
        {schema.description ? ` — ${schema.description}` : ''}
      </p>
    );
  }
  return (
    <div>
      {schema.description ? (
        <p className="mb-1 text-sm text-muted-foreground">{schema.description}</p>
      ) : null}
      <ul>
        {children.map(([name, child, required]) => (
          <Field key={name} name={name} schema={child} required={required} depth={0} />
        ))}
      </ul>
    </div>
  );
}
