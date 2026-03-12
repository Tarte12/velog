---
title: 'DB) 관계형 데이터베이스 (relational database)'
slug: DB-관계형-데이터베이스-relational-database
date: 2025-01-23T08:33:45.686Z
tags: []
---
## relational data model

### 주요 개념
domain : set of atomic values (더이상 나눌 수 없는 값)
domain name : domain 이름
attribute : domain이 relation에서 맡은 역할 이름
tuple : 각 attribute의 값으로 이뤄진 리스트, 일부 값은 NULL일 수 있음
relation : set of tuples
relation name : relation의 이름

### relation schema
- relation의 구조를 나타냄
- relation 이름과 attributes 리스트로 표기됨
- e.g.) STUDENT(id, name, grade, major, phone_num, emer_phone_num)
- attributes와 관련된 constraints도 포함

### degree of a relation (degree= 차수)
- relation schema에서 attributes의 수
- e.g.) STUDENT(id, name, grade, major, phone_num, emer_phone_num) -> degree 6

### relation (or relation state)
- set of tuples

### relational database
- relation data model에 기반하여 구조화된 database
- relational database는 여러 개의 relations로 구성됨

### relational database schema
- relation schemas set + integrity constraints set

## relation의 특징들

### relation의 특징들
- relation은 중복된 tuple을 가질 수 없음 (relation is set of tuples, set은 중복 불가능하고 이것의 집합이기 때문)
- relation의 tuple을 식별하기 위해 attribute의 부분 집합을 key로 설정
- relation에서 tuple 순서 중요 X
- 하나의 relation에서 attribute의 이름은 중복 불가
- attribute는 atomic해야 함 (composite or multivalued attribute 허용 X)

> atomic? 원자적인, 더이상 나눠질 수 없는
=> 쪼갤 수 있는 만큼 쪼개야 한다

## NULL

### NULL의 의미
- 값 존재 X
- 값이 존재하지만, 아직 그 값이 무엇인지 모름
- 해당 사항과 관련 X

## keys
### super key
- relation에서 tuple을 unique하게 식별할 수 있는 attribute set
### candidate key
- 어느 한 attribute라도 제거하면 unique하게 tuples를 식별할 수 없는 super key
- key or minimal super key
### primary key
- relation에서 tuples를 unique하게 식별하기 위해 선택된candidate key
### unique key
- primary key가 아닌 candidate keys
- alternate key
### foreign key
- 다른 relation의 PK를 참조하는 attributes set

## constraints
### constraints 뜻
- relational database의 relations들이 언제나 항상 지켜야 하는 제약 사항

### implicit constraints
- relational data model 자체가 가지는 constraints
- relation은 중복되는 tuple을 가질 수 없음
- relation 내에서는 같은 이름의 attribute를 가질 수 없음

### schema-based constraints
- 주로 DDL을 통해 schema에 직접 명시할 수 있는 constraints
- explict constraints

#### domain constrains
- attribute의 value는 해당 attribute의 domain에 속한 value여야 함
#### key constrains
- 서로 다른 tuples는 같은 value의 key를 가질 수 없음

#### NULL value constraint
- attribute가 NOT NULL로 명시됐다면 NULL을 값으로 가질 수 없음

#### entity integrity constrains
- primary key는 value에 NULL을 가질 수 없음

#### referential integrity constrains
- FK와 PK와 도메인이 같아야 하고 PK에 없는 values를 FK가 값으로 가질 수 없음