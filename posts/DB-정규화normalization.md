---
title: 'DB) 정규화(normalization)'
slug: DB-정규화normalization
date: 2025-02-26T08:15:38.937Z
tags: []
---
> functional dependency(FD)를 사용해서 DB를 정규화하기

### DB 정규화 (normalization)
- 데이터 중복과 insertion, update, deletion anomaly를 최소화하기 위해 일련의 normal forms(NF)에 따라 relational DB를 구성하는 과정

#### Normal forms
- 정규화되기 위해 준수해야 하는 몇 가지 rule들이 있는데, 이 각각의 rule을 normal form(NF)라고 부름

### DB 정규화 과정
**Init table -> 1NF -> 2NF -> 3NF -> BCNF -> 4NF -> 5NF -> 6NF**
- 처음부터 순차적으로 진행하며
- normal form을 만족하지 못하면 만족하도록 테이블 구조 조정
- 앞 단계를 만족해야 다음 단계로 진행 가능
** 1NF ~ BCNF **
- FD와 key만으로 정의되는 normal forms
- 3NF까지 도달하면 정규화됐다고 말하기도 함
- 보통 실무에서는 3NF 혹은 BCNF까지 진행 (많이 해도 4NF 정도까지 진행)

### Key
EMPLOYEE_ACCOUNT

|bank_name|account_num|**account_id**|class|ratio|empl|id|empl|name|card_id|
|---|---|---|---|---|---|---|---|

- super key : tables에서 tuple들을 unique하게 식별할 수 있는 attributes set
- (candidate) key : 어느 한 attribute라도 제거하면 unique하게 tuples들을 식별할 수 없는 super key
=> {account_id}, {bank_name, account_num}
- primary key : table에서 tuple들을 unique하게 식별하려고 선택된 (candidate) key
=> {account_id}
- prime attribute : 임의의 key에 속하는 attribute
=> account_id, bank_name, account_num
- non-prime attribute : 어떠한 key에도 속하지 않는 attribute
=> class, ratio, empl_id, empl_name, card_id


### functional dependency
- {account_id} -> {bank_name, account_num, class, ratio, empl_id, empl_name, card_id}

### Normalization

EMPLOYEE_ACCOUNT

|bank_name|account_num|**account_id**|class|ratio|empl|id|empl|name|card_id|
|---|---|---|---|---|---|---|---|
|Woori|010-9231-1121|al1|BRONZE|0.1|e1|Sony|c101|
|Woori|102-992-180125|al2|SILVER|0.2|e1|Sony|c102|
|Kookmin|010-9231-1121|al3|LOYAL|0.7|e1|Sony|c103|
|Kookmin|010-1221-1732|a21|LOYAL|1|e2|Messi|c201, c202|

** 1NF : attribute의 value는 반드시 나눠질 수 없는 단일한 값이어야 한다**

EMPLOYEE_ACCOUNT

|bank_name|account_num|**account_id**|class|ratio|empl|id|empl|name|**card_id**|
|---|---|---|---|---|---|---|---|
|Woori|010-9231-1121|al1|BRONZE|0.1|e1|Sony|c101|
|Woori|102-992-180125|al2|SILVER|0.2|e1|Sony|c102|
|Kookmin|010-9231-1121|al3|LOYAL|0.7|e1|Sony|c103|
|Kookmin|010-1221-1732|a21|LOYAL|1|e2|Messi|c201|
|Kookmin|010-1221-1732|a21|LOYAL|1|e2|Messi|c202|

** 1NF 만족! BUT, 중복 데이터가 생기고 primary key도 변경 필요! **

#### 왜 중복 데이터가 생긴 걸까?
- (candidate) key : {accout_id, card_id}, {bank_name, account_num, card_id}
- non-prime attribute : class, ratio, empl_id, empl_name
- 모든 non-prime attribute들이 {account_id, card_id}에 대해 partially dependent하다
- 모든 non-prime attribute들이 {bank_name, account_num, card_id}에 대해 partially dependent하다

** 2NF : 모든 non-prime attribute는 모든 key에 fully functionally dependent해야 한다 **

EMPLOYEE_ACCOUNT

|bank_name|account_num|**account_id**|class|ratio|empl_id|empl_name|
|---|---|---|---|---|---|---|
|Woori|010-9231-1121|al1|BRONZE|0.1|e1|Sony|
|Woori|102-992-180125|al2|SILVER|0.2|e1|Sony|
|Kookmin|010-9231-1121|al3|LOYAL|0.7|e1|Sony|
|Kookmin|010-1221-1732|a21|LOYAL|1|e2|Messi|

ACCOUNT_CARD

|**account_id**|**card_id**|
|---|---|
|al1|c101|
|al2|c102|
|al3|c103|
|a21|c201|
|a21|c202|

** 2NF 만족! **

#### transitive FD
- if X -> Y & Y -> Z holds, then X -> Z is transitive FD
- unless either Y or Z is NOT subset of any key

** 3NF : 모든 non-prime attribute는 어떤 key에 transitively dependent 하면 안 된다
=> non-prime attribute와 non-prime attribute 사이에는 FD가 있으면 안 된다**

EMPLOYEE

|empl_id|empl_name|
|---|---|
|e1|Sony|
|e2|Messi|

EMPLOYEE_ACCOUNT

|bank_name|account_num|**account_id**|class|ratio|empl_id|
|---|---|---|---|---|---|
|Woori|010-9231-1121|al1|BRONZE|0.1|e1|
|Woori|102-992-180125|al2|SILVER|0.2|e1|
|Kookmin|010-9231-1121|al3|LOYAL|0.7|e1|
|Kookmin|010-1221-1732|a21|LOYAL|1|e2|

ACCOUNT_CARD

|**account_id**|**card_id**|
|---|---|
|al1|c101|
|al2|c102|
|al3|c103|
|a21|c201|
|a21|c202|

** 3NF까지 되면 '정규화됐다'라고 말할 수 있다 **

** BCNF : 모든 유효한 non-trivial FD X -> Y는 X가 super key여야 한다 **

ACCOUNT_CLASS

|**class**|bank_name|
|---|---|
|BRONZE|Woori|
|SILVER|Woori|
|...|...|
|PRESTIGE|Kookmin|
|LOYAL|Kookmin|

EMPLOYEE_ACCOUNT

account_num|**account_id**|class|ratio|empl_id|
|---|---|---|---|---|
|010-9231-1121|al1|BRONZE|0.1|e1|
|102-992-180125|al2|SILVER|0.2|e1|
|010-9231-1121|al3|LOYAL|0.7|e1|
|010-1221-1732|a21|LOYAL|1|e2|

EMPLOYEE

|empl_id|empl_name|
|---|---|
|e1|Sony|
|e2|Messi|

ACCOUNT_CARD

|**account_id**|**card_id**|
|---|---|
|al1|c101|
|al2|c102|
|al3|c103|
|a21|c201|
|a21|c202|

** BCNF 만족! 모든 유효한 non-trinial FD X -> Y는 X가 super key여야 한다 **

### 2NF 참고 사항
- 2NF는 key가 composite key가 아니라면 2NF는 자동적으로 만족한다?
=> 일반적으로는 만족하지만 항상 그런 것은 아니다

### denormalization (반정규화)
- DB를 설계할 때 과도한 조인과 중복 데이터 최소화 사이에서 적정 수준을 잘 선택할 필요가 있다
- 다 쪼개는 것만이 답은 아닐 수 있음


### 시간 남으면 4NF, 5NF, 6NF 공부 (생략)




