/**
 * @fileoverview EntityClient for the entity and API-key pages.
 *
 * Uses `useApi()`'s network client from building_blocks, a
 * FirebaseAuthNetworkService that adds the signed-in user's token and JSON
 * content type to every request. raidr_api validates bodies with zod, so the
 * content type matters. raidr_api serves the entity routes under /api/v1.
 */
import { useMemo } from 'react';
import { EntityClient } from '@sudobility/entity_client';
import { useApi } from '@sudobility/building_blocks/firebase';
import { CONSTANTS } from './constants';

/** A memoized EntityClient bound to raidr_api and the signed-in session. */
export function useEntityClient(): EntityClient {
  const { networkClient } = useApi();
  return useMemo(
    () => new EntityClient({ baseUrl: `${CONSTANTS.API_URL}/api/v1`, networkClient }),
    [networkClient]
  );
}
