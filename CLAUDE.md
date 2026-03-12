# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

티켓팅 연습용 프로젝트. React + Vite + TypeScript + Tailwind 프론트엔드.
백엔드는 AWS Lambda + DynamoDB (Phase 2 이후).

## 로컬 실행

```bash
cd frontend
npm install
npm run dev   # localhost:5173
```

## 문서

- `docs/01_overview.md` — 프로젝트 개요
- `docs/02_requirements.md` — 요구사항
- `docs/03_tech-stack.md` — 기술 스택
- `docs/04_architecture.md` — 아키텍처
- `docs/05_api-data-model.md` — API & 데이터 모델
- `docs/06_implementation-plan.md` — 구현 계획 (Phase별)
- `docs/07_definition-of-done.md` — 완료 기준
- `docs/08_design-system.md` — **디자인 시스템 ← UI 작업 시 반드시 참고**

## 커밋 정책

- 구현 작업이 완료되면 확인 없이 바로 커밋한다.

---

## 디자인 원칙 (요약)

> 전체 규칙은 `docs/08_design-system.md` 참고.

**방향:** 다크 미니멀. "필요한 것만, 정확하게."

### 색상
- 배경: `#0f0f0f` / 구분선: `#1a1a1a`
- 텍스트: `#f0f0f0` (주) / `#555` (보조)
- 버튼(주): `#f0f0f0` 배경 + `#0f0f0f` 텍스트
- 새 강조색 추가 금지. 보라/파랑 계열 금지.

### 폰트
- 기본: `Noto Sans KR`
- 숫자/타이머: `JetBrains Mono`
- 시스템 기본 폰트, Inter, Roboto 금지.

### 레이아웃
- 구분은 `border: 1px solid #1a1a1a`로만. 배경 채운 카드 금지.
- 이모지 UI 사용 금지.
- 과도한 `rounded-xl` / `shadow-xl` 금지.
