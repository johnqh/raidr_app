/**
 * @fileoverview List and create organizations (entity_pages' EntityListPage).
 */
import { useNavigate, useParams } from 'react-router-dom';
import { EntityListPage } from '@sudobility/entity_pages';
import type { EntityWithRole } from '@sudobility/entity_client';
import { useEntityClient } from '@/config/entityClient';

export default function WorkspacesPage() {
  const navigate = useNavigate();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const client = useEntityClient();
  return (
    <EntityListPage
      client={client}
      onSelectEntity={(entity: EntityWithRole) =>
        navigate(`/${lang}/dashboard/${entity.entitySlug}/api-keys`)
      }
    />
  );
}
