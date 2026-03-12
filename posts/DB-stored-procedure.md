---
title: 'DB) stored procedure'
slug: DB-stored-procedure
date: 2025-02-24T08:07:19.216Z
tags: []
---
## stored procedure

### stored procedure

- 사용자가 정의한 프로시저
- RDBMS에 저장되고 사용되는 프로시저
- 구체적인 하나의 태스크(task) 수행

## stored procedure 예제

### stored procedure 예제 1
- 두 정수의 곱셈 결과를 가져오는 프로시저 작성
```
mysql> delimiter $$
mysql> CREATE PROCEDURE product(IN a int, IN b int, OUT result int)
	 -> BIGIN
     -> 	 SET result = a * b;
     -> END
     -> $$
mysql> delimiter;

mysql> call product(5, 7, @result);
mysql> select @result;
```

### stored procedure 예제 2
- 두 정수를 맞바꾸는 프로시저 작성 (swap)
```
mysql> delimiter $$
mysql> CREATE PROCEDURE swap(INOUT a int, INOUT b int)
	 -> BIGIN
     -> 	 SET @temp = a;
     ->		 SET a = b;
     ->	     SET b = @temp;
     -> END
     -> $$
mysql> delimiter;

mysql> set @a = 5; @b = 7;
mysql> call swap(@a, @b);
mysql> select @a @b;
```

### stored procedure 예제 3
- 각 부서별 평균 연봉을 가져오는 프로시저 작성
```
mysql> delimiter $$
mysql> CREATE PROCEDURE get_dept_avg_salary()
	 -> BIGIN
     -> 	 select dept_id, avg(salary)
     ->		 from employee
     ->	     group by dept_id;
     -> END
     -> $$
mysql> delimiter;

mysql> call get_dept_avg_salary();
```

### stored procedure 예제 4
- 사용자가 프로필 닉네임을 바꾸면, 이전 닉네임을 로그에 저장하고 새 닉네임으로 업데이트하는 프로시저 작성
```
mysql> delimiter $$
mysql> CREATE PROCEDURE change_nickname(user_id INT, new_nick varchar(30))
	 -> BIGIN
     -> 	 insert into nickname_logs (
     ->		 		select id, nickname, now() from users where id = user_id
     ->	     );
     ->		 update users set nickname = new_nick where id = user_id;
     -> END
     -> $$
mysql> delimiter;

mysql> call change_nickname(1, 'ZIDANE');
```

### stored procedure

- 이외에도 조건문을 통해 분기 처리를 하거나
- 반복문을 수행하거나
- 에러를 핸들링하거나 에어를 일으키는 등의 다양한 로직 정의 가능

## stored function VS stored procedure

### stored function VS stored procedure

||stored function|stored procedure|
|--|---|---|
|create 문법|CREATE FUNCTION|CREATE PROCEDURE|
|return 키워드로 값 반환|가능|불가능|
|파라미터로 값 반환|일부 가능|가능|
|값을 꼭 반환해야 하는지|필수|필수 X|
|SQL statement에서 호출|가능|불가능|
|transaction 사용|대부분 불가능|가능|
|주된 사용 목적|computation|business logic|

### 이외에도
- 다른 function/procedure를 호출할 수 있는지
- resultset(=table)을 반환할 수 있는지
- precompiled execution plan을 만드는지
- try-catch를 사용할 수 있는지

## 3-tier architecture에서 stored procedure의 의미

### Three-tier architecture
- 오늘날의 IT 회사들은 일반적으로 client-server architecture의 한 종류인 three-tier architecture 모델로 서비스를 개발함

1. Presentation tier
- 사용자에게 부여지는 부분을 담당하는 tier
2. Logic tier
- 서비스와 관련된 기능과 정책 등등 비즈니스 로직을 담당하는 tier
3. Data tier
- 데이터를 저장하고 관리하고 제공하는 역할을 하는 tier

### 비즈니스 로직이란? 
e.g. 당근마켓의 비즈니스 로직 (Logic tier)
- 회원 가입/탈퇴
- 상품 리스트업 알고리즘
- 상품 정보 업로드 기능
- 상품 검색 기능
- 메시지 기능
=> 여기에서 파생되는 데이터들이 Data tier에 저장

### 데이터
e.g. 당근마켓의 데이터 (Data tier)
- 회원 정보
- 상품 정보
- 판매/구매 내역
- 지역 정보

### Stored procedure
- RDBMS에 저장되고 사용되는 프로시저
- 주된 사용 목적은 비즈니스 로직 구현
=> Stored procedure를 사용한다는 것은 data tier에 business logic!!

### Stored procedure 장점
- application에 transparent하다
- network traffic을 줄여서 응답 속도를 향상시킬 수 있음
- 여러 서비스에서 재사용 가능
- 민감한 정보에 대한 접근을 제한할 수 있음

### Stored procedure 단점 & 실무에서 쓰기에 조심스러운 이유
- stored procedure를 쓰게 되면 유지 관리 보수 비용이 커짐
- DB 서버를 추가하는 것은 간단한 작업이 아님
- logic tier에 애플리케이션 서버 투입은 간단함 <= CPU 혹은 메모리 부하를 쉽게 분산시킬 수 있음
- stored procedure가 언제나 transparent인 건 아님
- transparent하다고 무조건 좋은 것도 아님
- 재사용 가능하다는 것이 양날의 검이 될 수 있음
- 비즈니스 로직을 소스 코드에 두고도 응답 속도를 향상시킬 수 있음
- stored procedure가 민감한 정보에 대한 접근을 완벽히 제한할 수 없음
- DB 혹은 테이블 접근을 막으면 개발 및 CS 업무의 신속함이 떨어짐
=> 담당자나 개발자에게만 DB 혹은 테이블 권한을 부여하자
=> 민감한 정보는 암호화해서 저장하자
=> 보안서약서 등을 총해 정책적으로 보안을 강화하자

### 이외에도
- procedure로는 복잡하고 유연한 코드 작성이 어려움
- 오늘날 프로그래밍 언어는 훨씬 다양하고 강력한 기능을 제공
- procedure은 가독성이 떨어짐
- procedure은 디버깅이 어려움