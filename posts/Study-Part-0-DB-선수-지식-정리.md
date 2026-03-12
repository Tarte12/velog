---
title: '[DB/JPA] DB 선수 지식 정리'
slug: Study-Part-0-DB-선수-지식-정리
date: 2025-06-12T11:43:23.187Z
tags: ['JPA', 'db']
---
<선수 지식>
# 1. 자바 어노테이션, 리플렉션

## 1.1 어노테이션(Annotation)

- **메타데이터** -> 자바 코드에 붙이는 `@` 기반의 정보
- 코드에 **추가적인 정보** 제공
- 코드를 분석하거나 특정 동작을 수행하도록 -> **컴파일러** or **프레임워크**에 지시하기 위해 사용

### 분류

#### 컴파일 타임 어노테이션: @Override, @SuppressWarnings
- 작동 시점: 컴파일 시점
- 대상: **컴파일러**
- 목적: 컴파일러에게 문법 체크, 경고 제거 등의 역할 수행
- `@Overrid`, `@SuppressWarinigs`, `@Deprecated`

#### 런타임 어노테이션: @Entity, @Transcational <- JPA, 스프링에서 활용
- 작동 시점: 실행 시점(JVM 런타임)
- 대상: **프레임워크 OR 라이브러리** -> **리플렉션** 기반
- 목적: 프레임워크가 동적으로 메타 정보를 활용하여 특정 동작 수행
- `@Entity`, `@Autowired`, `@Transcational`, `@RequestMapping`

```java
@Entity
public class Member {
    @Id
    private Long id;
}

```
- `@Entuty`는 해당 클래스가 JPA의 엔티티임을 나타냄
- 런타임에 JPA가 리플렉션을 사용해 이 어노테이션을 읽음

#### 차이점
**컴파일 타임 어노테이션**
- 소스 코드 수준에서만 작동
- `javac` 컴파일러가 읽고 처리
- 리플렉션을 통해 읽을 수 없음(`RetentionPolicy.SOURCE` or `CLASS`)

**런타임 어노테이션**
- 메타데이터가 `.class` 파일에 포함
- JVM이 **리플렉션으로 접근 가능**
- JPA, 스프링 등 동적 동작 구현 시 활용

## 1.2 리플렉션(Reflection)
- 클래스, 메서드 필드 등 **클래스의 구조(메타데이터)를 런타임에 분석하거나 조작**할 수 있는 자바 기능
- 메타데이터는 **코드로 선언된 정보 자체가 아니라, 그 구조에 대한 정보**

### 기능
- 클래스 이름으로 Class 객체 가져오기: `class,forName("com.example.Member")`
- 메서드/필드 정보 탐색: `getDeclaredMethods()`, `getDeclasredFieds()`
- 접근 가능하도록 설정: `setAccessible(true)`
- 동적으로 객체 생성/메서드 실행

### JPA와의 연관성
- JPA는 개발자가 직접 작성한 객체의 정보를 런타임 단계에서 읽고 SQL로 변환해서 실행
- 이 과정에서 **리플렉션**을 통해 어노테이션 정보를 읽고, **필드 접근, 메서드 호출** 등을 수행

# 2. 자바 Exception, try-catch 예외처리
## 2.1 Exception
- **예외 처리(Exception handling)**: 프로그램 실행 시 발생할 수 있는 예기치 못한 예외의 발생을 대비한 코드 작성
- 목적: 예외의 발생으로 인한 실행 중인 프로그램의 갑작스러운 비정상적인 동적을 막고, 에러를 잡아 복구를 시도 or 회피하는 식으로 처리해서 프로그램이 정상적으로 동작하게 하기 위함

### 예외의 종류

| 구분                  | 설명                    | 예시                                                 |
| ------------------- | --------------------- | -------------------------------------------------- |
| Checked Exception   | 반드시 try-catch로 처리해야 함 | `IOException`, `SQLException`                      |
| Unchecked Exception | 런타임 시 발생, 선택적 처리      | `NullPointerException`, `IllegalArgumentException` |


## 2.2 try-catch

### JPA와의 연관성
- **JDBC는 예외를 직접 처리**해야 하지만
- **JPA(Hibernate)는 런타임 예외로 감싸서 던짐** ->(`PersistenceException`, `DataIntergrityViolationException` 등)
- 스프링은 예외를 추상화하여 **트랜잭션 롤백** 판단 기준으로 사용
```java
@Transactional  // 예외 발생 시 자동 롤백
public void saveUser(User user) {
    entityManager.persist(user); // 내부적으로 try-catch & rollback 처리
}

```

# 3. DB Connection Prestatement 작성 경험

- **Connection**: DB와의 연결을 나타내는 객체(TCP 소켓 기반)
- **PreparedStatement**: 미리 컴파일된 SQL을 실행하는 객체
```java
String sql = "SELECT * FROM users WHERE id = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setInt(1, 10);
ResultSet rs = ps.executeQuery();
```
- PreparedStatement => **SQL Injection 방지**
- 반드시 `close()`로 자원 해제 필요

### JPA와의 연관성
- JPA 내부에서 JDBC 사용 -> SQL 생성 후 **PreparedStatement로 바인딩 후 실행**
- 개발자는 SQL 작성할 필요 X => **실제 내부에서 JDBC와 동일한 동작 수행**
```java
User user = em.find(User.class, 1L);
// SELECT * FROM user WHERE id=?

```
# 4. Spring AOP(Aspect-Oriented Programming)

## 4.1 AOP
- Aspect-Oriented Programming
- **관심사의 분리(Separation of Concerns)**를 위해 등장한 개념
- **관점 지향 프로그래밍**: 어떤 로직을 기준으로 **핵심적인 관점, 부가적인 관점**으로 나눠서 보고 그 관점을 기준으로 **각각 모듈화**하겠다는 것

**AOP에서 각 관점을 기준으로 로직을 모듈화?**
- 코드들을 부분적으로 나눠서 모듈화
- 흩어진 관심사(Crosscutting Concerns): 소스 코드상에서 다른 부분에 계속 반복해서 쓰는 코드들
- AOP는 이 **흩어진 관심사**를 **Aspect로 모듈화하고 비즈니스 로직에서 분리하여 재사용**하겠다는 것

### AOP 주요 개념

| 용어        | 설명                         |
| --------- | -------------------------- |
| Aspect    | 공통 기능 정의 클래스<BR>흩어진 관심사를 모듈화<BR>주로 부가기능 모듈화  |
  | Target| Aspect를 적용하는 곳(클래스, 메서드 등) |
| Advice    | 공통 기능 자체 (before, after 등)<br> 실질적으로 어떤 일을 해야 할지에 대한 것<br> 실질적인 부가기능을 담은 구현체 |
| JoinPoint | 공통 기능이 삽입될 지점<br> 다양한 시점에 적용 가능              |
| Pointcut  | Advice가 적용될 대상 지정 조건<br> JoinPoint의 상세한 스펙을 정의한 것<br> 더 구체적으로 Advice가 실행될 지점을 정할 수 있음 |


## 4.2 Spring AOP
  
### 스프링의 Proxy
- 스프링 AOP는 프록시 패턴 기반으로 설계
- 하지만 실제로는 디자인 패턴의 Proxy 패턴과 다른 부분이 존재
- 디자인 패턴에서 Proxy 패턴은 타겟의 대한 기능을 확장하지는 않고, Client가 Target에 접근하는 방식을 변경하는 코드 패턴을 의미
  
#### Proxy 패턴
  
### 스프링 AOP 특징
- 프록시


# 5. SQL 작성 DDL, DCL, DML, TCL 구분 가능

**참고**
1. https://inpa.tistory.com/entry/JAVA-%E2%98%95-%EC%98%88%EC%99%B8-%EC%B2%98%EB%A6%ACException-%EB%AC%B8%EB%B2%95-%EC%9D%91%EC%9A%A9-%EC%A0%95%EB%A6%AC
2. https://engkimbs.tistory.com/entry/%EC%8A%A4%ED%94%84%EB%A7%81AOP
3. https://jiwondev.tistory.com/152