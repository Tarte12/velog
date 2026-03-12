---
title: '[DB/JPA] 📦 Spring 프로젝트 REST API로 CRUD 기능 생성 (2) User – Inkpad 개발기 #3 '
slug: DBJPA-Spring-프로젝트-REST-API로-CRUD-기능-생성-2-User-Inkpad-개발기-3-ing
date: 2025-06-19T13:06:19.384Z
tags: []
---
> 이제 직접 User와 File 도메인 설게를 해 보자 - User편

# User.java
```java
package org.example.demo3.domain.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    //post.java보고 따라 만든 건데 builder의 역할이 뭔지 모르겠음
    //update랑 비슷하게 생겼고, builder랑 update랑 생성자랑 뭐가 다른 건데?
    //lombok이 뭔데?

    public User(Long id, String username, String email, String password){
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public void update(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
```

## @Builder?
- **빌더 패턴**을 적용한 생성 방식을 자동으로 만들어 줌
- 객체를 **가독성 좋고, 안정하게 생성**할 수 있게 해 줌
- 비교
```java
// 일반 생성자 방식
User user1 = new User(1L, "kim", "kim@email.com", "1234");

// Builder 방식 (더 명시적이고, 실수 적음)
User user2 = User.builder()
    .id(1L)
    .username("kim")
    .email("kim@email.com")
    .password("1234")
    .build();

```
- 순서 안 헷갈림
- 중간 생략 가능(선택적 필드 설정 가능)
- 가독성 좋아짐
- **생성자 + Builder가 함께 있으면 Builder를 주로 사용**

## builder, update, 생성자 차이

| 구분         | 목적                     | 특징                                   |
| ---------- | ---------------------- | ------------------------------------ |
| 생성자        | 객체를 생성할 때 값 세팅         | 순서 중요 / 필드명 없음                       |
| Builder    | 가독성과 안전성을 고려한 객체 생성 방식 | 명시적으로 각 필드 지정 / 순서 무관                |
| update 메서드 | 이미 생성된 객체의 값을 수정할 때 사용 | 내부 상태 변경용 / 대부분 `@Transactional`과 함께 |

## Lombok?
- **Lombok**은 자바 코드에서 반복적인 코드를 자동으로 줄여 주는 라이브러리

## 주로 쓰는 Lombok 어노테이션

| 어노테이션                 | 기능                   |
| --------------------- | -------------------- |
| `@Getter`             | 모든 필드에 getter 생성     |
| `@Setter`             | 모든 필드에 setter 생성     |
| `@NoArgsConstructor`  | 기본 생성자 생성            |
| `@AllArgsConstructor` | 모든 필드를 인자로 받는 생성자 생성 |
| `@Builder`            | 빌더 패턴 자동 생성          |
| `@ToString`           | toString 자동 생성       |




# UserRepository.java
```java
package org.example.demo3.repository;

import org.example.demo3.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    //이게 그냥 db 연결 계층이 repository니까 jpa를 상속 받아서 쓰려고 이렇게 선언하는 건지?
    //long은 왜 있는 건지?
    //여기에 추가 코드를 적는다면 무엇을 적는지?
}
```

## JpaRepository<엔티티 클래스, PK 타입>

- `User`: 이 Repository가 다루는 대상 엔티티
- `Long`: `User`의 **기본 키(PK) 타입**
	-`@Id`로 선언한 필드 타입이 Long이면 Long을 적어야 함
👉 이 Repository는 User 엔티티를 `Long` 타입의 ID로 저장/조회/삭제를 할 수 있게 해 준다는 의미

### 왜 JpaRepository를 상속받을까?
- JPA에서자체적으로 데이터를 DB에 저장/조회/수정/삭제 기능 존재
- SQL로 직접 안 짜고 쓸 수 있게 해 주는 게 `JpaRepository`

### JpaRepository를 상속받을 때 제공 받는 메서드

- `findById(Long id)`
- `findAll()`
- `save(User user0`
- `deleteById(Long id)
- 등등이 있음

### 추가로 어떤 코드를 적을 수 있을까?

#### 사용자 정의 쿼리 메서드
```java
Optional<User> findByEmail(String email);
List<User> findAllByNameContaining(String name);
```
- **개념**: 메서드 이름만으로 JPA가 자동으로 SQL을 생성해 주는 방식
- 장점:
	- 코드 짧음
    - 단순 조건(where절)이면 매우 편리
- 단점:
	- 조건이 복잡해질수록 메서드명이 길어지고 가독성이 나빠짐
    - 동적 쿼리는 어려움
    
### @Query로 JPQL 작성
```java
@Query("SELECT u FROM User u WHERE u.age > :age")
List<User> findUsersOlderThan(@Param("age") int age);

```
- **개념**: 직접 JPQL(Java Persistence Query Language)을 문자열로 작성해서 원하는 쿼리 수행
- 장점:
	- 복잡한 쿼리도 깔끔하게 작성 가능
    - 네이티브 SQL도 가능(`nativeQuery = true` 옵션 사용 시)
- 단점:
	- 문자열이라 컴파일러가 문법 오류 못 잡음
    - 유지보수가 어려움
### Querydsl을 붙이면 동적 쿼리 가능
```java
QUser user = QUser.user;

JPAQuery<User> query = new JPAQuery<>(entityManager);
List<User> result = query.from(user)
                         .where(user.age.gt(20).and(user.name.contains("kim")))
                         .fetch();
```
- **개념**: **코드 기반으로 쿼리를 타입 안정성 있게** 작성할 수 있는 DSL(Domain Specific Language)
- **동적 조건이 많을 때** 적합
- 장점:
	- 조건이 있는 경우 조건문(if 등)으로 쿼리를 동적으로 조립 가능
    - 컴파일러가 문법 오류를 잡아 줌
    - 복잡한 검색 조건 처리에 적합
- 단점:
	- 세팅이 번거로움(별도 gradle 설정, Q클래스 생성 필요)
    - 학습 곡선이 있음
    
>근데 **동적 쿼리가 뭔데?**

#### 동적 쿼리(Dynamic Query)
- **정적 쿼리(Static Query)**
	- 개발 시점에 SQL문이 미리 정의되어 고정된 형태로 사용되는 쿼리
    - 대부분의 일반적인 애플리케이션에서 사용하는 방식
    - ex) `SELECT * FROM users WHERE user_id = 123;`
- **동적 쿼리(Dynamic Query)**
	- 애플리케이션이 실행된느 시점에 사용자의 입력, 프로그램의 로직, 또는 기타 조건에 따라 SQL문이 동적으로 조합되거나 변경되어 실행되는 쿼리
    - ex) 검색 조건이 여러 개이고, 사용자가 어떤 조건을 선택할지 모를 때, 선택된 조건에 따라 `WHERE`절이 동적으로 추가되는 경우
    > 그러니까 내 생각에는 쇼핑몰 앱에서 카테고리, 가격대, 색상 등 필터링 옵션을 사용자가 선택하여 검색할 때 동적 쿼리를 사용할 것 같은데? => 제미나이가 맞다고 함
    **=> 그러면 나중에 다른 사람 블로그 볼 수 있는 피드 만들 때나 검색 기능 만들 때 동적 쿼리를 사용하면 좋을 것 같은데, 나중에 기능을 추가할 때 Querydsl을 사용해 볼까?**

# UserService.java
```java
package org.example.demo3.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.demo3.domain.user.User;
import org.example.demo3.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private  final UserRepository userRepository;
    //repository에서 db 땡겨와야 해서 쓰는 코드인지?

    public User create(User user){
        //저장 로직
        return userRepository.save(user);
        //그러면 이게 jpa를 썼을 때 save 명렬어를 쓰면 user 정보를 저장하고,
        //이게 create 역할이랑 같은 거라 그냥 이 코드만 치면 되는 거임?
        //근데 왜 postservice랑 다르게 save에 빨간줄이 생기지?
    }

    public List<User> findAll(){
        //전체 조희
        //findAll()이 뭔지?
        return userRepository.findAll();
        //유저 db에서 findall = 모든 걸 조회하겠다?
    }
    
    //Controller에서 findById를 가져올 수 있어야 함
    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }

    @Transactional
    public  void update(Long id, String username, String email, String password){
        //수정 로직
        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저 없음"));
        //왜 여기에선 user 객체를 만드는 거임? 일단 db에서 해당 id에 맞는 데이터를 가져오는 명령어 같음
        //근데 orElseThrow()는 왜 있는 거임?
        user.update(username, email, password);
        //id를 입력하고 내가 원하면 user, email, password 중에 골라서 수정하는 로직은 어떻게?
    }

    public void delete(Long id){
        //삭제 로직
        userRepository.deleteById(id);
        //회원 정보 db에서 통으로 지우겠다?
    }
}
```
## private final UserRepository userRepository;
- `UserService`가 **DB 접근을 위해** `UserRepository`**에 의존한다**라는 의미
- `@RequredArgsConstructor`로 **생성자 주입**을 해서 `userRepository`가 자동으로 주입됨

## UserRepository -> userRepository
```java
//잘못 작성한 코드
return UserRepository.save(user);
//수정 코드
return userRepository.save(user);
```
- `UserRopository` = **클래스 이름**
- `userRepository` => **실제로 그것을 주입받은 인스턴스(객체)**
- 생성자 주입으로 받은 `userRepository`를 사용해야 => `save()`, `findAll()` 사용 가능

## update() 메서드

### 왜 user 객체를 따로 만드는지?
- `userRepository.findId(id)`는 **`Optional<User>`**를 반환
- 그래서 해당 유저가 **존재하면 반환**, 없으면 **예외 처리** 필요
- 그 이후 수정하려면 해당 user 객체를 메모리에 올려야 해서 `user`를 꺼내야 함

## findAll()
```java
return userRepository.findAll();
```
- `JpaRepository<User, Long>`을 상속받으면 기본적으로 제공되는 메서드
- `findAll()` = **전체 조회** => `List<User>`로 리턴

## orElseThrow()
```java
User user = userRepository.findById(id).orElseThrow();
```
- `findById(id)`는 `Optional<User>` 반환
- Optional은 값이 있을 수도, 없을 수도 있음
- `orElseThrow()`를 붙여 **값이 없을 때 예외를 던지겠음**
- **NullPotinterException을 피하는 효과**

### Optional, orElseThrow(), 예외 처리

#### `Optional<T>`
- `Optional`은 **null일 수도 있는 값을 안전하게 다루기 위한 래퍼 클래스**
- `Optional<User>`는 **User일 수도 아닐 수도 있는 값**
- 아예 컴파일 단계에서 **"얜 값이 없을 수도 있어"**라고 경고 => 안전한 null 처리 도구

#### findById()가 Optional을 반환하는 이유
```
Optional<User> user = userRepository.findById(1L);
```
- "1번 유저가 있을 수도, 없을 수도 있어요"
- 값 O => `.get()`
- 값 X => `.orElse()`, `orElseThrow()`

#### orElseThrow()의 역할
```
User user = userRepository.findById(id)
    .orElseThrow(() -> new IllegalArgumentException("해당 유저 없음"));
```
- 값이 있으면 꺼내고
- 값이 없으면 **직접 지정한 예외**를 던짐
- 위 코드는 "유저가 없으면 예외를 던져라"라는 로직

#### 항상 orElseThrow()를 쓰는가?

| 상황                | 예시                      | 설명               |
| ----------------- | ----------------------- | ---------------- |
| 반드시 값이 있어야 함      | `.orElseThrow()`        | 없으면 예외 던짐        |
| 없으면 기본값 주고 싶음     | `.orElse(defaultUser)`  | null 대신 대체값      |
| 없으면 아무 것도 안 하고 싶음 | `.ifPresent(user -> …)` | 있을 때만 동작         |
| 값을 꺼내기만 하면 됨      | `.get()` ❗️             | 값이 없으면 예외 터지니 지양 |

#### 그러면 try-catch, try-with-resources, Optional.orElseThrow() 세 개가 어떻게 다른데?

| 구분                       | 사용 시기              | 예외 종류                     | 대표 예시           |
| ------------------------ | ------------------ | ------------------------- | --------------- |
| `try-catch`              | 명시적으로 예외 처리하고 싶을 때 | `Checked`, `Unchecked` 모두 | 파일 읽기, JDBC 연결  |
| `try-with-resources`     | 자원 자동 정리 필요할 때     | 보통 `IOException`          | 파일/DB/Socket 연결 |
| `Optional.orElseThrow()` | 값이 없을 때 예외 던짐      | `RuntimeException` 계열     | findById 결과 확인  |



# UserController.java
```java
package org.example.demo3.controller;

import lombok.RequiredArgsConstructor;
import org.example.demo3.domain.user.User;
import org.example.demo3.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //컨트롤러 설정
@RequiredArgsConstructor //이거 어디에 쓰는 거임?
@RequestMapping("/api/users") //엔드 포인트
public class UserController {

    private final UserService userService;
    //컨트롤러에서 서비스를 호출하는 코드인지?
    //밑줄 생기던 거 UserService 가서 @Service 어노테이션 붙여서 해결

    @PostMapping //Post HTTP 메서드와 연결(생성 요청 처리)
    //Post Http가 생성 관련 메서드? create가 생성 담당인지?
    public ResponseEntity<User> create(@RequestBody User user){
        return ResponseEntity.ok(userService.create(user));
        //Service한테 넘기겠다는 뜻인지? create 빨간줄은 왜 생기는지

    }

    @GetMapping //전체 조회 요청 처리
    //ResponseEntity가 뭔지, findAll()이 뭔지
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userService.findAll());
        //ResponseEntity가 뭐 하는 애인지 그냥 감만 잡힘
        //findall로 전체를 호출하겠다는 뜻인가?

    }

    @GetMapping("/{id}")
    // 단건 조회 요청 처리 => id로 해당 id만 조회하겠다는 의미인지?
    // 그렇다면 닉네임 같은 걸로 조최하는 방법은?
    public ResponseEntity<User> findById(@PathVariable Long id){
        //findById가 뭔지, @PathVariable이 뭔지?
        return  userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        //얘는 왜 findById로 안 끝나고 뒤에 두 줄이나 붙는 거임?
    }

    @PutMapping("/{id}")
    public  ResponseEntity<Void> update(@PathVariable Long id, @RequestBody User user){
        //수정 요청 HTTP 메서드가 Put인지
        //왜 여기는 Void를 넣고, id user를 다 매개변수로 받는지?
        userService.update(id, user.getUsername(), user.getEmail(), user.getPassword());
        //이렇게 바꾸면 다 수정할 수 있는지?
        return  ResponseEntity.ok().build();
        //return 문장이 뭘 의미하는 건지?
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> delete(@PathVariable long id){
        //삭제 요청 처리
        userService.delete(id);
        return  ResponseEntity.noContent().build();
        //return문이 뭘 의미하는 건지?
    }
}
```
## 어노테이션
- `@RestController`: 
	- REST API를 개발할 때 사용하는 핵심 어노테이션
    - `@Controller`와 `@ResponseBody`의 기능을 함께 제공
    - 메서드의 반환값이 HTTP 응답 본문으로 직접 전송됨(JSON, XML 등)
- `@RequiredArgsConstructor`:
	- Lombok이 `final` 필드에 대한 생성자를 자동으로 생성하여 의존성 주입을 간편하게 해 줌
- `@RequestMapping`:
	- 클래스 레벨에서 컨트롤러의 기본 URL 경로 설정
    - 메서드 레벨에서도 사용 가능
- `@RequestBody`:
	- 클라이언트의 HTTP 본문(Body_에 담긴 데이터를 자바 객체(여기에서는 `User`)로 자동으로 변환하여 메서드 매개변수로 받아 줌
- `@PostMapping`, `@GetMapping`, `@PutMapping`, `@DeleteMapping`:
	- 각각 HTTP 메서드(POST, GET, PUT, DELETE)에 해당하는 요청을 특정 메서드가 처리하도록 매핑
- `@PathVariable`:
	- URL 경로에 포함된 변수(ex. `/api/users/{id}`의 `{id}`)의 값을 추출하여 매개변수에 바인딩
- `@ResponseEntity`:
	- HTTP 응답을 세밀하게 제어할 수 있게 해 주는 클래스
    - 상태 코드, 헤더, 응답 본문 직접 설정 가능
    - `ok()`, `notFound()`, `noContent()` 등 다양한 빌더 메서드 제공

> **postman**으로 테스트 확인 완료