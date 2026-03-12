---
title: 'DB) stored function'
slug: DB-stored-function
date: 2025-02-24T06:34:31.509Z
tags: []
---
## stored function 뜻과 예제

### stored function
- 사용자가 정의한 함수
- DBMS에 저장되고 사용되는 함수
- SQL의 select, insert, update, delete statement에서 사용 가능


### stored function 예제 1
- 임직원의 ID를 10자리 정수로 랜덤하게 발급하고 싶음
- ID의 맨 앞자리는 1로 고정
```
mysql> delimiter $$
mysql> CREATE FUNCTION id_generator() //함수 정의
	 -> RETURNS int //리턴 타입 정의
     -> NO SQL 
     -> BEGIN //body 부분 BIGIN -> 실제 동작 코드 -> END
     -> 	RETURN (1000000000 + floor(rand() * 1000000000));
     -> END
     -> $$
mysql> delimiter;

//id_generator()를 사용하여 employee 테이블에 임직원 정보를 추가하자
mysql> INSERT INTO employee
	 -> VALUES (id_generator(), 'JEHN', '1991-08-04', 'F', 'PO', 1000000000, 1005);
```

### stored function 예제 2
- 부서의 ID를 파라미터로 받으면 해당 부서의 평균 연봉을 알려주는 함수를 작성
```
mysql> delimiter $$
mysql> CREATE FUNCTION dept_avg_salary(d_id int) //함수 정의
	 -> RETURNS int //리턴 타입 정의
     -> READS SQL DATA
     -> BEGIN //body 부분 BIGIN -> 실제 동작 코드 -> END
     -> 	DECLARE avg_sal int;
     -> 	select avg(salary) into avg_sal
     						   from employee
                               where dept_id = d_id;
     ->		RETURN avg_sal;
     -> END
     -> $$
mysql> delimiter;

//부서 정보와 부서 평균 연봉을 함께 가져와라
mysql> SELECT *, dept_avg_salary(id)
	 -> FROM department;
```

### stored function 예제 3
- 졸업 요건 중 하나인 토익 800 이상을 충족했는지를 알려주는 함수를 작성
```
mysql> delimiter $$
mysql> CREATE FUNCTION toeic_pass_fail(toeic_score int) //함수 정의
	 -> RETURNS char(4) //리턴 타입 정의
     -> NO SQL 
     -> BEGIN //body 부분 BIGIN -> 실제 동작 코드 -> END
     -> 	DECLARE pass_fail char(4);
     -> 	select avg(salary) into avg_sal
     -> 	IF 		toeic_score is null THEN SET pass_fail = 'fail';
     -> 	ELSEIF 		toeic_score < 800 THEN SET pass_fail = 'fail';
	 -> 	ELSE							   SET pass_fail = 'pass';
     -> 	END IF;
     ->		RETURN pass_fail;
     -> END
     -> $$
mysql> delimiter;

//학생 정보와 함께 토익 점수 조건을 충족했는지 여부를 같이 가져오자
mysql> SELECT *, toeic_pass_fail(toeic)
	 -> FROM student;
```

### stored function
- 이외에도 loop를 돌면서 반복적은 작업을 수행하거나
- case 키워드를 사용해 값에 따라 분기 처리하거나
- 에러를 핸들링하거나 에러를 일으키는 등 다양한 동작 정의 가능

### stored function 삭제하기
- DROP FUNCTION stored_function_name;

## 등록된 stored function 파악하기

```
mysql> SHOW FUNCTION STATUS where DB = 'company';

mysql> SHOW DATABASES;
```

## stored function은 언제 써야 할까? (개인적 생각)

### Three-tier architecture

1. Presentation tier 
- 사용자에게 보여지는 부분을 담당하는 tier
- HTML, javascript, CSS, native app, desktop app
2. Logic tier
- 서비스와 관련된 기능과 정책 등 비즈니스 로직을 담당하는 tier
- application tier, middle tier라고도 불림
- java + spring, python + django, etc...
3. Data tier
- 데이터를 저장, 관리, 제공하는 역할을 하는 tier
- MySQL, Oracle, SQL Server, PostgreSQL, MongoDB

### 언제 써야 할까?

- util 함수로 쓰기에 괜찮을 것 같다
- 비즈니스 로직을 stored funtion에 두는 것은 좋지 않을 것 같다

