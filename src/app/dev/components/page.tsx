'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Radio, RadioGroup } from '@/shared/ui/Radio';
import { FitBadge } from '@/shared/ui/FitBadge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { JobCard } from '@/shared/ui/JobCard';
import { AIResultCard } from '@/shared/ui/AIResultCard';
import { DevStatePanel } from '@/shared/ui/DevStatePanel';
import type {
  JobPosting,
  MatchedJob,
  PersonalityAxis,
} from '@/shared/types/job';

/* ─── 샘플 데이터 ────────────────────────────────────────────────── */

const SAMPLE_JOB: JobPosting = {
  id: 1,
  companyName: '(주)행복한일터',
  title:
    '사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)사무보조 직원 모집 (장애인 우대)',
  workType: '온·오프라인',
  location: '서울 강남구',
  salary: '월 220만원',
  deadline: '2026-05-31',
  views: 1240,
  fitLevel: '잘 맞아요',
  matchPoints: '꼼꼼한 성격, 문서 작성 능력',
  bookmarked: false,
};

const SAMPLE_MATCHED_JOBS: MatchedJob[] = [
  { id: 1, name: '사무보조', matchRate: 92, fitLevel: '잘 맞아요' },
  { id: 2, name: '데이터 입력', matchRate: 78, fitLevel: '도전해볼 수 있어요' },
  { id: 3, name: '콜센터 상담원', matchRate: 55, fitLevel: '힘들 수 있어요' },
];

const SAMPLE_AXES: PersonalityAxis[] = [
  { subject: '집중력', value: 85, fullMark: 100 },
  { subject: '협업', value: 60, fullMark: 100 },
  { subject: '창의성', value: 40, fullMark: 100 },
  { subject: '체력', value: 70, fullMark: 100 },
  { subject: '꼼꼼함', value: 90, fullMark: 100 },
];

/* ─── 섹션 래퍼 ──────────────────────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-l-[3px] border-primary pl-3 text-[1rem] font-semibold text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[0.75rem] font-semibold text-gray-400">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/* ─── 페이지 ─────────────────────────────────────────────────────── */

export default function ComponentsDevPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [destructiveModalOpen, setDestructiveModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [radioValue, setRadioValue] = useState('a');
  const [checked, setChecked] = useState(false);

  const jobWithToggle: JobPosting = {
    ...SAMPLE_JOB,
    bookmarked,
  };

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-12 px-4 py-12">
      <div>
        <h1 className="text-[1.5rem] font-bold text-gray-900">
          컴포넌트 쇼케이스
        </h1>
        <p className="mt-1 text-[0.875rem] text-gray-500">
          shared/ui 컴포넌트의 모든 상태를 확인하는 개발용 페이지입니다.
        </p>
      </div>

      {/* ── Button ──────────────────────────────────────────────── */}
      <Section title="Button">
        <Row label="variant">
          <Button variant="primary">primary</Button>
          <Button variant="secondary">secondary</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="destructive">destructive</Button>
        </Row>
        <Row label="size">
          <Button size="lg">Large</Button>
          <Button size="md">Medium</Button>
          <Button size="sm">Small</Button>
        </Row>
        <Row label="disabled">
          <Button variant="primary" disabled>
            primary
          </Button>
          <Button variant="secondary" disabled>
            secondary
          </Button>
          <Button variant="ghost" disabled>
            ghost
          </Button>
        </Row>
      </Section>

      {/* ── Input ───────────────────────────────────────────────── */}
      <Section title="Input">
        <Row label="기본">
          <div className="w-64">
            <Input placeholder="입력하세요" />
          </div>
        </Row>
        <Row label="label + hint">
          <div className="w-64">
            <Input
              label="이름"
              hint="실명을 입력하세요"
              placeholder="홍길동"
              required
            />
          </div>
        </Row>
        <Row label="error">
          <div className="w-64">
            <Input
              label="이메일"
              error="올바른 이메일 형식이 아닙니다"
              defaultValue="invalid-email"
            />
          </div>
        </Row>
        <Row label="size">
          <div className="w-48">
            <Input size="lg" placeholder="Large (h-12)" />
          </div>
          <div className="w-48">
            <Input size="md" placeholder="Medium (h-10)" />
          </div>
        </Row>
        <Row label="disabled">
          <div className="w-64">
            <Input label="비활성" disabled defaultValue="수정 불가" />
          </div>
        </Row>
      </Section>

      {/* ── Checkbox ────────────────────────────────────────────── */}
      <Section title="Checkbox">
        <Row label="기본">
          <Checkbox
            label="동의합니다"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        </Row>
        <Row label="checked (제어)">
          <Checkbox label="항상 체크됨" checked readOnly />
        </Row>
        <Row label="error">
          <Checkbox label="필수 항목" error="필수 항목에 동의해주세요" />
        </Row>
        <Row label="disabled">
          <Checkbox label="비활성 (미체크)" disabled />
          <Checkbox label="비활성 (체크됨)" checked disabled readOnly />
        </Row>
      </Section>

      {/* ── Radio ───────────────────────────────────────────────── */}
      <Section title="Radio / RadioGroup">
        <Row label="RadioGroup">
          <RadioGroup label="근무 형태" required>
            <Radio
              label="온라인"
              name="workType"
              value="a"
              checked={radioValue === 'a'}
              onChange={() => setRadioValue('a')}
            />
            <Radio
              label="오프라인"
              name="workType"
              value="b"
              checked={radioValue === 'b'}
              onChange={() => setRadioValue('b')}
            />
            <Radio
              label="온·오프라인"
              name="workType"
              value="c"
              checked={radioValue === 'c'}
              onChange={() => setRadioValue('c')}
            />
          </RadioGroup>
        </Row>
        <Row label="error">
          <RadioGroup label="선택 필요" error="항목을 선택해주세요">
            <Radio label="옵션 A" name="radioError" />
            <Radio label="옵션 B" name="radioError" />
          </RadioGroup>
        </Row>
        <Row label="disabled">
          <Radio label="비활성" name="radioDisabled" disabled />
          <Radio
            label="비활성 (선택됨)"
            name="radioDisabled"
            checked
            disabled
            readOnly
          />
        </Row>
      </Section>

      {/* ── FitBadge ────────────────────────────────────────────── */}
      <Section title="FitBadge">
        <Row label="level">
          <FitBadge level="잘 맞아요" />
          <FitBadge level="도전해볼 수 있어요" />
          <FitBadge level="힘들 수 있어요" />
        </Row>
      </Section>

      {/* ── Skeleton ────────────────────────────────────────────── */}
      <Section title="Skeleton">
        <Row label="기본">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </Row>
        <Row label="카드형">
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-gray-200 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Row>
      </Section>

      {/* ── ConfirmModal ────────────────────────────────────────── */}
      <Section title="ConfirmModal">
        <Row label="variant">
          <Button onClick={() => setModalOpen(true)}>기본 모달 열기</Button>
          <Button
            variant="destructive"
            onClick={() => setDestructiveModalOpen(true)}
          >
            삭제 모달 열기
          </Button>
        </Row>
        {modalOpen && (
          <ConfirmModal
            title="검사를 다시 진행하시겠어요?"
            description="이전 검사 결과가 초기화되고 새로 진행됩니다. 계속하시겠어요?"
            confirmLabel="다시 검사하기"
            onConfirm={() => setModalOpen(false)}
            onClose={() => setModalOpen(false)}
          />
        )}
        {destructiveModalOpen && (
          <ConfirmModal
            title="계정을 삭제하시겠어요?"
            description="계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다."
            confirmLabel="삭제하기"
            variant="destructive"
            onConfirm={() => setDestructiveModalOpen(false)}
            onClose={() => setDestructiveModalOpen(false)}
          />
        )}
      </Section>

      {/* ── JobCard ─────────────────────────────────────────────── */}
      <Section title="JobCard">
        <Row label="bookmarked = false / true (클릭 가능)">
          <div className="w-full max-w-sm">
            <JobCard
              job={jobWithToggle}
              onBookmarkToggle={() => setBookmarked((v) => !v)}
            />
          </div>
          <div className="w-full max-w-sm">
            <JobCard
              job={{
                ...SAMPLE_JOB,
                fitLevel: '도전해볼 수 있어요',
                bookmarked: true,
              }}
              onBookmarkToggle={() => {}}
            />
          </div>
          <div className="w-full max-w-sm">
            <JobCard
              job={{
                ...SAMPLE_JOB,
                fitLevel: '힘들 수 있어요',
                bookmarked: false,
              }}
              onBookmarkToggle={() => {}}
            />
          </div>
        </Row>
      </Section>

      {/* ── AIResultCard ─────────────────────────────────────────── */}
      <Section title="AIResultCard">
        <Row label="기본">
          <div className="w-full">
            <AIResultCard
              childName="김지수"
              axes={SAMPLE_AXES}
              summary="반복적이고 정확한 업무 처리에 강점이 있으며, 혼자 집중할 수 있는 환경에서 높은 성과를 냅니다."
              jobs={SAMPLE_MATCHED_JOBS}
            />
          </div>
        </Row>
      </Section>

      <DevStatePanel />
    </div>
  );
}
