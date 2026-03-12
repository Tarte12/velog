---
title: 'DB) transaction, ACID'
slug: DB-transaction-ACID
date: 2025-02-25T07:09:55.964Z
tags: []
---
## database transaction

### Transaction
- 단일한 논리적인 작업 단위 (a single logical unit of work)
- 논리적인 이유로 여러 SQL문들을 단일 작업으로 묶어서 나눠질 수 없게 만든 것이 transaction
- transaction의 SQL문들 중에 일부만 성공해서 DB에 반영되는 일은 일어나지 않음
```
mysql> START TRANSACTION; //transaction을 시작한다
mysql> UPDATE account SET balance = balance - 200000 WHERE id = 'J';
mysql> UPDATE account SET balance = balance + 200000 WHERE id = 'H';
mysql> COMMIT;
```
COMMIT
- 지금까지 작업한 내용을 DB에 영구적으로 저장
- transaction을 종료
ROLLBACK
- 지금까지 작업들을 모두 취소하고 transaction 이전 상태로 되돌림
- transaction을 종료
AUTOCOMMIT
- 각각의 SQL문을 자동으로 transaction 처리해 주는 개념
- SQL문이 성공적으로 실행하면 자동으로 commit
- 실행 중 문제가 있었다면 알아서 rollback
- MySQL에서는 default로 autocommit이 enabled되어 있음
- 다른 DBMS에서도 대부분 같은 기능 제공

- START TRANSACTION 실행과 동시에 autocommit은 off됨
- COMMIT/ROLLBACK과 함께 transaction이 종료되면 원래 autocommit 상태로 돌아감

### 일반적인 transaction 사용 패턴
1. transaction을 시작(begin)
2. 데이터를 읽거나 쓰는 등의 SQL문들을 포함해서 로직 수행
3. 일련의 과정들이 문제없이 동작했다면 transaction을 commit
4. 중간에 문제가 발생했다면 transaction을 rollback

## ACID (Atomicity, Consistency, Isolation, Durability)

### Atomicity (원자성)
- ALL or NOTHING
- transaction은 논리적으로 쪼개질 수 없는 작업 단위이기 때문에 내부의 SQL문들이 모두 성공해야 함
- 중간에 SQL문이 실패하면 지금까지의 작업을 모두 취소하여 아무 일도 없던 것처럼 rollback함

- commit 실행 시 DB에 영구적으로 저장하는 것은 DBMS가 담당
- rollback 실행 시 이전 상태로 되돌리는 것도 DBMS가 담당
- 개발자는 언제 commit하거나 rollback할지를 챙겨야 함

### Consistency (일관성)
- transaction은 DB 상태를 consistent 상태에서 또다른 consistent 상태로 바꿔야 함
- constraints, trigger 등을 통해 DB에 정의된 rules을 transaction이 위반했다면 rollback해야 함
- transaction이 DB에 정의된 rule을 위반했는지는 DBMS가 commit 전에 확인하고 알려줌
- 그외에 application 관점에서 transaction이 consistent하게 동작하는지는 개발자가 챙겨야 함

### Isolation (격리, 분리)
- 여러 transaction들이 동시에 실행될 때도 혼자 실행되는 것처럼 동작하게 함
- DBMS는 여러 종류의 isolation level을 제공
- 개발자는 isolation level 중에 어떤 level로 transaction을 동작시킬지 설정 가능
- concurrency control의 주된 목표가 isolation


### Durability (영존성)
- commit된 transaction은 DB에 영구적으로 저장
- 즉, DB system에 문제(power dail or DB crash)가 생겨도 commit된 transaction은 DB에 남아 있음
- '영구적으로 저장한다'라고 할 땐 일반적으로 '비휘발성 메모리(HDD, SSD, ...)에 저장함'을 의미
- 기본적으로 transaction의 durability는 DBMS가 보장
