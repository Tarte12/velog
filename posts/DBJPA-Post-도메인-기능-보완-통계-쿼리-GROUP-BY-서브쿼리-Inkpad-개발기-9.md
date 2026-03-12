---
title: '[DB/JPA] 📦 Post 도메인 기능 보완: 통계 쿼리, GROUP BY, 서브쿼리 – Inkpad 개발기 #9'
slug: DBJPA-Post-도메인-기능-보완-통계-쿼리-GROUP-BY-서브쿼리-Inkpad-개발기-9
date: 2025-06-28T04:14:18.248Z
tags: []
---
# 1. 개념
## 1.1 GROUP BY
- `SELECT`절에서 **그룹함수(집계함수)**(`COUNT()`, `SUM()`, `AVG()`) **또는** `GROUP BY`**에 명시한 컬럼만 쓸 수 있는 이유**
	- 그룹핑된 데이터를 기준으로 한 줄만 출력
    - `GROUP BY` 걸지 않을 경우 -> 각 행에 대해 평가
    - `GROUP BY` 걸 경우 -> 그룹당 1행
```sql
SELECT category, COUNT(*) FROM post GROUP BY category;

```
## 1.2 HAVING VS WHERE
- 둘 다 필터링 기능인데 **위치랑 시점이 다름**
	-`WHERE`: **그룹핑 전에 필터**
    -`HAVING`: **그룹핑 후에 필터**
```sql
SELECT category, COUNT(*) 
FROM post 
WHERE views > 10       -- 그룹핑 전 필터
GROUP BY category 
HAVING COUNT(*) > 3;   -- 그룹핑 후 필터

```
## 1.3 서브쿼리
- 서브쿼리는 `SELECT`, `FROM`, `WHERE`, `HAVING`절 등 다양한 위치에 들어갈 수 있음
- 하지만 **JPQL에서는 제한 있음**
- `WHERE`절에서 가장 많이 쓰이고 비교 연산자와 함께 사용됨
```sql
SELECT * FROM post 
WHERE views > (SELECT AVG(views) FROM post);

```
## 1.4 JPQL 제한

### JPQL이란?
- Java Persistence Query Language
- JPA에서 **엔티티(Entity)** 기준으로 데이터를 조회하는 쿼리 언어

> **JPA에선 테이블이 아니라 자바 객체를 기준으로 쿼리하는 언어가 JPQL이다**

### 왜 쓸까?
- 기존 SQL은 **테이블** 기준으로 작성
```
SELECT * FROM post WHERE category = 'news';
```
- JPA는 **객체 지향 ORM** => **클래스, 필드** 기준으로 조회해야 함
```
SELECT p FROM Post p WHERE p.category = 'news'
```
=> 이게 **JPQL**

### SQL VS JPQL
| 항목 | SQL                  | JPQL              |
| -- | -------------------- | ----------------- |
| 기준 | 데이터베이스 **테이블**       | 자바의 **엔티티 객체**    |
| 필드 | 컬럼 이름 (`post.title`) | 객체 필드 (`p.title`) |
| 결과 | 테이블 row              | 객체(Entity)        |

### JPQL이 편한 이유
- **객체 기준**이라 자바 코드랑 바로 연결됨
- `SELECT ne DTO()` 문법을 통해 DTO로 변환해서 꺼낼 수 있음
- **JPA Repository** 안에서 바로 `@Query` 어노테이션으로 사용 가능

### 제한?
- JPQL은 SQL이 아니라 **객체 기반 쿼리 언어**라서 **제약** 존재
- 특히 `SELECT`절에는 서브쿼리 못 씀 -> `WHERE`**절만 사용 가능**

### 가능 
```jpql
SELECT p FROM Post p 
WHERE p.views > (SELECT AVG(p2.views) FROM Post p2)

```
### 불가능
```jpql
SELECT (SELECT AVG(p.views) FROM Post p) FROM Post  -- ❌

```


# 2. 실습

## 2.1 개념 - 코드 연결
| 개념                  | 적용된 코드                                         |
| ------------------- | ---------------------------------------------- |
| GROUP BY            | 카테고리별 게시글 수 (`countPostsByCategory`)           |
| 서브쿼리 (WHERE절)       | 평균 조회수 초과 게시물 (`findPopularPosts`)             |
| HAVING (미적용, 확장 가능) | 그룹핑 후 필터링 예시로 설명 가능                            |
| JPQL 제한             | `WHERE` 절은 가능, `SELECT` 절은 불가능 (설명용 대비 자료로 활용) |

## 2.2 기능 요약

### 1) 카테고리별 게시글 수 세기(GROUP BY)
```java
@Query("SELECT new org.example.demo3.domain.post.dto.CategoryCountDto(p.category, COUNT(p.id)) " +
       "FROM Post p GROUP BY p.category")
List<CategoryCountDto> countPostsByCategory();
```
-> **category를 기준으로 그룹핑** => 그 그룹 안에 post 수를 세어서 출력

### 2) 평균 조회수보다 높은 게시글 조회(서브쿼리)
```
@Query("SELECT p FROM Post p WHERE p.views > (SELECT AVG(p2.views) FROM Post p2)")
List<Post> findPopularPosts();

```
