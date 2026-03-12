---
title: '[DB/JPA] 📦 User 도메인 기능 보완: DTO, 페이징, 예외 처리(얜 미룰 듯) – Inkpad 개발기 #7'
slug: DBJPA-User-도메인-기능-보완-DTO-페이징-예외-처리-Inkpad-개발기-7
date: 2025-06-26T05:44:50.856Z
tags: []
---
# 1. DTO 도입(User domain부터 해결하자)

> 1. 계층 구조 -> DDD로 리팩토링
> 2. DTO 도입

## 1.1 계층형 구조 -> 도메인 중심 구조

### 1. 계층 구조의 문제점
![](https://velog.velcdn.com/images/emprimula/post/a26ad577-c9c7-438a-b8ef-0ec405a71f82/image.png)
1. 하나의 도메인에 해당하는 코드가 여러 위치로 흩어져 응집도가 낮음
2. 새로운 기능 추가 or 리팩토링할 경우 -> 어떤 파일을 어디에서 수정해야 할지 직관성이 낮음
3. DDD를 많이 쓴다고 해서 고치고 싶었음
> 사실 그냥 처음 계층형으로 만드니까 뭔가 안 예뜨다는 생각이 들어서 예쁘게 바꾸고 싶어서 찾다가 도메인 중심 설계를 알게 되어 바꾸겠다고 생각함

### 2. 도메인 중심 설계
- 기능이 아닌 **비즈니스 개념(도메인)을 기준으로 구조화**하는 방식
- ex) `user`, `post`, `file`이라는 도메인을 기준으로 각각의 controller, service, repository, dto 등을 한 폴더에 모음

### 3. 구조 변경
![](https://velog.velcdn.com/images/emprimula/post/9a6d0dcf-b551-47dd-998f-ded85b8e2b77/image.png)

**패키지 역할 정리**

| 패키지          | 역할                                      |
| ------------ | --------------------------------------- |
| `domain.xxx` | 도메인별 로직 응집 (file, post, user 등)         |
| `controller` | 도메인에 속하지 않는 공통 API (Health 등)           |
| `config`     | 환경 설정 관련 클래스                            |
| `advice`     | `@RestControllerAdvice` 전역 예외 핸들러       |
| `exception`  | `ErrorCode`, `BlogException`, 도메인별 예외 등 |

> - 단순히 폴더만 옮긴 것이 아닌, 기능과 책임의 경계를 명확하게 하고
- 앞으로 유지보수성과 확장성을 고려한 구조로 한 단계 업그레이드하게 됨

## 1.2 DTO 도입

### UserrequestDto.java
```java
package org.example.demo3.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.demo3.domain.user.User;

@Getter
@NoArgsConstructor
//회원가입 시 요청받는 데이터
public class UserRequestDto {

    private String username; //아이디
    private String password; //패스워드
    private String nickname; //닉네임
    private String email; //이메일
    //일단 만들어만 놓고, 나중에 인증 받을 때 리팩토링할 것임

    //DB에 저장하려면 객체여야 하므로, 받은 데이터를 객체로 만드는 메서드
    public User toEntity() {
        return User.builder()
                .username(username)
                .password(password)
                .nickname(nickname)
                .email(email)
                .build();

    }
}
```

### User.java
```java
package org.example.demo3.domain.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String email;

    //DB에 최종적으로 "바꾼 값"을 반영할 때 엔티티 내부에서 실행하는 메서드
    public void update(String password, String nickname, String email) {

        this.password = password;
        this.nickname = nickname;
        this.email = email;
    }
}
```

### 여기까지 정리 + 궁금증

#### 정리
1. dto: entity를 날것 그대로 사용할 수 없음 -> 입맛에 맞춰 커스터마이징한 걸 써야 하는데 커스터마이징한 애들을 dto라고 부름
2. userrequestdto: 회원가입할 때 받을 정보를 커마해서 받겠다
3. username(id역할),password, nickname, email을 받겠다 -> email은 추후에 인증 기능 넣을 때 리팩토링
4. toEntity(): 받은 데이터를 DB에 저장하려면 객체 형태여야 하는데 받은 데이터를 객체로 만들기 위한 기능을 toEntity가 함
5. user.java에서 update -> 커마용이 아니라 DB에 "바뀐 값 실제 반영"하기 위한 메서드로, nickname, password, email만 바꿀 수 있게 할 것이기 때문에 셋만 넣음

#### 궁금증

**1. 그러면 user.java가 왜 필요한데? -> 필요한 데이터 형식마다 dto로 커마해서 받아서 커마한 객체를 db에 저장할 거면 entity.java 개념은 왜 필요한 거임?**

> - DTO: **데이터를 받기 위한 용도**에 불과
- Entity: **DB와 직접 연결되는 객체(= 영속성 관리 대상)**이기 때문에 **JPA가 반드시 필요로 하는 클래스
**=> 결론: DTO는 저장이 불가능하고, 저장하기 위해 Entity가 필요

| 구분    | DTO         | Entity               |
| ----- | ----------- | -------------------- |
| 저장 가능 | ❌ 직접 저장 못 함 | ✅ save()로 저장         |
| DB 연결 | ❌ 전혀 없음     | ✅ `@Entity`, `@Id` 등 |
| 책임    | 외부 입력/출력 전달 | 도메인 로직 수행 + DB 저장    |

**2. 롬복의 @Getter, @AllArgsConstructor 역할이 뭐임?**

| 어노테이션                 | 역할                               | 예시                                               |
| --------------------- | -------------------------------- | ------------------------------------------------ |
| `@Getter`             | 모든 필드에 대해 자동으로 `getXXX()` 메서드 생성 | `user.getEmail()` 가능                             |
| `@AllArgsConstructor` | 모든 필드를 인자로 받는 생성자 자동 생성          | `new User(id, username, pw, nickname, email)` 가능 |

**=> 얘네를 쓰면 불필요한 코드 작성 없이 자동으로 기능 생김**

- `getXXX()`: private로 선언된 필드 값을 외부에서 읽을 수 있게 해 주는 접근자 메서드
	- 필드는 보통 `private`로 감추기 때문에 **밖에서 값을 보기 위한 getter 메서드 필수**
    - 롬복의 `@Getter`는 **이걸 자동으로 만들어 주는 역할**

**3. user.java의 update 메서드는 매개변수로 password, nickname, eamil을 다 받는데 이유가 뭐임? => 내가 원하는 건 회원이 로그인한 상태에서 비번을 입력하면 password, nickname, email 중 원하는 만큼 바꿀 수 있게 하는 건데 저러면 매개변수를 다 적어야 하는 거 아님?**

- 이유: **어떤 필드를 바꿀지 모르니까 일단 다 받는 것**
- 만약 **바꿀 필드만 선택해서 바꾸고 싶다면?**
	- ** 방법 1: 서비스에서 조건 검사** <= 이거 채택할 것
    	=> 얜 수정 얘기라 `user.java`에 `changeXXX()` 추가, `UserUpdateDto.java`를 만들어야 진행 가능
    - **방법 2: update()를 선택형으로 바꾸기**

**4. 다른 dto도 커마하고 싶은 대로 필드를 만들고 toEntity() 메서드를 작성하는 형식인지?**

- **맞음** => DTO는 목적에 따라 자유롭게 필드를 구성하고, 
- 필요할 경우 => Entity로 바꾸는 `toEntity()` 메서드를 추가하는 구조가 일반적

> DTO에 대해 공부한 거 기반으로 직접 만들어 보기

### UserUpdateDto.java
```java
package org.example.demo3.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor

public class UserUpdateDto {

    //ID, username은 바꿀 수 없게 할 것이기 때문에 제외
    private String password;
    private String nickname;
    private String email;

    //회원을 새로 만드는 게 아니고 수정이니까 toEntity() 필요 X
    //필드 내용만 바꿔 주면 됨
    //Service에서 조건 분기해서 필드만 변경
}
```
**DTO엔 거의 기본으로 @Getter, @NoArgsConstructor를 쓴다고 보면 될까?**

| 어노테이션                | 역할                             | 이유                                                |
| -------------------- | ------------------------------ | ------------------------------------------------- |
| `@Getter`            | 모든 필드에 대한 `getXxx()` 메서드 자동 생성 | 서비스, 컨트롤러 등에서 DTO 값을 꺼낼 수 있도록 하기 위해 필요            |
| `@NoArgsConstructor` | 기본 생성자 자동 생성                   | 스프링이 DTO를 객체로 만들 때 기본 생성자가 필요함 (ex: JSON 요청 파싱 시) |

**안 쓰는 경우**
- `@Builder`만 쓰는 DTO: 이럴 땐 @NoArgsConstructor는 필수는 아님 (하지만 안정성을 위해 같이 써 주는 경우 많음)
- Record(자바 16+)로 DTO를 만들면 Lombok 자체가 필요 없음

**=> 그냥 습관처럼 쓰는 걸로 하자**

#### UserService.java
> UserUpdateDto에서 값을 바꿀 수 있는 필드를 생성하고, UserService에서 원하는 필드만 값을 바꿀 수 있게 조건 분기 설정

```java
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
    public  void update(Long id, UserUpdateDto dto){
        //수정 로직
        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저 없음"));

        // ❗ 조건 분기: null이 아닐 때만 업데이트
        if (dto.getPassword() != null) {
            user.changePassword(dto.getPassword());
        }
        if (dto.getNickname() != null) {
            user.changeNickname(dto.getNickname());
        }
        if (dto.getEmail() != null) {
            user.changeEmail(dto.getEmail());
        }
    }
    

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

}
```

### UserResponseDto.java

#### 정리
-`UserResponseDto`: Entity(유저/객체) 정보 중 필요한 데이터만 커마해서 조회해 주기 위한 그릇
	- 조회하려면 Entitiy의 값을 받아야 함
    - 이걸 매개변수로 해서 조회할 정보를 받아오겠음(설명을 보면 복사하는 방법으로 가져오는 듯함)
- 근데 이 역할을 왜 생성자로 하는가?
	- 생성자가 **객체 생성 + 초기화**를 둘 다 하니까
    - 객체 생성: Entity는 그냥 놓고 DTO라는 데이터 전달용 그릇을 쓰겠다는 건데, DTO도 객체니까 객체를 만들어야 함
    - 초기화: 조회할 값을 Entity에서 받아와서 저장해야 하는데 이 과정에서 초기화 필요
    - 그리고 DTO에 복사해서 저장한 값을 컨트롤러에다가 응답 데이터로 리턴(유저랑 소통하는 건 컨트롤러니까)
- `new UserResponseDto(user)`: 컨트롤러에서 `UserResponseDto`를 응답으로 만들 때 사용

#### 코드
```java
package org.example.demo3.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.demo3.domain.user.User;

@Getter
@NoArgsConstructor
public class UserResponseDto {

    private String username;
    private String nickname;
    private String email;

    //조회할 데이터를 Entity에서 받아와서 저장하는 역할
    //생성자 쓰는 이유: 객체 생성 + 초기화 동시에 가능
    //운영자 기준으로도 password는 포함 X
    //보안 이슈, 법적 책임, 어차피 해시 처리해서 복호화 불가
    public UserResponseDto(User user) {
        this.username = user.getUsername();
        this.nickname = user.getNickname();
        this.email = user.getEmail();
    }
}
```

### UserService.java
- DDD, DTO 구조에 맞게 코드 수정
```java
package org.example.demo3.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.demo3.domain.user.User;
import org.example.demo3.domain.user.dto.UserResponseDto;
import org.example.demo3.domain.user.dto.UserUpdateDto;
import org.example.demo3.domain.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @GetMapping //전체 조회 요청 처리(ResponseDto 사용)
    //ResponseEntity가 뭔지, findAll()이 뭔지
    public ResponseEntity<List<UserResponseDto>> findAll() {
        List<User> users = userService.findAll();
        List<UserResponseDto> response = users.stream()
                .map(UserResponseDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> findById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        return user.map(value -> ResponseEntity.ok(new UserResponseDto(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody UserUpdateDto dto) {
        userService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
```

> 추후 추가할 기능
- 본인 정보 조회
- 닉네임/username(id)로 검색
- 운영자 전용 전체 조회
- 페이징 처리
- 회원 상태/가입일 관리

# 2. 페이징 처리(회원 목록 조회)
> - 스터디 진도에 페이징 처리가 있어서 file, post dto 추가 전에 페이징부터
- 회원 전체 조회 기능에 페이징 추가를 목표로

## 사용법(Repository -> Service -> Controller)

### Repository
- **`JpaRepository`는 이미 페이진 관련 구현이 되어있음**
- 따라서 `JpaRepository`를 상속받은 `UserRepository` 인터페이스는 따로 수정할 것이 없음 => 그래도 페이징 쿼리 사용 가능
- `findAll(Pageable pageable)` 메서드는 **이미 JPA 내부 구현체에 존재**

### Service
- 회원 전체 조회 기능을 페이징으로 교체
```java
//전체 조회를 페이징으로 할 것
//jpa가 알아서 페이징 만들어 놔서 service에선 그냥 그거 땡겨와서 쓰는 코드만 작성
public Page<User> findAll(Pageable pageable){
     return userRepository.findAll(pageable);

    }
```
### Controller
- 페이징된 회원 목록 조회 기능 추가

```java
//회원 전체 목록 조회 코드만 수정
//페이징을 써서 전체 회원 목록 조회를 할 수 있게 수정
@GetMapping("/page")
public ResponseEntity<Page<UserResponseDto>> findAllPaged(
       @PageableDefault(size = 10, sort = "id") Pageable pageable) {

        Page<User> userPage = userService.findAll(pageable);
        Page<UserResponseDto> responsePage = userPage.map(UserResponseDto::new);
        return ResponseEntity.ok(responsePage);
    }
```

**1**.`@GetMapping("/page")`
- 이 메서드를 `GET/api/users/page` 엔드 포인트에 매핑
-`/page`를 쓰면 기존 `/api/users`와 별도로 **페이징 전용 엔드 포인트**인 걸 명확하게 구분 가능
**2**.`ResponseEntity<Page<UserResponseDto>>`
- `ResponseEntity<…>`: 응답 헤더나 상태 코드를 제어할 수 있게 해 주는 래퍼 객체
- `Page<UserResponseDto>`: 실제 응답의 바디로, 페이징된 데이터(여기선 `UserResponseDto`)와 함께 페이징 메타데이터(현재 페이지, 전체 페이지 수 등)를 함께 담음
**3**. `@PageableDefault(size = 10, sort = "id") Pageable pageable`
- 스프링이 URL 쿼리 파라미터(`?page=0&size=5&sort=id,desc`)를 자동으로 Pageable 객체로 바인딩
- 기본값으로 `size = 10`, `sort = "id"`를 지정했기 때문에 파라미터가 없을 때는 페이지 크기 10, ID 기준으로 정렬
**4**. `Page<User> userPage = userService.findAll(pageable);`
- Service 계층이 페이징된 `User` 엔티티 데이터를 DB에서 가져오는 
**5**.` Page<UserResponseDto> responsePage = userPage.map(UserResponseDto::new);`
- `Page`는 `.map()` 메서드로 엔티티 리스트를 DTO 리스트로 즉시 변환 가능
- `UserResponseDto::new`는 `UserResponseDto(User user)` 생성자를 호출해서 각 `User` 객체를 `DTO`로 바꾸는 역할
**6**. `return ResponseEntity.ok(responsePage);`
- `200 OK` 상태 코드와 함께 `responsePage`를 응답 본문에 담아 클라이언트에 전송한다는 의미


## 예상되는 페이징 트러블슈팅
> 현재는 `User` 도메인만 구현되어 있어 문제가 없지만, `Post`, `File` 도메인을 추가하면 다음과 같은 문제들이 발생 가능성 있음 => 추후에 해결 고려

| 문제 유형                | 발생 시점                                                             | 원인 및 상황 설명                                                                                                | 해결 방향                                                                  |
| -------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ❗ **N+1 문제**         | Post/File 도메인 추가 후 연관 엔티티(`@ManyToOne`, `@OneToMany`)를 LAZY 로딩할 때 | - 페이징 조회 이후 각 유저의 게시글/파일을 조회하면 매번 추가 쿼리가 나감<br>- 즉, `users`는 한 번에 가져왔지만 `posts` 또는 `files`는 개별 쿼리로 N번 실행됨 | - `@EntityGraph` 또는 **Fetch Join**으로 일괄 조회<br>- 필요 시 DTO에서 필요한 데이터만 추출 |
| ❗ **COUNT 쿼리 성능 문제** | 검색 조건이 많아지고 조인 대상이 늘어날 때                                          | - `Page<User>` 조회 시 JPA가 `select count(*)` 쿼리도 자동 생성<br>- 복잡한 조인 구조에서는 이 COUNT 쿼리가 느림                     | - `@Query`에 `countQuery` 따로 작성해서 성능 최적화                                |
| ❗ **데이터 불일치 문제**     | 데이터 변경이 빈번한 경우                                                    | - 사용자가 페이지를 넘기는 동안 데이터가 추가/삭제됨<br>- 그 결과 중복/누락 현상이 발생할 수 있음                                               | - 일반 페이징 대신 **커서 기반 페이징** 적용 고려<br>- 또는 **트랜잭션 격리 수준** 조정              |



# 3. 예외 처리 구조(BlogException + ErrorCode 기본 틀 도입