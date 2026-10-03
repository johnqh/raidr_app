/**
 * @fileoverview Invitations addressed to the signed-in user (entity_pages' InvitationsPage).
 *
 * Accepting one refreshes this user's workspace list by itself
 * (entity_client's `useAcceptInvitation`), so nothing is invalidated here.
 */
import { InvitationsPage as InvitationsPageComponent } from '@sudobility/entity_pages';
import { useEntityClient } from '@/config/entityClient';

export default function InvitationsPage() {
  const client = useEntityClient();
  return <InvitationsPageComponent client={client} />;
}
