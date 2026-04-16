# 위키 동기화 규칙

Claude Code가 위키를 직접 편집할 때 반드시 따른다.
위키는 `/ship` 커맨드가 아닌 별도 요청 시에만 작성한다.

---

## 위키 레포 정보

| 항목 | 값 |
|------|----|
| 원격 레포 | `matchzoom/matchzoom.wiki` |
| 로컬 경로 | `/tmp/matchzoom.wiki/` |
| clone 명령 | `gh repo clone matchzoom/matchzoom.wiki /tmp/matchzoom.wiki` |

---

## 위키 레포 준비

```bash
# 이미 clone된 경우 pull, 없으면 clone
if [ -d /tmp/matchzoom.wiki ]; then
  git -C /tmp/matchzoom.wiki pull
else
  gh repo clone matchzoom/matchzoom.wiki /tmp/matchzoom.wiki
fi
```

---

## 위키 파일 구조

```
/tmp/matchzoom.wiki/
├── Home.md           ← 전체 인덱스
├── 프로젝트-구조.md
├── 하네스-구조.md
├── 디자인-방식.md
├── 퍼블-구현-방식.md
└── PR-방식.md
```

PR별 개별 페이지는 만들지 않는다.

---

## Home.md 구조

```markdown
# 마주봄 Wiki

> 설명

---

## 프로젝트 개요 문서

- [페이지명](./파일명) — 한 줄 설명
```

---

## 개요 문서 작성 규칙

1. **한 뭉탱이 금지** — 내용이 여러 영역에 걸치면 `###` 서브타이틀로 반드시 분리
2. **사실 기반** — 추측이나 제안 없이 실제 내용만 기술
3. **간결하게** — 각 섹션은 핵심만, 불필요한 수식어 금지
4. **한국어** — 전체 한국어 작성 (코드·파일명·기술 용어 제외)

---

## push 방법

```bash
cd /tmp/matchzoom.wiki
git config user.name "aahreum"
git config user.email "cocoding420@gmail.com"
git add -A
git commit -m "docs: 위키 업데이트"
TOKEN=$(gh auth token)
git push "https://${TOKEN}@github.com/matchzoom/matchzoom.wiki.git" HEAD:master
```
