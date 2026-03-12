---
title: 'DB) INDEX (완전 엄청 중요)'
slug: DB-INDEX-완전-엄청-중요
date: 2025-02-26T09:05:51.779Z
tags: []
---
> **index가 중요한 이유
index 거는 법
index 동작 방식
index 사용 시 참고 사항**

```
mysql>SELECT *
	 ->FROM customer
     -> WHERE first_name = 'Minsoo';
```

CUSTOMMER (100만개의 데이터)

|id|last_name|first_name|address|birth_date|
|---|---|---|---|---|
|...|...|...|...|...|
|...|...|...|...|...|
|...|...|...|...|...|

** first_name에 index가 걸려있지 않다면? **
- full scan(=table scan)으로 찾아야 함
- O(N)

** first_name에 index가 걸려있다면? **
- full scan보다 더 빨리 찾을 수 있음
- O(logN) (B-tree based index)

### Index를 쓰는 이유
- 조건을 만족하는 튜플(들)을 빠르게 조회하기 위해
- 빠르게 정렬(order by)하거나 그룹핑(group by)하기 위해

PLAYER

|**id**|name|team_id|backnumber|
|---|---|---|---|

```
mysql> SELECT * FROM player WHERE name = "Sonny";
mysql> SELECT * FROM player WHERE team_id = 105 and backnumber = 7;
```

** => 이것으로 index를 만들어 보자 (이미 테이블이 생성된 경우) **
```
mysql> CREATE INDEX player_name_idx ON player (name);
mysql> CREATE UNIQUE INDEX team_id_backnumber_idx ON player (team_id, backnumber);
```

** index를 만들어 보자 (테이블을 생성하면서) **

PLAYER
|**id**|name|team_id|backnumber|
|---|---|---|---|

```
mysql> CREATE TABLE player (
	-> id		  INT			PRIMARY KEY,
    -> name		  VARCHAR(20)   NOT NULL,
    -> team_id	  INT,
    -> backnumber INT,
    -> INDEX player_name_idx(name),
    -> UNIQUE INDEX team_id_backnumber_idx (team_id, backnumber)
	-> );
```

- (team_id, backnumber) -> multicolumn index, composite index
- primary key에는 index가 자동 생성됨

```
mysql> SHOW INDEX FROM player;
//해당 테이블에 있는 index를 보여 주는 명령어
```

### B-tree 기반의 index가 동작하는 방식 (추가로 공부 필요해 보임)

PLAYER

|**id**|name|team_id|backnumber|
|---|---|---|---|

- index : {id}, {name}, {team_id, backnumber}

```
mysql> SELECT * FROM player WHERE team_id = 110;
mysql> SELECT * FROM player WHERE team_id = 110 AND backnumber = 7;

=> index {team_id, backnumber} 사용할 수 있음

mysql> SELECT * FROM player WHERE backnumber = 7;
mysql> SELECT * FROM player WHERE team_id = 110 OR backnumber = 7;

=> 둘 다 full scan해야 함 (성능 나오는 index가 없음)
=> 따라서, backnumber에 대해 index를 걸어 줘야 함
```

** 사용되는 query에 맞춰서 적절하게 index를 걸어 줘야 query가 빠르게 처리될 수 있음 **
```
//무슨 index를 쓰는지 궁금할 때 쓰는 명령문
mysql> EXPLAIN
	 -> SELECT * FROM player WHERE backnumber = 7;
```

#### 어떻게 적절한 index를 선택하는 거지? 
- optimizer가 알아서 적절하게 index를 선택
- 가끔 이상한 거 고르는 경우가 있음
- 내가 직접 index를 고르는 방법은?
```
mysql> SELECT * FROM player USE INDEX (backnumber_idx)
	 -> WHERE backnumber = 7;
     
mysql> SELECT * FROM player FORCE INDEX (backnumber_idx)
	 -> WHERE backnumber = 7;
    
특정 index를 제외하고 싶을 때 
- IGNORE INDEX 사용
```

** 그러면 index는 많은 게 좋은 거 아니야? **
- table에 write를 할 때마다 index도 변경 발생 => 데이터가 많아질수록 오버헤드 발생
- 추가적인 저장 공간 차지
- 불필요한 index는 만들지 말자


### Covering index
- 조회하려는 attribute(s)들이 index 안에 있는 정보로 cover가 될 때 covering index라 칭함
- 조회 성능이 더 빠름

### Hash index (B-tree 기반 X)
- hash table을 사용해 index 구현
- 시간복잡도 : O(1)
- rehashing에 대한 부담
- equality 비교만 가능, range 비교 불가능
- multicolumn index의 경우 전체 attributes에 대한 조회만 가능
=> 보통은 B-tree 기반이 더 좋음

### Full scan이 더 좋은 경우
- table에 데이터가 조금 있을 때
- 조회하려는 데이터가 테이블의 상당 부분을 차지할 때
- full scan을 할지 index를 쓸지는 optimizer가 판단

### 그외
- order by나 group by에서도 index 사용될 수 있음
- foreign key에는 index가 자동으로 생성되지 않을 수 있음  (join 관련)
- 이미 데이터가 몇 백만 건 이상 있는 테이블에 인덱스를 생성하는 경우, 시간이 몇 분 이상 소요될 수 있고 DB 성능에 안 좋은 영향 줄 수 있음
