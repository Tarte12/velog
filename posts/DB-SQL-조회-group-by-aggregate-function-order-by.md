---
title: 'DB) SQL 조회 (group by, aggregate function, order by)'
slug: DB-SQL-조회-group-by-aggregate-function-order-by
date: 2025-02-24T06:00:52.994Z
tags: []
---
## Order by

### Order by
- 조회 결과를 특정 attribute(s) 기준으로 정렬하여, 가져오고 싶을 때 사용
- default 정렬 방식은 오름차순
- 오름차순 정렬은 ASC로 표기
- 내림차순 정렬은 DESC로 표기

## aggregate function

### aggregate function
- 여러 tuple들의 정보를 요약해서 하나의 값으로 추출하는 함수
- 대표적으로 COUNT, SUM, MAX, MIN, AVG 함수 존재
- (주로) 관심 있는 attribute에 사용 e.g.) AVG(salary), MAX(birth_date)
- NULL 값들은 제외하고 요약 값을 추출

```
mysql> SELECT COUNT (*) FROM employee; //임직원 수를 알고 싶다
```

## group by 

### group by 

- 관심 있는 attribute(s) 기준으로 그룹을 나눠, 그룹별로 aggregate function을 적용하고 싶을 때 사용
- grouping attribute(s) : 그룹을 나누는 기준이 되는 attribute(s)
- grouping attribute(s)에 NULL 값이 있을 때는 NULL 값을 가지는 tuple끼리 묶임

## HAVING

### having
- GROUP BY와 함께 사용
- aggregate funtion의 결과값을 바탕으로 그룹을 필터링하고 싶을 때 사용
- HAVING절에 명시된 조건을 만족하는 그룹만 결과에 포함

## 예제
```
//각 부서별 인원수를 인원수가 많은 순서대로 정렬해서 알고 싶음
mysql> SELECT dept_id, COUNT(*) AS empl_count FROM employee
	 -> GROUP BY dept_id
     -> ORDER BY empl_count DESC;
     
//각 부서별-성별 인원수를 인원수가 많은 순서대로 정렬해서 알고 싶음   
mysql> SELECT dept_id, sex, COUNT(*) AS empl_count FROM employee
	 -> GROUP BY dept_id, sex
     -> ORDER BY empl_count DESC;
 
//회사 전체 평균 연봉보다 평균 연봉이 적은 부서들의 평균 연봉을 알고 싶음
mysql> SELECT dept_id, AVG(salary)
 	 -> FROM employee
     -> GROUP BY dept_id
     -> HAVING AVG(salary) < (
     -> 				SELECT AVG(salary) FROM employee
     -> 	);
     
//각 프로젝트별로 프로젝트에 참여한 90년대생들의 수와 이들의 평균 연봉을 알고 싶음
mysql> SELECT proj_id, COUNT(*), ROUND(AVG(salary), 0)
	 -> FROM works_on W JOIN employee E ON w.empl_id = E.id
     -> WHERE E. birth_date BETWEEN '1990-01-01' AND '1999-12-31'
     -> 	AND W.proj_id IN ( SELECT proj_id FROM works_on
     						   GROUP BY proj_id HAVING COUNT(*) >= 7)
     -> GROUP BY W.proj_id;
     -> ORDER BY W.proj_id;
```

## SELECT로 조회하기 (요약)

### SELECT

SELECT attribute(s) or aggregate function(s)
FROM table(s)
[WHERE condition(s)]
[GROUP BY group attribute(s)]
[HAVING group condition(s)]
[ORDER BY attribute(s)]

### SELECT 실행 순서

(6) SELECT attribute(s) or aggregate function(s)
(1) FROM table(s)
(2) [WHERE condition(s)]
(3) [GROUP BY group attribute(s)]
(4) [HAVING group condition(s)]
(5) [ORDER BY attribute(s)]

- select 쿼리에서 각 절(phrase)의 실행 순서는 개념적인 순서
- select 쿼리의 실제 실행 순서는 각 RDBMS에서 어떻게 구현했는지에 따라 다름