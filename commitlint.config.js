module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능
        'fix', // 버그 수정
        'docs', // 문서 수정
        'style', // 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
        'refactor', // 코드 리팩토링
        'perf', // 성능 개선
        'test', // 테스트 코드
        'chore', // 빌드 업무 수정, 패키지 매니저 설정 등
        'ci', // CI 설정 파일 수정
        'build', // 빌드 시스템 또는 외부 의존성 변경
        'revert', // 이전 커밋 되돌리기
        'core', // 핵심 기능 관련 변경사항
        'design', // ui/ux 디자인
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    // 이슈 번호 검증 규칙 추가
    'issue-reference-required': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'issue-reference-required': ({ raw }) => {
          // #123 형식의 이슈 번호를 찾습니다
          const issuePattern = /#\d+/;
          const hasIssue = issuePattern.test(raw);

          return [hasIssue, '커밋 메시지에 이슈 번호(#123)를 포함해야 합니다.'];
        },
      },
    },
  ],
};
