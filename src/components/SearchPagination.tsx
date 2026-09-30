import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Text } from '@sudobility/components';

interface SearchPaginationProps {
  search: string;
  onSearch: (value: string) => void;
  page: number;
  pageCount: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPage: (page: number) => void;
  placeholder?: string;
}

export function SearchBar({ search, onSearch, placeholder }: Pick<SearchPaginationProps, 'search' | 'onSearch' | 'placeholder'>) {
  const [draft, setDraft] = useState(search);
  useEffect(() => {
    const id = setTimeout(() => {
      if (draft !== search) onSearch(draft);
    }, 300);
    return () => clearTimeout(id);
  }, [draft, search, onSearch]);
  return (
    <Input
      type="search"
      value={draft}
      onChange={e => setDraft(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="max-w-md"
    />
  );
}

export function Pagination({
  page,
  pageCount,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onPage,
}: Omit<SearchPaginationProps, 'search' | 'onSearch' | 'placeholder'>) {
  const { t } = useTranslation();
  if (totalCount === 0) return null;
  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <Text size="sm" color="muted">
        {t('pagination.summary', '{{count}} results · page {{page}} of {{pageCount}}', {
          count: totalCount,
          page: page + 1,
          pageCount,
        })}
      </Text>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={!hasPreviousPage} onClick={() => onPage(page - 1)}>
          {t('pagination.previous', 'Previous')}
        </Button>
        <Button variant="outline" size="sm" disabled={!hasNextPage} onClick={() => onPage(page + 1)}>
          {t('pagination.next', 'Next')}
        </Button>
      </div>
    </div>
  );
}
