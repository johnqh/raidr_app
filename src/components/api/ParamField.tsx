/**
 * One parameter: its documentation and an input chosen by type (via
 * raidr_lib's `paramControl`): text, number, enum Select (with "Other…" when
 * the values are only those seen in use), Switch, list, or JSON TextArea.
 */
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { ApiParam } from '@sudobility/raidr_types';
import { paramControl, paramPlaceholder } from '@sudobility/raidr_lib';
import {
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Text,
  TextArea,
} from '@sudobility/components';

/** Radix Select items cannot have an empty value. */
const UNSET = '__unset__';
const OTHER = '__other__';

interface ParamFieldProps {
  param: ApiParam;
  value: string;
  onChange: (raw: string) => void;
  error: string | null;
}

export function ParamField({ param, value, onChange, error }: ParamFieldProps) {
  const { t } = useTranslation();
  const control = paramControl(param);
  const id = `param-${param.in}-${param.name}`;
  const placeholder = paramPlaceholder(param);
  const [otherMode, setOtherMode] = useState(
    control.kind === 'select' && value !== '' && !control.options.includes(value)
  );

  let input: ReactElement;
  switch (control.kind) {
    case 'select':
      input =
        otherMode && control.allowOther ? (
          <div className="flex gap-2">
            <Input
              id={id}
              value={value}
              placeholder={placeholder}
              onChange={e => onChange(e.target.value)}
            />
            <button
              type="button"
              className="text-xs text-primary underline whitespace-nowrap"
              onClick={() => {
                setOtherMode(false);
                onChange('');
              }}
            >
              {t('param.backToList', 'Pick from list')}
            </button>
          </div>
        ) : (
          <Select
            value={value === '' ? UNSET : value}
            onValueChange={next => {
              if (next === OTHER) {
                setOtherMode(true);
                onChange('');
              } else onChange(next === UNSET ? '' : next);
            }}
          >
            <SelectTrigger id={id} aria-invalid={!!error}>
              <SelectValue placeholder={t('param.choose', 'Choose…')} />
            </SelectTrigger>
            <SelectContent>
              {!param.required ? (
                <SelectItem value={UNSET}>{t('param.notSent', '(not sent)')}</SelectItem>
              ) : null}
              {control.options.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
              {control.allowOther ? (
                <SelectItem value={OTHER}>{t('param.other', 'Other…')}</SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        );
      break;
    case 'switch':
      input = param.required ? (
        <div className="flex items-center gap-2 h-10">
          <Switch
            id={id}
            checked={value === 'true'}
            onCheckedChange={on => onChange(on ? 'true' : 'false')}
          />
          <Text size="sm" color="muted">
            {value === 'true' ? 'true' : 'false'}
          </Text>
        </div>
      ) : (
        <Select
          value={value === '' ? UNSET : value}
          onValueChange={next => onChange(next === UNSET ? '' : next)}
        >
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UNSET}>{t('param.notSent', '(not sent)')}</SelectItem>
            <SelectItem value="true">true</SelectItem>
            <SelectItem value="false">false</SelectItem>
          </SelectContent>
        </Select>
      );
      break;
    case 'number':
      input = (
        <Input
          id={id}
          type="number"
          inputMode={control.integer ? 'numeric' : 'decimal'}
          step={control.integer ? 1 : 'any'}
          value={value}
          placeholder={placeholder}
          aria-invalid={!!error}
          onChange={e => onChange(e.target.value)}
          {...(param.minimum !== undefined ? { min: param.minimum } : {})}
          {...(param.maximum !== undefined ? { max: param.maximum } : {})}
        />
      );
      break;
    case 'json':
      input = (
        <TextArea
          value={value}
          onChange={onChange}
          rows={4}
          placeholder={placeholder}
          className="font-mono text-sm"
        />
      );
      break;
    case 'list':
      input = (
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          aria-invalid={!!error}
          onChange={e => onChange(e.target.value)}
        />
      );
      break;
    default:
      input = (
        <Input
          id={id}
          type={control.inputType}
          value={value}
          placeholder={placeholder}
          aria-invalid={!!error}
          onChange={e => onChange(e.target.value)}
          {...(param.maxLength !== undefined ? { maxLength: param.maxLength } : {})}
        />
      );
  }

  return (
    <div className="grid gap-1.5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-4 py-3 border-b border-border last:border-0 [&>*]:min-w-0">
      <div>
        <Label htmlFor={id} className="font-mono text-sm break-all">
          {param.wireName ?? param.name}
          {param.required ? <span className="text-destructive"> *</span> : null}
        </Label>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge size="sm" variant="default">
            {param.in}
          </Badge>
          <Badge size="sm" variant="default" outline>
            {param.type === 'array' ? `${param.itemType ?? 'string'}[]` : param.type}
            {param.format ? ` · ${param.format}` : ''}
          </Badge>
        </div>
      </div>
      <div>
        {input}
        {param.description ? (
          <Text size="xs" color="muted" className="mt-1">
            {param.description}
          </Text>
        ) : null}
        {control.kind === 'list' ? (
          <Text size="xs" color="muted" className="mt-1">
            {t('param.listHint', 'Separate values with commas.')}
          </Text>
        ) : null}
        {error ? (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
