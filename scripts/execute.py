#!/usr/bin/env python3
"""
execute.py — 마주봄 Harness 파이프라인 러너

Usage:
    python scripts/execute.py           → 현재 페이즈 내용 출력
    python scripts/execute.py next      → 다음 페이즈로 전진
    python scripts/execute.py status    → status.json 출력
    python scripts/execute.py reset     → 페이즈 1로 초기화 (확인 필요)
    python scripts/execute.py goto <n>  → 특정 페이즈로 이동
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).parent.parent
STATUS_FILE = ROOT / "status.json"
PHASES_DIR = ROOT / "phases"

PHASE_ORDER = [
    "phase-01-foundation.md",
    "phase-02-supabase.md",
    "phase-03-survey.md",
    "phase-04-dashboard.md",
    "phase-05-ai-matching.md",
]


def load_status() -> dict:
    with open(STATUS_FILE, encoding="utf-8") as f:
        return json.load(f)


def save_status(data: dict) -> None:
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    with open(STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("[execute] status.json 업데이트 완료")


def read_phase(filename: str) -> str:
    path = PHASES_DIR / filename
    if not path.exists():
        return f"[페이즈 파일 없음: {path}]"
    return path.read_text(encoding="utf-8")


def current_phase_index(status: dict) -> int:
    current = status.get("current_phase", PHASE_ORDER[0])
    try:
        return PHASE_ORDER.index(current)
    except ValueError:
        return 0


def cmd_show(status: dict) -> None:
    idx = current_phase_index(status)
    phase_file = PHASE_ORDER[idx]
    print(f"\n{'='*60}")
    print(f"  마주봄 Harness — Phase {idx + 1}/{len(PHASE_ORDER)}")
    print(f"  파일: {phase_file}")
    print(f"  상태: {status.get('phase_status', 'not_started')}")
    print(f"{'='*60}\n")
    print(read_phase(phase_file))
    print(f"\n{'='*60}")
    print(f"  완료된 태스크: {len(status.get('completed_tasks', []))}")
    print(f"  다음 페이즈: python scripts/execute.py next")
    print(f"{'='*60}\n")


def cmd_next(status: dict) -> None:
    idx = current_phase_index(status)
    if idx >= len(PHASE_ORDER) - 1:
        print("[execute] 모든 페이즈 완료.")
        return
    next_file = PHASE_ORDER[idx + 1]
    status["previous_phase"] = PHASE_ORDER[idx]
    status["current_phase"] = next_file
    status["phase_status"] = "not_started"
    status["completed_tasks"] = []
    status["phase_started_at"] = datetime.now(timezone.utc).isoformat()
    save_status(status)
    print(f"[execute] {next_file} 페이즈로 전진")
    cmd_show(status)


def cmd_status(status: dict) -> None:
    print(json.dumps(status, indent=2, ensure_ascii=False))


def cmd_reset(status: dict) -> None:
    confirm = input("페이즈 1로 초기화합니다. 진행 상태가 초기화됩니다. [y/N]: ")
    if confirm.lower() != "y":
        print("취소됨.")
        return
    status["current_phase"] = PHASE_ORDER[0]
    status["phase_status"] = "not_started"
    status["completed_tasks"] = []
    status["phase_started_at"] = None
    status["previous_phase"] = None
    save_status(status)
    print("[execute] 페이즈 1로 초기화 완료.")


def cmd_goto(status: dict, n: int) -> None:
    if n < 1 or n > len(PHASE_ORDER):
        print(f"[execute] 페이즈 번호는 1~{len(PHASE_ORDER)} 사이여야 합니다.")
        return
    status["current_phase"] = PHASE_ORDER[n - 1]
    status["phase_status"] = "not_started"
    status["completed_tasks"] = []
    status["phase_started_at"] = datetime.now(timezone.utc).isoformat()
    save_status(status)
    print(f"[execute] Phase {n}: {PHASE_ORDER[n-1]} 로 이동")
    cmd_show(status)


def main():
    status = load_status()
    args = sys.argv[1:]

    if not args or args[0] == "show":
        cmd_show(status)
    elif args[0] == "next":
        cmd_next(status)
    elif args[0] == "status":
        cmd_status(status)
    elif args[0] == "reset":
        cmd_reset(status)
    elif args[0] == "goto" and len(args) == 2:
        cmd_goto(status, int(args[1]))
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
