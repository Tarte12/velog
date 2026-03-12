---
title: 'DB) SQL로 데이터 조회 (SELECT)
'
slug: DB-SQL로-데이터-조회-ing
date: 2025-02-04T08:08:36.384Z
tags: []
---
## SELECT로 데이터 조회하기

### SELECT statement

- ID가 9인 임직원의 이름과 직군을 알고 싶다
- SELECT name, position FROM employee WHERE id = 9;
-> id = 9 <= selection condition이라고 함
-> name, position <= projection attributes (관심 있는 속성)

#### 문법
SELECT attribute(s)
FROM table(s)
[WHERE condition(s)];

- project 2002를 리딩(leading)하고 있는 임직원의 ID, 이름, 직군을 알고 싶다
- SELECT employee.id, employee.name, employee.position
  FROM project, employee
  WHERE project.id = 2002 and project.leader.id = 	 employee.id;
  - project.id = 2002 <- selection condition (관심 있는 튜플을 선택하기 때문에)
  - project.leader.id = employee.id <- join condition (두 개의 테이블을 연결시키는 조건)
 
 ## AS
 
 ### AS 사용하기
 - AS는 테이블이나 attribute에 별칭(alias)을 붙일 때 사용
 - AS는 생략 가능
 
 - SELECT E.id AS leader_id, E.name AS leader_name, position
  FROM project AS P, employee AS E
  WHERE P.id = 2002 and P.leader.id = E.id;
 
 ## DISTINCT
 
### DISTINCT 사용하기
- 디자이너들이 참여하고 있는 프로젝트들의 ID와 이름을 알고 싶다
- SELECT P.id, P.name
  FROM employee AS E, works_on W, project AS P
  WHERE E.position = 'DSGN' and
  		E.id = W.empl_id and W.proj_id = P.id;
        
- DISTINCT는 select 결과에서 중복되는 tuples은 제외하고 싶을 때 사용

## LIKE

### LIKE 사용하기
- 이름이 N으로 시작하거나 N으로 끝나는 임직원들의 이름을 알고 싶다
- SELECT name
  FROM employee
  WHERE name LIKE 'N%' or name LIKE '%N';

- 이름에 NG가 들어가는 임직원의 이름을 알고 싶다
- SELECT name
  FROM employee
  WHERE name LIKE '%NG%';
  
- 이름이 J로 시작하는, 총 네 글자의 이름을 가지는 임직원들의 이름을 알고 싶다
- - 이름에 NG가 들어가는 임직원의 이름을 알고 싶다
- SELECT name
  FROM employee
  WHERE name LIKE 'J___';

### escape 문자와 함께 LIKE 사용하기
- %로 시작하거나 _로 끝나는 프로젝트 이름을 찾고 싶다면?
- SELECT name FROM project WHERE name LIKE '\%%' or name LIKE '%\_';

## *(asterisk)

### *(asterisk) 사용하기
- ID가 9인 임직원의 모든 attributes를 알고 싶다
- SELECT*FROM employee WHERE id = 9;
- *(asterisk)는 선택된 tuples의 모든 attributes를 보여 주고 싶을 때 사용

## SELECT without WHERE

### SELECT without WHERE
- 모든 임직원의 이름과 생일을 알고 싶다
- SELECT name, birth_date FROM employee
- 테이블에 있는 모든 튜블을 반환한다

