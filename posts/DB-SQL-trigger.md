---
title: 'DB) SQL trigger'
slug: DB-SQL-trigger
date: 2025-02-25T06:29:00.797Z
tags: []
---
### Trigger의 사전적 의미
1. (총의) 방아쇠 
2. (반응 사건을 유발한) 계기 [도화선]
3. 촉발시키다(=set off)
4. 작동시키다(=set off)

### SQL에서 Trigger?
- 데이터베이스에서 어떤 이벤트가 발생했을 때, 자동적으로 실행되는 프로시저(procedure)
- 데이터에 변경이 생겼을 때 -> 즉, DB에 insert, update, delete가 발생했을 때 => 이것이 계기가 되어 자동적으로 실행되는 프로시저(procedure)를 의미

### SQL에서 Trigger 예시 1
- 사용자의 닉네임 변경 이력을 저장하는 트리거 작성
```
mysql> delimiter $$
mysql> CREATE TRIGGER log_user_nickname_trigger
	 -> BEFORE UPDATE
     -> ON users FOR EACH ROW
     -> BEGIN
     -> 	 insert into users_log values(OLD.idm OLD.nickname, now());
     -> END
     -> $$
mysql>delimiter;
```

- OLD : update 되기 전 tuple을 가리킴, delete된 tuple을 가리킴

### SQL에서 Trigger 예시 2
- 사용자가 마트에서 상품을 구매할 때마다 지금까지 누적된 구매 비용을 구하는 트리거 작성
```
mysql> delimiter $$
mysql> CREATE TRIGGER sum_buy_prices_trigger
	 -> AFTER INSERT
     -> ON buy FOR EACH ROW
     -> BEGIN
     -> 	 DECLARE total INT;
     ->		 DECLARE user_id INT DEFAULT NEW.user_id;
     ->
     ->		 select sun(price) into total from buy where user_id = user_id;
     ->		 update user_buy_stats set price_sum = total where user_id = user_id;
     -> END
     -> $$
mysql>delimiter;
```
- NEW : insert된 tuple을 가리킴, update된 후의 tuple을 가리킴

### 이외에도 trigger를 정의할 때 알고 있으면 좋은 내용 
- row 단위가 아니라 statement 단위로 trigger가 실행될 수 있도록 함 (mysql은 FOR EACH STATEMENT 사용 불가능)
- trigger를 발생시킬 디테일한 조건 지정 가능 (mysql은 불가능)

### trigger 사용 시 주의 사항
- 소스 코드로는 발견할 수 없는 로직이기 때문에, 어떤 동작이 일어나는지 파악하기 어렵고 문제가 생겼을 때 대응이 어려움
- 과도한 트리거 사용은 DB에 부담을 주고 응답을 느리게 함
- 디버깅이 어려움
- 문서 정리가 특히 중요