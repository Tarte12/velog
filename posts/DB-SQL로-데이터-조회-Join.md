---
title: 'DB) SQL로 데이터 조회 (Join)
'
slug: DB-SQL로-데이터-조회-Join
date: 2025-02-18T13:37:03.734Z
tags: []
---
## Join?

### SQL에게 JOIN이란?
- 두 개 이상의 table들에 있는 데이터를 한 번에 조회하는 것
- 여러 종류의 JOIN이 존재

## implicit join VS explicit join

### implicit join
```
mysql> SELECT D.name
	-> FROM employee AS E, department AS D
    -> WHERE E.id = 1 and E.dept_id=D.id;
```
- from절에는 table들만 나열, where절에 join condition을 명시하는 방식
- old style join syntax
- where절에 selection condition과 join condition이 같이 있기 때문에 가독성 떨어짐
- 복잡한 join 쿼리를 작성하다 보면 실수로 잘못된 쿼리를 작성할 가능성이 큼

### explicit join
```
mysql> SELECT D.name
	-> FROM employee AS E JOIN department AS D ON E.dept_id = D.id
    -> WHERE E.id = 1;
```
- from절에 JOIN 키워드와 함께 joined table들을 명시하는 방식
- from절에서 ON 뒤에 join condition이 명시됨
- 가독성이 좋음
- 복잡한 join 쿼리 작성 중에도 실수할 가능성이 적음

## inner join VS outer join

### inner join
```
mysql> SELECT *
	-> FROM employee E INNER JOIN department D ON E.dept_id = D.id;
```
- 두 table에서 join condition을 만족하는 tuple들로 result table을 만드는 join
- FROM table1 [INNER] JOIN table2 ON join_condition
- 사용 가능 연산자 : =, <, >, != 등의 비교 연산자
- join condition에서 null값을 가지는 tuple은 result table에 포함될 수 없음

### outer join
- 두 table에서 join condition을 만족하지 않는 tuple들도 result table에 포함하는 join
- FROM table1 LEFT [OUTER] JOIN table2 ON join_condition <- 왼쪽 다 리턴
- FROM table1 RIGHT [OUTER] JOIN table2 ON join_condition <- 오른쪽 다 리턴
- FROM table1 FULL [OUTER] JOIN table2 ON join_condition <- 양쪽 다 리턴
- 사용 가능 연산자 : =, <, >, != 등의 비교 연산자

## equi join

### equi join
- join condition에서 = (equality comparator)를 사용하는 join

### equi join에 대한 두 가지 시각
- inner join outer join 상관 없이 =를 사용한 join이라면 equi join으로 보는 경우
- inner join으로 한정해서 =를 사용한 경우만 equi join으로 보는 경우

## using

### using
```
mysql> SELECT *
	-> FROM employee E INNER JOIN department D ON E.dept_id = D.dept_id;
    
mysql> SELECT *
	-> FROM employee E INNER JOIN department D USING (dept_id);
```
- 두 table이 equi join할 때 join하는 attribute의 이름이 같다면, USING으로 간단하게 작성 가능
- 이때 같은 이름의 attribute는 result table에서 한번만 표시
- FROM table1 [INNER] JOIN table2 USING (attribute(s))
- FROM table1 LEFT [OUTER] JOIN table2 USING (attribute(s))
- FROM table1 RIGHT [OUTER] JOIN table2 USING (attribute(s))
- FROM table1 FULL [OUTER] JOIN table2 USING (attribute(s))

## natural join

### natural join
- 두 table에서 같은 이름을 가지는 모든 attribute pair에 대해 equi join 수행
- join codition을 따로 명시 x
- FROM table1 NATURAL [INNER] JOIN table2
- FROM table1 NATURAL LEFT [INNER] JOIN table2
- FROM table1 NATURAL RIGHT [INNER] JOIN table2
- FROM table1 NATURAL FULL [INNER] JOIN table2


## cross join

### cross join
- 두 table의 tuple pair로 만들 수 있는 모든 조합(=Cartesian product)을 result table로 반환
- join condition이 없음
- implicit cross join : FROM table1, table2
- explict cross join : FROM table1 CROSS JOIN table2

### cross join @ MySQL
-MySQL에서는 cross join = inner join = join
- CROSS JOIN에 0N(or USING)을 같이 쓰면 inner join으로 동작
- INNER JOIN(or JOIN)이 ON(or USING) 없이 사용되면 cross join으로 동작


## self join

### self join
- table이 자기 자신에게 join을 거는 것

