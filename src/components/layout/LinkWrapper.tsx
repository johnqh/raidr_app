import { LocalizedLink } from './LocalizedLink';

/** `{ href }` link adapter that building_blocks' top bar and footer expect. */
export const LinkWrapper = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <LocalizedLink to={href} className={className}>
    {children}
  </LocalizedLink>
);
