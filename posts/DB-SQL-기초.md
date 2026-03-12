---
title: 'DB) SQL 기초 '
slug: DB-SQL-기초
date: 2025-02-04T08:07:42.516Z
tags: []
---
> 궁금증 -> JPA를 쓰면 SQL문 직접 작성 안 해도 되고 편하다고 하던데, 이 DB 내용을 다 알고 JPA를 다시 공부하면 뭐가 좀 다를까??? (뭔가 보여지는 시선이 다를지가 궁금함 나중에 좀 엮어서 다시 생각해 보려고 적어 놓음)

## SQL 기본

### SQL 
- Structured Query Language
- 현업에서 쓰이는 relational DBMS 표준 언어
- 종합적인 DB 언어 : DDL + DML + VDL

### SQL 주요 용어
relation -> table
attribute -> column
tuple -> row
domain -> domain

### SQL에서 relation?
- multiset(=bag) of tuples @ SQL
- 중복된 tuple 허용
- table에선 tuple이 중복되어도 ㄱㅊ

### SQL & RDBMS
- SQL은 RDBMS의 표준 언어지만 실제 구현에 강제 X
-> RDBMS마다 제공하는 SQL의 스펙이 조금씩 다름

## 예제를 통해 SQL로 DB 정의

### IT 회사 관련 RDB 만들기
- 부서, 사원, 프로젝트 관련 정보 저장 가능 관계형 DB
- MySQL 

## Database 정의
### 기초 명령어
```
SHOW DATABASE; : db 목록 보기
SELECT database(); : 선택된 db
USE company; : 사용할 db
DROP DATABASE company; : 선택 db 삭제
```
### DATABASE VS SCHEMA
- MySQL에서는 DATABASE = SCHEMA
- CREATE DATABASE company = CREATE SCHEMA company
- 다른 RDBMS는 의미 다름

## Table 정의
- 부서, 사원, 프로젝트 관련 정보 저장 가능 관계형 DB
- 만들기 전에 스키마부터 구성
![](https://velog.velcdn.com/images/emprimula/post/d5eb78cb-a4bd-4f21-a25a-503f1a575a51/image.png)
```
CREATE TABLE DEPARTMENT (
	id 			INT 		PRIMARY KEY,
    name 		VARCHAR(20) NOT NULL 	UNIQUE,
    leader_id 	INT
    );
    
ALTER TABLE DEPARTMENT ADD FOREIGN KEY (leader_id)
RERERENCES employee(id)
on update CASCADE
on delete SET NULL;

# 스키마를 변경하는 명령문 ALTER
# 이미 서비스 중인 table의 스키마를 변경하는 경우,
# 변경 작업 때문에 서비스의 백엔드에 영향이 없을지 검토한 후에 변경하는 것이 중요함

DROP TABLE table_name:
- table 삭제할 때 사용
```
- PRIMARY KEY
- NOT NULL
- UNIQUE : 중복 X
- FOREIGN KEY : 외래키
- CHECK : 제약 조건

### database 구조를 정의할 때 중요한 점
- 만드려는 서비스의 스펙과 데이터 일관성, 편의성, 확장성 등을 종합적으로 고려하여 DB 스키마를 적절하게 정의하여야 함

## 데이터 추가
```
INSERT INTO employee
	VALUES(1, 'MESSI', '1987-02-01', 'M', 'DEV_BACK', 10000000, null);
    
SELECT * FROM employee
# employee 테이블의 전체(*)를 보여 줌
```

### INSERT statement
- INSERT INTO table_name VALUES (comma-separated all values);
=> 데이터를 하나만 넣을 때 (모든 attribute를 넣을 때)
- INSERT INTO table_name(attributes list)
	VALUES (attributes list 순서와 동일하게 comma-separated all values);
=> 내가 원하는 일부 attribute에 대해서만 그 값을 내가 원하는 순서로 넣고 싶을 때
=> 얘도 데이터 하나만 넣을 때
- INSERT INTO table_name VALUES (..., ..), (..., ..), (..., ..);
=> 한번에 한 테이블에 여러 데이터를 넣고 싶을 때

## 데이터 수정

### UPDATE statement
```
UPDATE employee SET dept_id = 1003 WHERE id =1;

UPDATE employee
	SET salary = salary * 2
    	WHERE dept_id = 1003;
        
UPDATE employee, works_on
	SET salary = salary * 2
    WHERE id = empl_id and proj_id = 2003;
or
UPDATE employee, works_on
	SET salary = salary * 2
    WHERE employee.id = works_on.empl_id and proj_id = 2003;
```

- UPDATE(table_name(s)
  SET attribute = value [, attribute = value, ...]
  [WHERE condition(s)];
  
## 데이터 삭제

### DELETE statement
```
DELETE FROM employee WHERE id = 8;

DELETE FROM employee WHERE impl_id = 2;

DELETE FROM works_on WHERE impl_id = 5 and proj_id <> 2001;
# 2001 빼고 다 지운다 -> <> 제외 표시

DELETE FROM project;
```

- DELETE FROM table_name
  [WHERE condition(s)]

