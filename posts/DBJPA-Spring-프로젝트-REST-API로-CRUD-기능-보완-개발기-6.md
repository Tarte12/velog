---
title: '[DB/JPA] 📦 Spring 프로젝트 REST API로 CRUD 기능 및 개념 보완 – Inkpad 개발기 #6'
slug: DBJPA-Spring-프로젝트-REST-API로-CRUD-기능-보완-개발기-6
date: 2025-06-20T08:25:31.853Z
tags: []
---
> - CRUD REST API를 만들면서 보완해야 할 부분 정리(개념/기능 모두 보완해야 할 것)
> - 예를 들어서 엔티티 파일에서 @Builder 같은 경우엔 내가 직접 필요해서 어노테이션을 사용해야 하는데, 디자인 패턴을 모르니까 왜 쓰는 건지 잘 모르겠음
> - 추후에 보완해서 수정할 것

| 단계                   | 내용                                                     | 추천 시점               | 관련 개념 / 학습 키워드                 |
| -------------------- | ------------------------------------------------------ | ------------------- | ------------------------------ |
| 1️⃣ DTO 도입           | `UserUpdateDto`로 id 없이 원하는 필드만 수정 가능하게                 | **이번 주 바로 도입**      | DTO / Command 패턴 유사 구조         |
| 2️⃣ 비밀번호 암호화         | `BCryptPasswordEncoder`로 암호화, Spring Security 없이 우선 적용 | **DTO 적용 후 바로**     | 해시 알고리즘 / 보안 / Spring Security |
| 3️⃣ 실제 파일 업로드        | `MultipartFile` 적용, 저장 경로 설정, UUID 파일명 저장              | **다음 주 목표로 설정**     | 파일 입출력(IO) / 예외 처리             |
| 4️⃣ `@Builder` 개념 정리 | DTO, Entity 생성 시 사용하는 빌더 패턴 개념 → **단순 복붙 지양**          | **이번 주 학습 추천**      | Builder 패턴 / 생성자 오버로딩 차이       |
| 5️⃣ Proxy 패턴 이해      | JPA의 Lazy Loading, @Transactional이 내부적으로 사용하는 구조 파악    | **학습 우선순위 낮음**      | 프록시 패턴 / AOP / CGLIB           |
| 6️⃣ 패턴별 설계 실습        | Strategy, Factory, Template Method 등 1\~2개만 실습 코드로 체험  | **2\~3주 후 여유 있을 때** | 디자인 패턴 실전 적용                   |


# DTO 도입
# 비밀번호 암호화
# 실제 파일 업로드
# @Builder 
# Proxy 패턴