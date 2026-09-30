import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** SKILL.md renderer. Styles live under `.skill-markdown` in index.css. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="skill-markdown min-w-0 break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
