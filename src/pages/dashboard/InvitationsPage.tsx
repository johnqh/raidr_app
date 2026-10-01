/**
 * @fileoverview Invitations addressed to the signed-in user (entity_pages' InvitationsPage).
 */
import { useQueryClient } from '@tanstack/react-query';
import { InvitationsPage as InvitationsPageComponent } from '@sudobility/entity_pages';
import { useEntityClient } from '@/config/entityClient';

export default function InvitationsPage() {
  const client = useEntityClient();
  const queryClient = useQueryClient();
  return (
    <InvitationsPageComponent
      client={client}
      onInvitationAccepted={() => queryClient.invalidateQueries({ queryKey: ['entities'] })}
    />
  );
}
