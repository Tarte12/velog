---
title: 'DB) SQL로 데이터 조회 (subquery)'
slug: DB-SQL로-데이터-조회-subquery
date: 2025-02-05T11:48:46.714Z
tags: []
---
## subquery

### SELECT with subquery
- ID가 14인 임직원보다 생일이 빠른 임직원의 ID, 이름, 생일을 알고 싶다
- SELECT id, name, birth_date FROM employee
  WHERE birth_date < (
  				SELECT birth_date FROM employee WHERE id=14
           );

- subquery (nested query or inner query) : SELECT, INSERT, UPDATE, DELETE에 포함된 query
- outer query (main query) : subquery를 포함하는 query
- subquery는 ()안에 기술

### SELECT with subquery
- ID가 1인 임직원과 같은 부서, 같은 성별인 임직원들의 ID, 이름, 직군을 알고 싶다
- SELECT id, name, position
  FROM employee
  WHERE (dept_id, sex) = (
  			SELECT dept_id, sex
            FROM employee
            WHERE id =1
 );
 
 - ID가 5인 임직원과 같은 프로젝트에 참여한 임직원들의 ID를 알고 싶다
 - SELECT DISTINT empl_id
   FROM works_on
   WHERE empl_id !=5 AND proj_id IN (
   			SELECT proj_id
            FROM works_on
            WHERE empl_id = 5
            
	);
    
- v IN(v1, v2, v3, ...) : v가 (v1, v2, v3, ...) 중에 하나와 값이 같다면 TRUE를 return
- (v1, v2, v3, ...)는 명시적인 값들의 집합일 수 있고 subquery의 결과(set or multiset)일 수 있다
- v NOT IN(v1, v2, v3, ...): v가 (v1, v2, v3, ...)의 모든 값과 값이 다르다면 TRUE를 return
 
- unqualified attribute가 참조하는 table은 해당 attribute가 사용된 query를 포함하여 그 query의 바깥쪽으로 존재하는 모든 queries 중에 해당 attribute 이름을 가지는 가장 가까이에 있는 table을 참조

### SELECT with subquery : EXISTS
- ID가 7 혹은 12인 임직원이 참여한 프로젝트의 ID, 이름을 알고 싶다
- SELECT P.id, P.name
  FROM project P
  WHERE EXISTS (
  			SELECT*
            FROM works_on W
            WHERE W.proj_id = P.id AND W.empl_id IN (7, 12)
            );
            
- correlated query : subquery가 바깥쪽 query의 attribute를 참조할 때, correlated subquery라고 부름
- EXISTS : subquery의 결과가 최소 하나의 row라도 있다면 TRUE 반환
- NOT EXISTS : subquery의 결과가 단 하나의 row도 없다면 TRUE 반환

### SELECT with subquery : ANY
- v comparisn_oprator ANY(subquery) : subquery가 반환한 결과들 중에 하나라도 v와의 비교 연산이 TRUE라면 TRUE를 반환한다
- SOME도 ANY와 같은 역할

### SELECT with subquery : ALL
- v comparisn_oprator ALL(subquery) : subquery가 반환한 결과들과v와의 비교 연산이 모두 TRUE라면 TRUE를 반환
