---
title: '[DB/JPA] 📦 Spring 프로젝트 JPA 5가지 Point – Inkpad 개발기 #5'
slug: DBJPA-Spring-프로젝트-JPA-5가지-Point-Inkpad-개발기-5
date: 2025-06-20T08:27:16.296Z
tags: []
---
> 직접 만든 **CRUD REST API**를 기반으로 **JPA 5가지 Point**를 공부해 보자
> => 개념을 코드에 적용할 수 있다면 내가 만든 CRUD REST API를 보완해 보자

# 1. 영속성 컨텍스트: 엔티티 라이프사이클, 엔티티 매니저

## 1.1 개념

**한 줄 요약**
> **"JPA가 엔티티를 잠깐 기억해 놓는 '비밀 노트'"**

- 엔티티를 영구 저장하는 환경
	- 영속성 컨텍스트는 논리적인 개념
- 애플리케이션과 데이터베이스 사이에서 객체를 보관하는 **가상의 데이터베이스 같은 역할**을 함 
	- 눈에 보이지 않음
- 이 과정에서 가상의 데이터베이스에 저장할 때 사용하는 게 **Entity Manager**

### 비유: 비밀 노트
- 선생님(JPA)이 **숙제를 제출한 학생들(Post, User, File 등)**을 모두 기억하고 싶은 상황
- 그래서 숙제를 한 번 볼 때 => **비밀 노트(영속성 컨텍스트)**에 이름, 숙제 내용, 시간 등을 메모
- 그리고 수업이 끝날 때까지 **해당 노트를 참고해서 관리**

### 역할
- **객체를 DB 대신 잠깐 보관**
- **객체를 수정하면 DB까지 같이 수정되게 준비**
- **이미 본 객체면 DB에 다시 물어보지 않음**(캐시처럼)

### 실습 코드: fileService
```java
@Transactional
public void updateFilename(Long id, String newFilename) {
    File file = fileRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

    file.updateFilename(newFilename); // 필드만 바꿨는데...
}
```
- 여기에서 우리가 `fileRepository.save(file)`을 하지 않았어도 DB에 변경이 반영되었음

#### 왜 그럴까?
- `findeById(id)`했을 때 -> `file` 객체는 **영속성 컨텍스트에 들어감** (비밀노트에 선생님이 적음)
- `file.updateFilename()`했을 때 -> JPA(선생님)는 "어? 바뀌었네?"라고 체크
- 그리고 `@Transaction` **끝날 때** -> 진짜로 DB에 반영 
	- 이것을 `flush`라고 함

#### 영속성 컨텍스트가 없다면?
- 우리가 객체를 바꿔도 JPA가 모름
- 개발자가 직접 `save()`하거나 `merge()`해야 DB에 반영

#### 정리

| 역할                     | 쉽게 말하면                   |
| ---------------------- | ------------------------ |
| 1차 캐시                  | 이미 불러온 파일은 다시 DB에 안 물어봄  |
| 변경 감지 (dirty checking) | 수정만 하면 알아서 저장 준비함        |
| flush & commit         | 트랜잭션 끝나면 비밀노트 내용 DB에 반영함 |

#### 왜 중요할까?
- **성능 향상**(캐시 기능)
- **간단한 코드로도 수정 가능**(dirty checking)
- **트랜잭션 안에서만 작동하니까** `@Transactional` **중요**


## 1.2 내 궁금증

### 캐시 기능 -> 성능 향상
> **같은 데이터를 DB에 여러 번 물어보자 않도록 1차 캐시에서 먼저 찾는다**

- JPA는 엔티티를 영속성 컨텍스트에 보관하면서 1차 캐시 역할을 함
- `findBuId()`로 이미 가져온 객체는 다시 DB에 쿼리하지 않고, 메모리에서 가져옴

- DB 접근 최소화 -> 성능 향상
- 동일 트랜잭션 내에서는 항상 동일 객체 사용(== 참조 동일성 보장)

### Dirty Checking -> 변경 감지
>**엔티티 필드가 바뀌면 JPA가 알아서 업데이트**

- 영속 상태의 엔티티에서 필드 값을 변경하면, 
- JPA가 트랜잭션이 끝날 때 `flush()`를 통해 변경 사항을 DB에 반영
```java
@Transactional
public void updateFilename(Long id, String newFilename) {
    File file = fileRepository.findById(id).orElseThrow();
    file.updateFilename(newFilename);
} // fileRepository.save(file); 안 해도 됨!

```

### Dirty Checking이 트랜잭션 안에서만 작동하는 이유
> **flush와 commit이 트랜잭션 범위 안에서만 작동하기 때문에**

- 영속성 컨텍스트는 트랜잭션이 시작되면 활성화되고,
- 트랜잭션이 끝날 때 변경 내용을 DB에 반영
=> 트랜잭션이 없으면 `flush()`나 `commit()`이 발생하지 않음

**실제 코드**
=> `@Transactional`을 Service에 붙어야 dirty checking과 flush가 작동

### flush, detach, clear

| 메서드        | 설명                      | 언제 쓰나                     |
| ---------- | ----------------------- | ------------------------- |
| `flush()`  | 영속성 컨텍스트의 변경 내용을 DB에 반영 | `commit` 전에 수동 반영 필요할 때   |
| `detach()` | 특정 엔티티를 영속성 컨텍스트에서 제거   | dirty checking 하지 않도록 할 때 |
| `clear()`  | 모든 엔티티를 영속성 컨텍스트에서 제거   | 강제로 1차 캐시 초기화할 때          |


### 엔티티 라이프사이클

| 상태             | 설명                                        |
| -------------- | ----------------------------------------- |
| 비영속 (new)      | 아직 영속성 컨텍스트에 들어가지 않은 상태                   |
| 영속 (managed)   | `persist()` 또는 `findById()` 등을 통해 관리되는 상태 |
| 준영속 (detached) | `detach()`나 `clear()`로 컨텍스트에서 분리된 상태      |
| 삭제 (removed)   | `remove()` 호출된 상태 (flush되면 실제 삭제)         |

#### 왜 엔티티 라이프사이클을 알아야 할까?
**1. JPA가 언제 어떤 동작을 수행했는지 예측하기 위해**
	- `new` -> `persist()` -> `managed` -> `flush()` -> DB insert
    - `managed` 상태에서 필드 변경만 해도 => `@Transactional` 끝날 때 `update` 쿼리 발생
    - `detach()`나, `clear()` 후에는 더 이상 변경 감지(Dirty Checking)이 안 됨
    => **상태별로 JPA 동작이 달라지므로**, 사이클을 모르면 버그 생기기 쉬움
    
**2. DB 반영 시점을 명확하게 알기 위해**
	- 개발자가 `save()` 안 해도 되는데, JPA가 언제 DB에 반영하는지 모르고 삽질할 수 있음
    - ex) "왜 update 쿼리가 안 날아가지?" -> 알고 보니 `detach` 상태
    
**3. 영속 상태 유지 여부에 따라 연관관계 관리가 달라짐**
	- 연관된 엔티티(A->B)를 저장하거나 cascade할 때도 라이프사이클 상태 중요
    - `orphanRemoval = true` 같은 옵션도 엔티티 상태 기반으로 동작
**4. 실무에서는 직접 EntityManager를 다룰 때도 있음**

### 엔티티 매니저
> **영속성 컨텍스트를 조작할 수 있는 관리자 도구**

- JPA가 제공하는 API로 `persist()`, `find()`, `remove()`, `flush()` 등을 사용할 수 있음
- Spring Data JPA에서 이 기능을 내부적으로 활용하지만,
	직접 쓰는 경우도 있음(ex) `@PersistenceContext`로 주입
    
## 1.3 결론
> - 처음에는 CRUD REST API를 만든 후, 관련 JPA 개념을 학습하면 역으로 내 코드에 개념을 적용할 수 있을 줄 알았음
- => 근데 다 공부하니까 내가 JPA를 채택했기 때문에, 영속성 컨텍스트는 그냥 자동으로 사용할 수 밖에 없는 느낌인데? (내가 따로 실습에 적용하려고 하지 않아도 이미 쓰고 있음)

### Q1. JPA를 사용하면 영속성 컨텍스트는 그냥 "자동 적용"아닌가?
** => 맞음**
- `Spring Data JPA + @Transactional` 환경에서는
	**JPA가 자동으로 영속성 컨텍스트를 열고, 엔티티 매니저를 내부적으로 사용**
- `fileRepository.findById(id)`처럼 **Repository만 호출해도**
	그 객체는 이미 `영속 상태(Managed)`에 들어감

### Q2. 그러면 영속성 컨텍스트는 내가 의식적을 "사용"하지 않아도 되나?
** => 어느 정도는 맞지만 실제로는 중요한 판단 기준이 됨 **

| 상황                                    | 왜 알아야 하는지                               |
| ------------------------------------- | --------------------------------------- |
| `find()` 후에 `save()` 없이 변경했는데 DB에 반영됨 | 내부적으로 영속성 컨텍스트 + Dirty Checking         |
| `detach()` 상태에서 변경 → 반영 안 됨           | 상태가 Managed가 아니었기 때문                    |
| 객체가 변경되었는지 JPA는 어떻게 알까?               | 엔티티 비교 & 스냅샷 방식으로 Dirty Checking        |
| DB 접근을 최소화하려면?                        | 1차 캐시 활용: 동일 객체 여러 번 `find()`해도 쿼리 안 나감 |

### 내 CRUD REST API에 자동 적용
```java
@Transactional
public void updateFilename(Long id, String newFilename) {
    File file = fileRepository.findById(id)  // 이 시점에 Managed 상태 됨
        .orElseThrow();
    file.updateFilename(newFilename);        // 내부 필드 수정만 함
    // save 안 했는데 DB 반영됨 → flush 시점에 Dirty Checking 발생
}

```
- **전형적인 영속성 컨텍스트 + Dirty Checking + flush** 흐름
- **Spring Data JPA Repository + @Transactional 조합**으로 이미 사용됨

### 헷갈리는 부분

#### 용어
| 개념                 | 설명                                                                     |
| ------------------ | ---------------------------------------------------------------------- |
| **Managed 상태**     | 영속성 컨텍스트가 엔티티를 추적 중인 상태 (`new`, `managed`, `detached`, `removed` 중 하나) |
| **Dirty Checking** | Managed 상태에서 필드가 바뀌었는지 JPA가 감시하는 것                                     |
| **flush()**        | 트랜잭션 종료 시점 등에 실행되어 변경 사항(DB 반영)이 실제 쿼리로 나감                             |
| **DB 반영 시점**       | flush가 호출되는 시점 (보통은 @Transactional 종료 직전)                              |

#### 정리
> 영속 상태에서 `flush()`를 호출하는 거고, **그 시점에서 DB에 반영**
> **영속 상태일 때 반영된다라고 하는 게 맞지 않는 말**


# 2. save VS update(merge VS dirty checking) - 트랜잭션 범위 @Transactional Service

> 새 객체는 `save`, 기존 객체는 `update`
> **그런데 JPA에서는 update 코드 잘 안 써도 됨 => 왜냐면 JPA가 알아서 바뀐 걸 추적함**

## 2.1 개념

- save: 새 책을 도서관에 처음 등록할 때
	- 데이터베이스에 **새로운 엔티티**를 저장
- update:
	- 데이터베이스에 **기존 엔티티 값을 바꿔서** 반영
    - 그런데 **JPA는** 기존 'update()` 방식과 **다르게** 작동

### 기존 방식 VS JPA 방식

#### 기존 방식(JDBC, MyBatis 등)
```sql
UPDATE user SET name = ? WHERE id = ?
```
- 수정하려면 SQL 명시적 작성
- 항상 UPDATE 쿼리 발생

#### JPA 방식
```java
@Transactional
public void update(Long id, String newName) {
    User user = userRepository.findById(id).orElseThrow();
    user.setName(newName); // ← 여기서만 수정!
    // save() 안 해도 됨!!
}
```
- 내부적으로 **dirty checking** 발생
- 트랜잭션 종료 전 `flush()` -> **변경된 필드만 UPDATE**

### Dirty Checking

#### Dirty Checking 동작 흐름
**1.** `findById()` -> 영속성 컨텍스트에 엔티티 등록(`managed` 상태)
**2.** 필드 수정 -> JPA가 초기 상태와 비교
**3.** 트랜잭션 종료 시 `fludh()` -> 차이점 있으면 `UPDATE` 쿼리 발생
```java
file.updateFilename("새이름"); // dirty checking 감지됨
// flush 시점에 UPDATE files SET originalFilename = '새이름' WHERE id = ?
```

#### Dirty Checking 왜 @Transactional 안에서만 작동할까?
> 1번에서 다룬 내용이지만 요약 정리

- **`flush()` = 트랜잭션이 커밋될 때 발생**
- 트랜잭션이 없으면 drity dhecking 결과를 DB에 반영하지 않음
- 그래서 항상 `@Transsactional` 안에서 수정해야 JPA가 반영함

### merge
- `merge`는 **Detached 객체**를 다시 영속화
	- 준영속 상태의 엔티티를 다시 영속 상태로 만든다
- 때로는 새로운 엔티티(비영속 상태)를 영속 상태로 만들 때도 사용하지만, 보통은 `save()`,(`persist()`)를 쓰는 것이 명확
```java
em.merge(detachedUser);
```

#### merge 동작 흐름
**1.** 준영속 상태의 엔티티(ex. 네트워크를 통해 클라이언트에서 받아온 엔티티 객체) 
	-> 이 객체는 영속성 컨텍스트의 관리를 받지 않음
**2.** `entityManager.merge(detachedEntity)`호출
	- if 영속성 컨텍스트에 같은 ID 가진 엔티티가 이미 있다면
    	- `detachedEntity`의 변경 내용 모두 복사
    - 없다면, 데이터베이스에서 같은 ID를 가진 엔티티를 찾아 영속성 컨텍스트에 등록
    	- 그 엔티티에 `detachedEntity`의 변경 내용 복사
    - 새로운 엔티티(비영속 상태)라면, `persist()`와 유사하게 영속 상태로 만든다
**3.** `merge()` 메서드는 **새로운 영속 상태의 엔티티를 반환**
	- 원본 준영속 엔티티가 영속 상태가 되는 것 X

#### merge VS dirty checking
- 대부분의 업데이트 상황에서 `merge()`보다 **dirty checking**을 사용하는 것이 권장됨



## 2.2 내 궁금증

### update 기능 한정해서, DB 접근 횟수로만 성능 향상을 따지면 안 되는 건가? ❓
> update 방식에 관련해서 기존 방식과 jpa 방식을 비교했는데, 구조가 JPA보다 기존 방식이 DB 접근 횟수가 많아서 성능이 안 좋을 것 같단 생각이 들어서 궁금

### dirty checking이랑 merge랑 아예 기능이 다른 것 같은데 왜 둘이 비교하는 거야?
> dirty checking은 영속 상태에서 자동으로 업데이트해 주는 느낌이고, merge는 아예 비영속 상태인 걸 영속 상태로 돌리겠다는 건데 다른 기능 아닌가?

- **실제로 전혀 다른 작동 방식**이고, dirty checking을 더 많이 사용함
- "JPA로 데이터를 수정할 때 **어떤 방식을 써야 하는가?"**의 관점에서 둘이 비교하는 것
- 둘 다 **변경된 내용을 DB에 반영한다**라는 목적을 가져 비교

| 구분 | dirty checking                            | merge                                    |
| -- | ----------------------------------------- | ---------------------------------------- |
| 대상 | **영속 상태**의 엔티티                            | **비영속(Detached)** 혹은 새 엔티티               |
| 방식 | 객체의 필드 변경을 추적 → flush 시점에 update 쿼리 자동 실행 | 아예 새 엔티티를 영속성 컨텍스트에 **복제**해서 반영          |
| 비용 | 변경된 필드만 update                            | **모든 필드**를 update (`merge`는 통째로 복사해서 넣음) |
| 특징 | 더 성능 최적화, 간편함                             | 비영속 객체 처리 가능 (ex. 외부에서 받은 JSON 객체)       |

# 3. 연관관계 매핑 @OneToMany or @ManyToMany -> Collection 필드 & Pagination 오류 -> @BatchSize

> - 현실 세계에서 사람, 게시글, 파일 등이 서로 연결되어 있는 것처럼,
> - 이터베이스의 테이블도 서로 관계를 맺고 있음
> - **객체와 객체 사이의 관계를 JPA가 알아서 연결해 주도록 설정하는 것**

## 3.1 왜 연관관계를 맺을까?
**자바 객체끼리는 서로 연결될 수 있지만 RDB(관계형 데이터베이스)는 기본적으로 테이블끼리 연결된 구조를 이해 X**
- ex) `Post` 클래스에 `User`가 속해 있으면 자바에서는 쉽게 사용 가능
```java
class Post {
    private User user;
}

```
- 하지만 이걸 RDB에 저장하려면 **외래 키(FK)**로 연결해야 함
- JPA에서는 객체와 객체 사이의 연결을 DB와 잘 매핑해 주기 위해 **연관관계 매핑** 지원

> 즉, **연관관계 매핑** = **객체의 관계 <-> 테이블의 외래키 관계**를 연결해 주는 **다리**

## 3.2 단방향 VS 양방향 관계: 누가 누구를 참조하는가?
> 기본적으로 단방향으로 설계, **필요한 곳**만 양방향으로 푸는 방식

| 구분  | 설명             | 예시                             |
| --- | -------------- | ------------------------------ |
| 단방향 | A → B만 알고 있음   | Post → User만 참조                |
| 양방향 | A ↔ B 서로 알고 있음 | Post → User, User → List<Post> |

### 양방향 -> 핵심 개념: 연관관계의 주인(Owner)
- 데이터베이스는 항상 단방향으로만 관계를 맺음
- 객체 양방향 관계에서 **실제로 외래 키(FK)를 관리하는 쪽을 '연관관계의 주인'**이라고 부름
- 주인 아닌 쪽은 `mappedBy` 속성을 사용하여 **"나는 주인이 아니고, 저쪽에서 매핑되었어!"**라고 알림
  	- `mappedBy`를 사용하면 읽기 전용이 됨
- **주인 설정 원칙**: 외래 키가 있는 테이블에 해당하는 엔티티가 보통 '주인'이 됨
  - `N:1` 관계에서는 `N`쪽에 외래 키가 있으므로, `N`쪽(`@ManyToOne`)이 주인
- 장점: 객체 그래프 탐색이 양쪽으로 가능하여 개발 편의성이 높음
- 단점:
	- 관계 설정이 복잡
  	- 무환 순환 참조 문제
  	- 데이터 일관성 문제(DTO 활용 필요)
   
## 3.3 @OneToMany, @ManyToOne, @ManyToMany, @OneToOne 개념
 
 | 어노테이션         | 관계 설명       | 예시             |
| ------------- | ----------- | -------------- |
| `@OneToMany`  | 하나 → 여러 개   | User → Posts   |
| `@ManyToOne`  | 여러 개 → 하나   | Post → User    |
| `@OneToOne`   | 하나 ↔ 하나     | User → Profile |
| `@ManyToMany` | 여러 개 ↔ 여러 개 | User ↔ 좋아요 게시글 |
  
### @ManyToOne: 가장 많이 쓰는 관계
 ```java
@ManyToOne(fetch = FetchType.LAZY)
private User user;

```
### @OneToMany: mappeBy로 역방향 지정
```java
@OneToMany(mappedBy = "user")
private List<Post> posts;

```

## 3.4 컬렉션 필드와 지연 로딩 시 발생하는 이슈
- JPA는 기본적으로 **Lazy Loading(지연 로딩)** 사용
	=> 필요한 시점까지 DB 조회를 미룸
  
> `@OneToMany`나 `@ManyToMany`처럼 여러 개의 연관 엔티티를 리스트(`List`)나 세트(`Set`) 같은 컬렉션으로 매핑할 때 => **Lazy Loading**이 기본적으로 작동
  - 필요한 순간에만 데이터를 가져와서 효율적이지만, 몇 가지 이슈 발생 가능성이 있음
  
### LazyInitializationException 문제
  - 가장 흔한 문제
  - 영속성 컨텍스트가 이미 닫힌 상태(ex) `@Transactional`메서드가 종료된 후)에서 지연 로딩된 컬렉션에 접근할 때 발생
  - 프록시 객체는 영속성 컨텍스트를 통해 실제 데이터를 가져와야 하는데, 컨텍스트가 없어 가져올 수 없는 바람에 생김
  
### N + 1 문제
  - 컬렉션 필드(`List<Post> posts`)를 가진 부모 엔티티(`User`)들을 한 번에 조회할 떄, 각 부모 엔티티의 컬렉션을 지연 로딩으로 접근하면, **개별 컬렉션마다 쿼리가 추가로 발생**하여 쿼리 수가 폭증
```java
for (User u : userRepository.findAll()) {
    for (Post p : u.getPosts()) {  // LAZY 로딩 → 여기서 쿼리 발생
        ...
    }
}

```
- user 10명 조회 -> 쿼리 1번
- 각 user의 posts 조회 -> 쿼리 10번
- 총 11번의 쿼리 발생 = N + 1  문제

## 3.5 Pagination + 연관관계 조회 시 문제점

- 컬렉션 필드를 `@OneToMany`로 매핑한 경우 -> 페이징과 함께 사용하면 **JPA가 join + 페이징을 동시에 못함**
-> 예상한 데이터 수보다 결과가 적게 나옴 or `hibernate warns about pagination with collection fetch`

> 실무에서는 `@OneToMany`를 `fetch join` 없이 별도로 조회하거나 DTO로 처리함
  
## 3.6 해결책: BatchSize 또는 fetch join + DTO
  
### 1. @BatchSize (Hibernate가 제공하는 최적화)
  ```java
@OneToMany(mappedBy = "user")
@BatchSize(size = 100)
private List<Post> posts;

```
- Hibernate가 한 번에 여러 개의 엔티티를 `IN` 쿼리로 가져오게 도와줌
- N + 1 -> N/Size + 1 로 감소

### 2. fetch join + DTO로 변환
```java
@OneToMany(mappedBy = "user")
@BatchSize(size = 100)
private List<Post> posts;

```
- 이후 `UserDTO`, `PostDTO`로 감싸서 반환하면 순환 참조, 성능 문제 해결
  
## 3.7 내 궁금증
  
### 왜 컬렉션 필드 + Lazy에서 문제가 생길까?
```java
class User {
    @OneToMany(mappedBy = "user") 
    private List<Post> posts;
}

```
- 한 명의 유저가 여러 게시글을 갖는 구조(1:N)
#### userRepository.findAll() 실행 시
- 유저는 바로 조회됨 (1번 쿼리)
- user.getPosts()를 호출하는 순간 각 유저마다 쿼리 1번씩 추가로 발생
=> 유저 100명이면 총 1 + 100 = 101번 쿼리 (이게 N+1 문제)
  
### 페이징 + fetch가 왜 문제?

- 페이징:
- ex) 1페이지에 유저 10명만 보여 주고 싶다 -> `Pageable pageable`로 10개만 가져오게 함
```java
@Query("SELECT u FROM User u JOIN FETCH u.posts")
List<User> findAllWithPosts(Pageable pageable);

```
- 이 쿼리는 **User마다 Post까지 한 번에 가져오려 함(fetch join)**
- 만약 Post가 여러 개면? **User 1명당 여러 row가 생김 => 페이징이 꼬임**
> **User 10명 요청했는데 결과로 3~4명만 올 수 있음**
  - why? row가 많아져서 limit에 걸림
  
**그래서 @BatchSize or 페이징 없이 fetch join 사용 or DTO로 쿼리 나눠서 조합 등으로 해결**
  

# 4. Egaer Loading VS Lazy Loading -> N+1 대처, 순환참조 방지 -> DTO + fetch join

> - **"연관된 객체를 언제 로딩할 것인가?"**
- 다른 엔티티를 **바로 불러올지, 나중에 필요할 때 불러올지** 결정하는 전략
- **Eager**: 당장 함께 가져옴
- **Lazy**: 필요할 때 가져옴(지연 로딩)

## 4.1 개념

### Eager Loading(즉시 로딩)
- `@ManyToOne`, `@OneToOne`은 Eager가 기본
** "필요하든 안 하든 일단 다 가져와!"**
- 연관된 엔티티를 함께 즉시 로딩
  	-> 객체를 조회할 때, 관련 객체도 바로 SQL 실행
- 동작:
	- 메인 엔티티(ex)`Post`)를 조회할 때, JPA가 연관된 엔티티(ex)`User`)를 **즉시 데이터베이스에서 함께 조회**
    - 대부분 `JSON` 쿼리를 사용하여 메인 엔티티와 연관된 엔티티를 한 번의 쿼리로 가져오려고 시도함
- 장점:
	- 조회한 엔티티를 가지고 추가적인 DB 접근 없이 바로 연관된 객체를 사용할 수 있음
    - 간단한 1:1. N:1 관계에서 사용하면 코드가 직관적
- 단점:
  	- 필요하지 않은 연관된 데이터까지 미리 가져와서 **성능 저하**, **메모리 낭비** 초래 가능성 있음
  	- 특히 `1:N` or `N:M` 관계에서 `Eager Loading`을 사용하면 -> `N+1` 문제가 발생할 가능성이 높음
  
### Lazy Loading(지연 로딩)
- `@OneToMany`, `@ManyToMany`는 Lazy가 기본
** "진짜 필요할 때만 가져와!"**
- 연관된 엔티티를 실제 사용할 때 SQL 실행
  	-> 초기에는 프록시 객체만 채워 놓음
- 동작:
  - 메인 엔티티(ex)`Post`)를 조회할 때, JPA는 연관된 엔티티(ex) `User` 또는 `List<Comment>`를 **프록시 객체**로 채워 놓음
  - 개발자가 이 프록시 객체를 통해 **연관된 데이터에 실제로 접근하는 순간, JPA가 그때서야 데이터베이스에 추가 쿼리를 날려 실제 데이터를 가져옴
- 장점:
  - 불필요한 데이터 로딩을 막아 **성능을 최적화하고 메모리 사용량을 줄임**
  - 대부분의 관계에서 `Lazy Loading`을 기본으로 사용하는 것이 권장됨
- 단점:
  - `N+1`문제 발생
  - 트랜잭션이 종료된 후에 연관된 엔티티에 접근하면 `LazyInitializationException`이 발생할 수 있음 (영속성 컨텍스트가 없기 때문)
 
### N+1 문제
```java
List<Post> posts = postRepository.findAll(); // 1번 쿼리
for (Post post : posts) {
    System.out.println(post.getUser().getUsername()); // 각 post마다 N번 추가 쿼리
}

```
 - `post.getUser()` 접근 시마다 DB에서 개별 쿼리 발생 → 총 N+1번 실행
- 특히 컬렉션 필드에서 많이 발생 (예: `@OneToMany` → `List<Comment>`)
  
### N+1 문제 대처법: fetch join & @BatchSize
  
#### fetch join
- ** 가장 강력하고 권장되는 방법** 중 하나
- `JPQL` 또는 `Querydsl`을 사용하여 연관된 엔티티를 **메인 쿼리와 함께 미리 로딩**하는 방식
- `SELECT p PROM p JOIN FETCH p.user` => `Post`를 가져올 때 `User` 정보도 `JOIN` 쿼리 한 번으로 가져옴
- 장점: 
  	- `N+1` 문제의 근본적 해결
  	- 한 번의 쿼리로 필요한 모든 데이터를 가져와서 성능이 좋음
- 단점:
  	- `@OneToMany` 같은 컬렉션 페치 조인 시 **중복 데이터** 발생 가능성(`DISTINCT` 키워드로 해결 가능)
  	- 페이징 쿼리 발생 or 의도치 않은 결과 발생 -> 일대다 관계에서 `fetch join`과 페이징은 함께 사용하지 않는 것이 원칙
  	- `fetch join`를 너무 많이 쓰면 쿼리가 복잡해지고 불필요한 데이터를 너무 많이 가져올 수 있음

> - 그러니까 N+1 문제는 데이터를 불러올 때 컬렉션 조회 시 **지연 로딩이 발생**해서 쿼리가 늘어나는데 
- 이걸 fetch join을 써서 필요한 엔티티를 지연 로딩이 아니라 **미리 가져와서 쓰니까** 근본적으로 **지연 로딩을 없애서 해결**한다는 맥락
=> 문제 해결 원리: **지연 로딩의 '회피'**
  
#### @BatchSize
- 근본적 해결 X
- **쿼리 수를 효과적으로 줄여 성능을 크게 향상**시키는 방법
- 장점:
  - `fetch join`이 아려운 상황(ex) 페이징과의 충돌)에서 유용하게 사용하며, 쿼리가 단순하고 유연함
- 단점:
  - `N+1` 문제 자체를 없애는 것이 아니라 사이즈를 줄이는 것에 불과함

#### 페이징이 뭔데?
- **데이터를 '쪽' 단위로 나눠서 보여 주기**
- 웹 애플리케이션이나 데이터베이스에서 **대량의 데이터를 한 번에 모두 보여 주지 않고, 정해진 '페이지' 단위로 나눠 보여 주는 기법**
- 쓰는 이유:
  1. 성능 향상:
  	- 필요한 페이지의 데이터만 가져와서 쿼리 속도가 빨라지고 서버 자원 소모가 줄어듬
  2. 메모리 효율성:
  	- 필요한 만큼만 메모리에 올리므로 메모리 부족 오류 발생 가능성이 적어짐
  3. 사용자 경험 개선(UX):
  4. 네트워크 트래픽 감소:
  	- 불필요한 데이터를 전송하지 않아 네트워크 대역폭 절약 가능

#### 왜 페이징이랑 fetch join이랑 같이 못 쓰는데?
- fetch join은 join을 한 번에 싹 긁어오겠다
- 페이징은 LIMIT, OFFSET을 사용해서 일부를 조회하겠다

> if) 하나의 post가 여러 개의 comment를 가지고 있을 경우
- fetch join을 하면 하나의 post에 여러 개의 row가 생길 것(comment가 여러 개니까)
- 근데 여기에서 페이징을 하면 => join된 테이블 기준으로 부분 조회를 하게 됨
- 예를 들어 10개를 가져온다고 하면
- comment 기준으로 생성된 row 단위로 가져와서 comment는 10개가 오는데 post는 3~4개 오는 상황 발생

#### 해결 방법
1. 지연 로딩 => Post만 가져오면 해결
2. DTO로 Post만 가져오고 필요할 때 comment를 따로 fetch
3. @BatchSize로 여러 comment를 한 번에 조회해서 쿼리 수 최소화
  
### 순환 참조 방지(DTO의 중요성)
  
- JPA에서 **양방향 연관관계**를 맺을 때 발생하는 문제
```java
// Post.java
@OneToMany(mappedBy = "post")
private List<Comment> comments;

// Comment.java
@ManyToOne
private Post post;

```
- `Post`는 `Comment` 리스트를 들고 있고,
- `Comment`는 다시 `Post`를 들고 있음
=> 이걸 JSON으로 변환하면 무한 루프 발생
```javascript
{
  "id": 1,
  "title": "글",
  "comments": [
    {
      "id": 10,
      "text": "댓글",
      "post": {
        "id": 1,
        "title": "글",
        "comments": [...],
        ...
      },
      ...
    }
  ]
}

```
=> 결과적으로 `StackOverflowError`, `500 Internal Server Error` 발생

#### 순환 잠조 해결 방법
1. `@JsonIgnore` or `@JsonBackReference`
- 한쪽 방향을 직렬화 대상에서 제외 => but 일회성 해결 방법
```
@ManyToOne
@JsonIgnore
private Post post;

```
**2. DTO로 데이터를 직접 정의해서 넘기기**

### DTO(Data Transfer Object)
> **데이터 전송에만 특화된 클래스**

- Entity를 그대로 넘기지 않고,
- 필요한 필드만 뽑아서 **응답 전용 객체**로 만들어 전송
  
```java
public class CommentDto {
    private Long id;
    private String text;

    public CommentDto(Comment comment) {
        this.id = comment.getId();
        this.text = comment.getText();
    }
}

```
-> Controller에서는 이렇게 사용
```java
@GetMapping("/posts/{id}/comments")
public List<CommentDto> getComments(@PathVariable Long id) {
    Post post = postService.findById(id);
    return post.getComments().stream()
               .map(CommentDto::new)
               .collect(Collectors.toList());
}

```
#### DTO의 장점
  
| 장점            | 설명                              |
| ------------- | ------------------------------- |
| 💥 순환 참조 방지   | Entity를 그대로 넘기지 않기 때문에 무한 루프 없음 |
| 🛡️ 보안성 ↑     | password 같은 민감한 필드 제외 가능        |
| 🧩 구조 변경 유연성  | 클라이언트가 원하는 형태로 응답 구조 설계 가능      |
| 🧪 테스트 용이     | 테스트 시 Entity 의존성 줄일 수 있음        |
| 📦 응답 데이터 경량화 | 필요한 정보만 추출해서 전송 가능              |

  
## 4.2 내 궁금증
### eager loading 기능을 보면 sql문의 join을 사용할 필요가 없어지는 거 아닌가? ❓

# 5. Querydsl 동적 쿼리(paging 처리 + CountQuery 최적화)

## 5.1 Querydsl

> **조건에 따라 유동적으로 쿼리를 만들고, 페이징도 효율적으로 처리하는 방법**
  
- **타입-세이프(Type-safe)**한 방법으로 SQL/JPQL 쿼리를 작성할 수 있게 도와주는 프레임 워크
  - "타입-세이프(Type-safe)하다": **컴파일 시점에 타입 관련 오류를 미리 감지하고 방지할 수 있도록 하는 것**
- 동적 쿼리: **런타임 시점에 조건에 따라** 쿼리 내용이 **변하는** 것
  - 유연하고 재사용 가능한 코드 작성 가능
  - ex) 쇼핑몰 앱에서 특정 필터링을 걸어서 검색하는 경우
 
 > - 근데 동적 쿼리는 **런타임 시점**에 SQL문을 바꾸겠다는 건데, Querydsl은 **컴파일 시점**에 **타입-세이프**한 방법으로 실행해 준다는 거잖아?
  => 뭔가 이 두 개가 부딪히는 개념 같은데?
  
### 동적 쿼리와 타입-세이프의 조화
> Querydsl이 '타입-세이프한 방법으로 동적 쿼리를 실행해 준다'?
  
**1. 쿼리 구성(Query Building)은 컴파일 시점에 타입-세이프하게**:
  - Querydsl을 사용하면 개발자는 **자바 코드88로 쿼리 조건을 구성
  - ex) `item.name.contains(name)`,`item.price.gt(price)` 같은 표현식은 모두 **자바의 문법과 타입 규칙을 따름**
  - 자바 코드는 **컴파일 시점에 유효성 검사를 받음**
  - ex) if, `item.name`처럼 없는 필드를 사용하거나, `item.price.contains("문자")`처럼 잘못된 타입의 연산을 시도하는 경우,
  - 컴파일러가 즉시 오류를 발생시켜 => **런타임 이전에 문제를 파악하고 수정**할 수 있게 도움
  - `BooleanBuilder`를 사용해 조건 추가 or 제외하는 로직 자체도 자바 코드로 작성 => 로직 자체의 문법적 오류도 컴파일 시점에 잡힙
**2. 실제 SQL/JPQL 생성 및 실행은 런타임에 동적으로:**
  - 개발자가 자바 코드로 구현한 Querydsl 표현식(ex) `item.name.contains(name)`은 그 자체로 SQL/JPQL 문자 X
  - 이 표현식들은 **런타임 시점**에 **Querydsl 라이브러리에 의해 실제 SQL/JPQL 문자열로 "번역" or "조합"됨**
  - `if(name != null)` 같은 조건문으로 `builder.and(item.name.contains(name))`가 실행 되는 것 => **런타임 시점**
  - 최종적으로 해당 조건들이 모두 합쳐진 SQL/JPQL 문장이 동적으로 생성되어 데이터베이스로 전달

 #### 그러니까 내가 생각을 하자면?
 > - ** "아버지가", "집에", "회사에", "차를", "자전거를", "타고", "걸어서", "도착했다", "귀가했다" 등의 각각의 단어
  => Querydsl의 Q-Type 필드와 메서드(자바 코드)**
  => 얘네를 만들 때 오타, 타입 등의 오류를 **컴파일 시점에 컴파일러가 즉시 오류를 잡겠다** = 이게 **타입-세이프**
  <BR>
  >- **이 단어들을 조합해서 "아버지가 회사에 차를 타고 도착했다"라는 문장을 만드는 것
  => 런타임 시점에 SQL/JPQL 문자열을 동적으로 생성하는 과정**
  => 이게 동적으로 만들어지는 것 = **동적 쿼리**
    
#### 다른 기술은 어떻길래 Querydsl의 장점인 거야?
> Mybatis 같은 건 컴파일 단계에서 체크하지 않는 걸까?

- **Querydsl의 장점 = 컴파일 타임(Compile-time) 안전성**

> Mybatis가 짜증 나는 게 개발자가 직접 SQL문을 **미리** 작성해 줘야 하는 거잖아(JPA는 지가 알아서 SQL문 적어 주는데)
=> 개발 과정에서 **"미리 SQL문을 작성하는데 왜 미리 체크가 안 되는 건데?"**
    
#### Mybtis: "미리 작성된 SQL"의 본질과 "미리 체크의 한계"
- Mybatis에서 개발자가 "미리 SQL문을 작성"하는 것은 맞음
    - XML 파일(`.xml`) 또는 어노테이션(`@Select`, `@Insert` 등)을 통해 SQL문 작성
**여기에서 Point => "어떤 형태로 미리 작성되었는가"**

**1. Mybatis의 "미리 작성된 SQL"은 단순한 텍스트 문자열**
    - `미리 작성된 SQL문`은 **컴파일러가 이해하는 자바 코드**로 인식하는 게 아니라,
    - **데이터베이스에 전송될 텍스트 문자열**로 간주
    - Mybatis 입장에서 SQL문은 그냥 **런타임에 파싱하고 해석해야 할 "텍스트 콘텐츠"**
**2. Java 컴파일러에서 SQL 문자열의 유효성을 검증하지 않음**
    
> - 그러니까 JPA는 **자바 코드**를 읽어서 SQL문을 만드는 거니까 => 자바 입장에서는 **자바 코드**를 체크하면서 검증이 되는 건데,
- Mybatis는 자바 코드가 아니라 그냥 **SQL문**일 뿐이니까 => 자바 입장에서 얠 체크할 이유가 없기 때문에 컴파일 타임에 검증이 안 된다는 이야기 
    
## 5.2 Paging 처리(페이징)
    
- 페이징(Paging): 대량의 데이터를 효율적으로 조회하고 사용자에게 보여 주기 위한 필수적 기법
- 웹 애플리케이션에서 일반적으로 모든 데이터를 가져오는 대신, 특정 페이지 단위로 데이터를 잘라서 보여 줌
- Querydsl에서는 `offset()`과 `limit()` 메서드를 사용해 페이징 구현
    
### 페이징의 필요성
- **성능 최적화**: 모든 데이터를 한 번에 가져오면 **DB 부하가 커지고, 네트워크 전송량이 많아짐** => 성능 저하
- **사용자 경험**: 수백, 수천 개의 데이터를 한 화면에 보여 주는 것은 사용자에게 혼란을 주고, 로딩 시간을 길게 만들어 좋지 않은 경험 제공
- **리소스 절약**: 서버 메모리 사용량 등을 줄여 줌

### Querydsl의 offset(), limit()
- Querydsl은 JPQL의 `OFFSET`, `LIMIT`(또는 SQL의 `OFFSET`,'FETCH NEXT`) 기능을 추상화하여 제공
    - `offset(long offset)`: 조회할 데이터의 시작 위치 지정
    	- `offset` = 건너뛸 레코드 수
    	- ex) `offset(10)`은 처음 10개의 레코드를 건너뛰고, 그 다음부터 데이터를 가져와라
    - 'limit(long limit)`: 한 번에 조회할 최대 레코드 수 지정
    - ex) `limit(20)`: 최대 20개의 레코드만 가져와라

#### Querydsl 페이징 처리 기본 구조
```java
public Page<Post> searchPosts(String keyword, Pageable pageable) {
    List<Post> content = queryFactory
        .selectFrom(post)
        .where(post.title.contains(keyword))
        .offset(pageable.getOffset())        // 몇 번째부터 시작할지
        .limit(pageable.getPageSize())       // 몇 개 가져올지
        .fetch();                            // 리스트로 가져오기

    long total = queryFactory
        .select(post.count())
        .from(post)
        .where(post.title.contains(keyword))
        .fetchOne();                         // 전체 개수 (count 쿼리)

    return new PageImpl<>(content, pageable, total);
}

```
    
| 항목           | 설명                        |
| ------------ | ------------------------- |
| `offset(n)`  | n개의 row를 건너뛰고 조회 시작       |
| `limit(m)`   | m개의 row만 조회               |
| `fetch()`    | 리스트로 결과 조회                |
| `fetchOne()` | 단일 값 조회 (보통 count용)       |
| `PageImpl`   | 결과 + 페이징 정보 + 전체 개수 함께 반환 |

### 주의
**1. 페이징은 두 개의 쿼리 실행 필요**
    - 데이터 조회 쿼리
    - 전체 개수 count 쿼리
> -> 페이지가 바뀌어도 전체 개수는 바뀌지 않기 때문에 count 쿼리를 최적화할 수 있음 
    => `5.3 CountQuery 최적화`
**2. Deprecated된 fetchResults()**
    - 예전에는 `fetchResults()`로 데이터 + count를 같이 처리했지만,
    - JPA 3.0 이후로 deprecated됨 => 현재는 직접 count 쿼리를 작성하는 방식 권장

### Spring Data JPA의 Pageable 활용
- JPA와 연동할 때 `Pageable` 인터페이스를 사용하면 페이징 처리가 편리
    
- `Pageable` 객체는 `page`(페이지 번호, 0부터 시작), `size`(페이지 당 항목 수), `sort`(정렬 정보) 등 페이징 관련 정보를 캡슐화
- Controller에서 `@PageableDefault` 어노테이션 들을 사용해서 `Pageable` 객체를 파라미터로 받으면 => Spring이 요청 파라미터(`?page=0&size=10&sort=id,desc`)를 자동으로 `Pageable` 객체로 변환해 줌
- Repository에서는 `Pageable`의 `getOffset()`과 `getPageSize()` 메서드를 Querydsl의 `offset()`, `limit()`에 그대로 전달하여 사용
- 결과를 반환할 땐 `PageImpl` 클래스를 사용해 `Page` 인터페이스를 구현한 객체 생성
    - `PageImpl` 생성자에는 조회된 `List<T> content`, `Pageable pageable`, `long total`(전체 개수) 필요

## 5.3 CountQuery 최적화
- 페이징 구현할 때, 단순하게 편재 페이지의 데이터만 가져오는 게 아니라
- **전체 데이터 개수(total count)**도 함께 조회해야 함
- 이 전체 개수를 알아야 전체 페이지 수를 계산하고 프엔에서 페이징 UI 올바르게 표시 가능

### 왜 count 쿼리가 문제가 될까?
- 일반적인 페이징은 **두 번의 쿼리**를 날림
    - **1. 데이터 쿼리**: offset, limit 사용하여 해당 페이지의 데이터를 가져옴
    - **2. 카운트 쿼리**: 전체 row 수를 세기 위한 쿼리(`select count(*)`
> 문제는 **두 번째 쿼리도 FROM, JOIN, WHERE 조건을 그때로 따라가기 때문에, 데이터를 안 가져와도 연산량이 그대로임** => 퍼포먼스 병목 가승성
    
### 1. fetchCount()문제 => Deprecated
    - 비효율적인 쿼리 생성: `fetchCount()`는 내부적으로 **기존 데이터 조회 쿼리의 `FROM`, `JOIN`, `WHERE`절을 그대로 사용하여 `SELECT COUNT(*) 쿼리 생성 **
    	- 과도한 JOIN: select 쿼리의 join까지 그대로 따라가서 count 연산
    	- 비즈니스 로직 쿼리 복잡도: 단순 수 세는데 모든 조건 포함할 필요 X
    - `DISTINCT` 키워드 처리 복잡성: `DISTINCT`가 포함된 쿼리에서 정확한 `COUNT`를 구하는 것이 복잡할 수 있음, `COUNT(*)`로는 `DISTINCT`가 적용된 정확한 개수 얻기 어려울 수 있음
    
### 2. CountQuery 최적화 방법 (권장 방법) = CountQuery를 분리하자
- **데이터 조회 쿼리와 Count 쿼리를 분리하고, Count 쿼리에서는 불필요한 요소를 제거하여 최소한의 형태로 작성하는 것 **
```java
// 실제 데이터 쿼리
List<Post> content = queryFactory
    .selectFrom(post)
    .where(...)    // 조건 포함
    .offset(...)
    .limit(...)
    .fetch();

// 별도의 카운트 쿼리 (불필요한 join 제거)
long total = queryFactory
    .select(post.count())
    .from(post)
    .where(...)    // 꼭 필요한 where만!
    .fetchOne();

```
- 실제 content 쿼리는 join 포함 가능
- count 쿼리는 꼭 필요한 최소한의 조건만 사용
    
### 3. CountQuery 생략 고려
- Count 쿼리 자체를 실행하지 않는 게 효율적인 경우 존재
- "더보기" 버튼을 통한 무한 스크롤 방식에서 활용
    - **마지막 페이지인 경우**
    - **"더보기" 또는 무한 스크롤**
    
 #### **PageableExecutionUtils.getPage(...) 사용**
 - **count 쿼리를 꼭 실행하지 않아도 될 때**, Spring Data JPA가 제공하는 유틸로 처리 가능
```java
return PageableExecutionUtils.getPage(content, pageable, () ->
    queryFactory.select(post.count())
                .from(post)
                .where(post.title.contains(keyword))
                .fetchOne()
);

```
- 내부적으로 `content.size() < pageable.getPageSize()`일 경우 count쿼리 생략
    
    
**참고**
1. https://drg2524.tistory.com/172