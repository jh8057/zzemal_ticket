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

**방향:** 라이트 미니멀. "필요한 것만, 정확하게."

### 색상
- 배경: `#fafafa` / 구분선: `#e5e5e5`
- 텍스트: `#111` (주) / `#444` (보조, 최솟값 — 더 옅게 금지)
- 포인트 컬러: `#ea580c` (주 버튼, 핵심 레이블에만)
- 버튼(주): `#ea580c` 배경 + `#fff` 텍스트
- 보라/파랑 계열 금지. 포인트 컬러는 `#ea580c` 1개만.

### 폰트
- 기본: `Noto Sans KR`
- 숫자/타이머: `JetBrains Mono`
- 시스템 기본 폰트, Inter, Roboto 금지.
- 최소 폰트 크기: 캡션 0.8rem, 본문 1rem, 강조 라벨 1.1rem.

### 레이아웃
- 구분은 `border: 1px solid #e5e5e5`로만. 배경 채운 카드 금지.
- 이모지 UI 사용 금지.
- 과도한 `rounded-xl` / `shadow-xl` 금지.
