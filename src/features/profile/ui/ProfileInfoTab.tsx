import { Pencil } from 'lucide-react';
import type { ChildProfile } from '@/shared/types/childProfile';
import type { MatchedJob, PersonalityAxis } from '@/shared/types/job';
import { AIResultCard } from '@/shared/ui/AIResultCard';
import { Button } from '@/shared/ui/Button';

type ProfileInfoTabProps = {
  childProfile: ChildProfile;
  lastSurveyDate: string;
  personalityAxes: PersonalityAxis[];
  personalitySummary: string;
  matchedJobs: MatchedJob[];
};

type InfoRowProps = { label: string; value: string };

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-gray-100 last:border-b-0">
      <dt className="w-[140px] shrink-0 text-[0.875rem] text-gray-500">
        {label}
      </dt>
      <dd className="text-[0.875rem] text-gray-900">{value}</dd>
    </div>
  );
}

type SectionProps = { id: string; title: string; children: React.ReactNode };

function Section({ id, title, children }: SectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2
        id={id}
        className="mb-5 border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ProfileInfoTab({
  childProfile,
  lastSurveyDate,
  personalityAxes,
  personalitySummary,
  matchedJobs,
}: ProfileInfoTabProps) {
  const region1Label = `${childProfile.region1.city} ${childProfile.region1.district}`;
  const region2Label = childProfile.region2
    ? `${childProfile.region2.city} ${childProfile.region2.district}`
    : '없음';

  return (
    <div className="flex flex-col gap-6">
      {/* 프로필 헤더 */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.125rem] font-bold leading-[1.35] text-gray-900">
            {childProfile.name}님의 자녀 프로필
          </h1>
          <p className="mt-1 text-[0.875rem] text-gray-500">
            마지막 검사일: {lastSurveyDate}
          </p>
        </div>
        <Button variant="secondary" size="sm" type="button">
          <Pencil size={16} strokeWidth={1.5} aria-hidden="true" />
          프로필 수정
        </Button>
      </header>

      {/* AI 성향 분석 결과 */}
      <section aria-labelledby="ai-result-heading">
        <AIResultCard
          childName={childProfile.name}
          axes={personalityAxes}
          summary={personalitySummary}
          jobs={matchedJobs}
        />
      </section>

      {/* 기본 정보 */}
      <Section id="basic-info-heading" title="기본 정보">
        <dl>
          <InfoRow label="이름" value={childProfile.name} />
          <InfoRow label="만 나이" value={`${childProfile.age}세`} />
          <InfoRow label="성별" value={childProfile.gender} />
          <InfoRow label="최종학력" value={childProfile.education} />
          <InfoRow label="희망 지역 1순위" value={region1Label} />
          <InfoRow label="희망 지역 2순위" value={region2Label} />
          <InfoRow
            label="이동 경로 베리어 프리"
            value={childProfile.barrierFree ? '해당' : '해당 없음'}
          />
        </dl>
      </Section>

      {/* 신체 조건 */}
      <Section id="physical-info-heading" title="신체 조건">
        <dl>
          <InfoRow label="장애 유형" value={childProfile.disabilityType} />
          <InfoRow label="장애 등급" value={childProfile.disabilityGrade} />
          <InfoRow label="이동" value={childProfile.mobility} />
          <InfoRow label="손 사용" value={childProfile.handUse} />
          <InfoRow label="체력" value={childProfile.stamina} />
          <InfoRow label="말하기" value={childProfile.speaking} />
          <InfoRow
            label="지시 이해"
            value={childProfile.instructionUnderstanding}
          />
        </dl>
      </Section>

      {/* 희망 활동 유형 */}
      <Section id="activity-heading" title="희망 활동 유형">
        <ul className="flex flex-wrap gap-2" aria-label="선택된 희망 활동 유형">
          {childProfile.preferredActivities.map((activity) => (
            <li
              key={activity}
              className="inline-flex h-6 items-center rounded-sm bg-primary-tag px-2 text-[0.75rem] font-semibold text-primary-pressed"
            >
              {activity}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
