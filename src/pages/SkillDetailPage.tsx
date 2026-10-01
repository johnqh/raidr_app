import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Heading, Text } from '@sudobility/components';
import { useSkill } from '@sudobility/raidr_lib';
import { LocalizedLink } from '@/components/layout/LocalizedLink';
import { Section } from '@/components/layout/Section';
import { EmptyState, ErrorState, Loading } from '@/components/PageState';
import { CopyBlock } from '@/components/CopyBlock';
import { Markdown } from '@/components/Markdown';
import { useApi } from '@sudobility/building_blocks/firebase';

/** `/:lang/skills/:apiHost`: SKILL.md rendered, with download and install commands. */
export default function SkillDetailPage() {
  const { t } = useTranslation();
  const { apiHost = '' } = useParams();
  const api = useApi();
  const { skill, install, hasMcp, isLoading, notFound, error } = useSkill({ ...api, apiHost });

  if (isLoading) return <Loading />;
  if (error) return <ErrorState error={error} />;
  if (notFound || !skill || !install) {
    return (
      <EmptyState
        title={t('skill.notFound', 'No skill published for {{host}}', { host: apiHost })}
      />
    );
  }

  return (
    <>
      <Section spacing="lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <Heading level={1} size="3xl">
              {skill.name}
            </Heading>
            <code className="font-mono text-sm text-muted-foreground">{skill.api_host}</code>
            {skill.description ? (
              <Text color="muted" className="mt-3 max-w-3xl">
                {skill.description}
              </Text>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={install.markdownUrl} download="SKILL.md">
              <Button>{t('skill.download', 'Download SKILL.md')}</Button>
            </a>
            {hasMcp ? (
              <LocalizedLink to={`/mcps/${encodeURIComponent(apiHost)}`}>
                <Button variant="outline">{t('skill.openMcp', 'Open the MCP server')}</Button>
              </LocalizedLink>
            ) : null}
          </div>
        </div>
      </Section>

      <Section spacing="md">
        <Heading level={2} size="2xl" className="mb-3">
          {t('skill.installTitle', 'Install')}
        </Heading>
        <Text color="muted" className="mb-2">
          {t(
            'skill.installOne',
            'Run this once, then start a new Claude Code session. The first time the skill runs it asks for your raidr API key and saves it to ~/.raidr/config.json.'
          )}
        </Text>
        <CopyBlock code={install.command} />
      </Section>

      <Section spacing="md">
        <Heading level={2} size="2xl" className="mb-3">
          {t('skill.contentTitle', 'SKILL.md')}
        </Heading>
        <Markdown>{skill.markdown}</Markdown>
      </Section>
    </>
  );
}
