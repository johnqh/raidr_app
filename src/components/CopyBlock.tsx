import { CodeBlock } from '@sudobility/components';

interface CopyBlockProps {
  code: string;
  language?: string;
  title?: string;
}

/** Monospace block with the design system's copy button. */
export function CopyBlock({ code, language = 'bash', title }: CopyBlockProps) {
  return (
    <CodeBlock
      code={code}
      language={language}
      {...(title ? { title, showHeader: true } : { showHeader: false })}
      showCopy
      className="my-2"
    />
  );
}
