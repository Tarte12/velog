---
title: 'DB) 테이블 설계'
slug: DB-테이블-설계
date: 2025-02-26T06:20:41.681Z
tags: []
---
> **DB schema 설계를 잘못했을 때 어떤 문제가 발생할까?**

### 1. 중복 데이터 문제

### Insertion anomalies

#### 중복된 데이터
- 저장 공간 낭비
- 실수로 인한 데이터 불일치 가능성 존재

#### null값 많이 씀
- 할 수 있는 한 null값은 적게 쓰는 것이 좋음

=> 별개의 관심사가 한 테이블에 있음 
=> 분리하는 것이 더 좋음

### Deletion anomalies

### Update anomalies

### 2. Spurious Tuples
- 가짜 튜플
- join을 하면서 없던 정보가 가짜로 생기는 경우

### 3. null 값이 많아짐으로 인한 문제점들
- null 값이 있는 column으로 join하는 경우, 상황에 따라 예상과 다른 결과 발생
- null 값이 있는 column에 aggregate function을 사용했을 때 주의 필요
- 불필요한 storage 낭비

### 바른 DB schema 설계
1. 의미적으로 관련 있는 속성들끼리 테이블을 구성
2. 중복 데이터를 최대한 허용하지 않도록 설계
3. join 수행 시 가짜 데이터가 생기지 않도록 설계
4. 되도록이면 null 값을 줄일 수 있는 방향으로 설계
