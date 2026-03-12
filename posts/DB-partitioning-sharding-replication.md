---
title: 'DB) partitioning, sharding, replication'
slug: DB-partitioning-sharding-replication
date: 2025-02-26T13:32:31.634Z
tags: []
---
> ** partitioning
sharding
replication **

### partitioning
- database table을 더 작은 table들로 나누는 것

#### 종류

|vertical partitioning|horizontal partitioning|
|---|---|
|column을 기준으로 table 나누는 방식|row를 기준으로 table 나누는 방식|

### sharding
- horizontal partitioning처럼 동작
- horizontal partitioning은 모든 partition들을 같은 DB 서버에 저장하는 방식
- sharding은 각 partition들을 서로 다른 DB 서버에 저장
- 부하(load)를 분산시키는 목적
- partition key를 shard key라고 부름
- 각 partition을 shard라고 부름

### replication
- DB를 복제해서 여러 대의 DB 서버에 저장하는 방식