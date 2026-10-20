import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Inline formatting: **bold**, `code` and [links](url). Internal links stay in the app. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index++}`;
    if (match[1]) parts.push(<strong key={key}>{match[1]}</strong>);
    else if (match[2]) parts.push(<code key={key} className="rounded bg-secondary px-1 py-0.5 text-[0.9em]">{match[2]}</code>);
    else {
      const href = match[4];
      const className = 'font-medium text-primary underline underline-offset-2';
      parts.push(
        href.startsWith('/') ? (
          <Link key={key} href={href} className={className}>{match[3]}</Link>
        ) : /^https?:\/\//.test(href) ? (
          <a key={key} href={href} target="_blank" rel="noreferrer" className={className}>{match[3]}</a>
        ) : (
          match[3]
        ),
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

type Block = { kind: 'h2' | 'h3' | 'p'; text: string } | { kind: 'ul' | 'ol'; items: string[] };

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ kind: 'p', text: paragraph.join(' ') });
    paragraph = [];
  };
  for (const raw of source.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (!line) {
      flush();
    } else if (line.startsWith('### ')) {
      flush();
      blocks.push({ kind: 'h3', text: line.slice(4) });
    } else if (line.startsWith('## ')) {
      flush();
      blocks.push({ kind: 'h2', text: line.slice(3) });
    } else if (bullet || numbered) {
      flush();
      const kind = bullet ? 'ul' : 'ol';
      const item = (bullet ?? numbered)![1];
      const previous = blocks.at(-1);
      if (previous && previous.kind === kind) previous.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

/**
 * Renders the help center's light Markdown (## headings, lists, **bold**,
 * `code`, [links](url)) as React elements, never as raw HTML.
 */
export const LightMarkdown = ({ source, className }: { source: string; className?: string }) => (
  <div className={cn('space-y-3 text-sm leading-relaxed', className)}>
    {parse(source).map((block, index) => {
      const key = String(index);
      switch (block.kind) {
        case 'h2':
          return <h2 key={key} className="pt-3 text-lg font-bold">{inline(block.text, key)}</h2>;
        case 'h3':
          return <h3 key={key} className="pt-2 font-bold">{inline(block.text, key)}</h3>;
        case 'ul':
          return (
            <ul key={key} className="list-disc space-y-1 ps-5">
              {block.items.map((item, i) => <li key={i}>{inline(item, `${key}-${i}`)}</li>)}
            </ul>
          );
        case 'ol':
          return (
            <ol key={key} className="list-decimal space-y-1 ps-5">
              {block.items.map((item, i) => <li key={i}>{inline(item, `${key}-${i}`)}</li>)}
            </ol>
          );
        default:
          return <p key={key}>{inline(block.text, key)}</p>;
      }
    })}
  </div>
);
