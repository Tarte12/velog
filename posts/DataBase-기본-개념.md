---
title: 'DB) DataBase 기본 개념'
slug: DataBase-기본-개념
date: 2025-01-23T07:53:15.032Z
tags: ['db']
---
## DB & DBMS & DB system

### DataBase = DB
 - 전자적(electronically)으로 저장되고 사용되는 관련 있는(related) 데이터들의 조직화된 집합(organized collection)

>관련 있는 = 같은 목적, 같은 출처, 같은 서비스
조직화된 = 카테고리가 잘 나뉜?
전자적으로 = 데이터가 컴퓨터가 저장되고 사용이 될 때

### DBMS = DataBase Management Systems
 - 사용자에게 DB를 정의/만들고/관리하는 기능을 제공하는 SW 시스템
 - EX) PostgreSQL, MySQL, Oracle, SQL Server
 - DB를 정의하다 보면 부가적인 데이터 발생 => metadata
 
###  metadata (= catalog)
- DB를 정의/기술(description) data
- e.g.) 데이터의 유형, 구조, 제약 조건, 보안, 저장, 인덱스, 사용자 그룹 등
- metadata도 DBMS를 통해 저장/관리
 
###  DataBase system
 - DB + DBMS + 연관된 applications
 - 줄여서 database라고 부름
 => (그래서 db가 데이터 자체의 db인지, db system인지 알아채야 함)
 <span style="color:slateblue">database system 동작 원리를 더 찾아보기</span>
##  Data Models

### data models
- DB의 구조(structure)를 기술할 때 사용될 수 있는 개념들이 모인 집합
- DB 구조를 추상화해서 표현할 수 있는 수단 제공
- data model은 여러 종류 존재, 추상화 수준/DB 구조화 방식이 조금씩 다름
- DB에서 읽고 쓰기 위한 기본적인 동작들(operations)도 포함

> DB 구조 : 데이터 유형, 데이터 관계, 제약 사항 등
그러니까 모델링 느낌이다 ~> 내가 원하는 추상화, 구조화를 위한 "모델링"
<span style="color:slateblue">db에서 말하는 추상화, 구조화가 무엇을 의미하는지 더 자세하게 찾아보기</span>
<span style="color:slateblue">db구조 개념</span>
### data models 분류
- conceptual (or high-level) data models
- logical (or representational) data models
- physical (or low-level) data models

### conceptual (or high-level) data models
- 일반 사용자들이 쉽게 이해할 수 있는 개념으로 이뤄진 모델
- 추상화 수준 가장 높음
- 비즈니스 요구 사항을 추상화하여 기술할 때 사용
<span style="color:slateblue">이 모델 예시 찾아보기(entity-relationship model)</span>
<span style="color:slateblue">ER diagram(entity-relationship model)</span>
### logical (or representational) data models
- 이해 어렵지 X, <span style="color:skyblue">디테일하게 DB를 구조화</span>할 수 있는 개념을 제공
- 디테일하게 DB를 구조화 : 데이터가 컴퓨터에 저장될 때의 구조와 크게 다르지 않게 DB 구조화를 가능하게 함
- 특정 DBMS or storage에 종속되지 않는 수준에서 DB를 구조화할 수 있는 모델
<span style="color:slateblue">이 모델 예시 찾아보기(relational data model)</span>
<span style="color:slateblue">개발자들이 가장 많이 쓰는 모델, relation = 쉽게 말해서 table의미</span>
#### logical data models 종류
- relational data model (가장 많이 사용, MySQL, Oracle, SQL Server)
- object data model
- object-relational data model (PostgreSQL)
### physical (or low-level) data models
- 컴퓨터에 데이터가 어떻게 파일 형태로 저장되는지를 기술할 수 있는 수단 제공
- data format, data orderings, access path 등
- access path : 데이터 검색을 빠르게 하기 위한 구조체 e.g.) index

## Schema & State

### DataBase Schema
- data model을 바탕으로 database의 구조를 기술(description)한 것
- schema는 database를 설계할 때 정해짐 -> 한번 정해지면 자주 바뀌지 X

### DataBase State
- database에 있는 실제 데이터는 꽤 자주 바뀔 수 있음
- 특정 시점에 database에 있는 데이터를 database state 혹은 snapshot이라고 함 (약간... 특정 시점에 월세 내고 살고 있는 사람들 목록?? 같은 느낌이네......)
- 혹은 database에 있는 현재 instances의 집합이라고도 함

### Three-Schema Architecture
- database system을 구축하는 architecture 중 하나
- user application으로부터 물리적인(physical) database를 분리시키려는 목적 => 분리시켜서 database가 바뀌어도 유저가 사용하는 application에는 영향을 안 미치게 하려고
- 세 가지 level이 존재하며 각각의 level마다 schema가 정의되어 있음

#### Three-Schema level 
- external schemas at external level
- conceptual schemas at conceptual level
- internal schemas at internal level
<span style="color:slateblue">stored database 구조 체크하기</span>

#### internal schemas
- 물리적으로 데이터가 어떻게 저장되는지 physical data model을 통해 표현
- data storage, data structure, access path 등 실체 있는 내용 기술
#### external schemas
- external views, user views
- 특정 유저들이 필요로 하는 데이터만 표현 (유저가 실제로 보는 화면?)
- 그 외 알려줄 필요 없는 데이터는 숨김
- logical datamodel을 통해 표현

#### conceptual schema
- 전체 database에 대한 구조 기술
- 물리적인 저장 구조에 관한 내용 숨김 (internal schema를 한번 추상화시킨 느낌?)
- entities, data types, relationships, user operations, constraint에 집중
- logical data model을 통해 기술

#### Three-Schema Architecture 정리
- 각 레벨을 독립시켜서 어느 레벨에서의 변화가 상위 레벨에 영향 주지 않기 위함
- 대부분의 DBMS가 three level을 완벽하게 or 명시적으로 나누지 않음
- 데이터는 internal level에 존재

## DataBase Language

### data definition language (DDL)
- conceptual schema를 정의하기 위해 사용되는 언어 (대부분)
- internal schema까지 정의할 수 있는 경우도 있음
### storage definition language (SDL)
- internal schema를 정의하는 용도로 사용되는 언어
- 요즘은 특히 relational DBMS에서는 SDL이 거의 없고 파라미터 등의 설정으로 대체됨
### view definition language (VDL)
- external schemas를 정의하는 용도로 사용되는 언어
- 대부분의 DBMS에서는 DDL이 VDL 역할까지 수행
### data manipulation language (DML)
- database에 있는 data를 활용하기 위한 언어
- data 추가, 삭제, 수정, 검색 등등의 기능을 제공하는 언어
### 통합된 언어
- 오늘날의 DBMS는 DML, VDL, DDL이 따로 존재하기보단 통합된 언어로 존재
- 대표적인 예시가 relational database language : SQL
