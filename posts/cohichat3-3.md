---
title: '[3주차/4주차] 회고록 -3- 설계와 구현 이야기: 기술 선택의 고민들'
slug: cohichat3-3
date: 2026-01-19T07:09:20.361Z
tags: []
---
# 설계와 구현의 기술 - 아키텍처와 의사결정

기간 자체도 길고, 고민이 많았기 때문에 지연된 것이라 분량이 매우 많다. 그래서 이번 회고록은 게시글을 3개로 나눠 작성하게 되었다.

- 1부: 협업과 성장 (팀워크 & 프로세스)
- 2부: 좋은 프로그램 만들기 (테스트 & 품질)
- **3부: 설계와 구현 이야기 (기술 선택의 고민들)** ← 지금 여기

---

## 1. 기능 구현보다 설계가 훨씬 중요함

### 문제 상황: "일단 돌아가게"의 함정

프로젝트 초반, 나는 "일단 Member 도메인 구현하고..."라는 생각으로 코드를 작성했다. 파이썬 코드를 자바로 마이그레이션하면서 **파이썬 코드를 분석하지 않고 자바의 특성을 이용할 태도 자체가 안 됐다**.

결과적으로:
- 거대한 PR
- 설계 리뷰에서 많은 피드백
- 일정 지연

### 설계를 어떻게 해야 했을까?

**Before (기능 중심 사고)**:
```
1. 회원가입 API 만들기
2. 로그인 API 만들기
3. 회원 정보 조회 API 만들기
→ "API가 동작하면 됐지"
```

**After (설계 중심 사고)**:
```
1. 도메인 이해
   - Member 엔티티의 책임은?
   - 어떤 불변식을 지켜야 하는가?
   
2. 유스케이스 정의
   - 회원가입 시나리오는?
   - 인증/인가 흐름은?
   
3. 계층별 책임 분리
   - Controller: 요청/응답 변환
   - Service: 비즈니스 로직
   - Repository: 데이터 접근
   
4. 구현
   - 설계에 맞춰 코드 작성
```

### 설계의 중요성을 체감한 순간

PR 리뷰에서:
- "왜 이 로직이 Controller에 있나요?"
- "Entity가 너무 많은 책임을 가지고 있어요"
- "이 메서드의 책임이 명확하지 않아요"

이런 피드백들은 모두 **"설계를 먼저 하지 않았기 때문"**에 발생한 문제였다.

### 배운 점

**Keep**: 코드 작성 전 고민하기  
**Problem**: 기능 구현 우선, 설계 후순위  
**Try**: 
- 코드 작성 전 도메인 이해
- 유스케이스 먼저 정의
- 계층별 책임 명확히
- "왜 이렇게 설계했는가?" 설명 가능한 상태로

---

## 2. 책임의 경계 - Controller와 Entity의 역할 정리

### 문제 상황: 모호한 책임 분리

PR 리뷰에서 **Controller랑 Entity 리뷰를 보면 책임 자체에 대해 정리가 필요**하다는 피드백을 많이 받았다.

### 올바른 책임 분리

**Controller는**:
- HTTP 요청/응답 처리
- DTO ↔ Domain 변환
- 예외를 HTTP 상태 코드로 변환
- **비즈니스 로직 X**

#### Service의 책임

**Service는**:
- 비즈니스 로직 조율
- 트랜잭션 관리
- 여러 도메인 객체 협력
- **도메인의 불변식 지키기**

#### Entity의 책임

**Entity는**:
- 도메인 개념 표현
- 자신의 데이터 보호 (캡슐화)
- 도메인 규칙 검증
- **외부 의존성 X** (Service, Repository 등)

### 계층별 의존 방향

```
Controller → Service → Repository
    ↓          ↓
   DTO      Domain
```

- **상위 계층은 하위 계층을 의존**
- **하위 계층은 상위 계층을 모름**
- Entity는 Service를 모르고, Service는 Controller를 모름

### 배운 점

**Keep**: 계층 분리 시도  
**Problem**: 책임 경계 모호, 비즈니스 로직 분산  
**Try**: 
- Controller: HTTP 처리만
- Service: 비즈니스 로직 조율
- Entity: 도메인 로직과 불변식
- 의존 방향 준수

---

## 3. 빌더 vs 생성자 vs 정적 팩토리 메서드

### 문제 상황: "그냥 생성자 쓰면 안 돼?"

객체를 생성하는 방법이 여러 개 있다는 걸 알았지만, **언제 뭘 써야 하는지** 명확하지 않았다.

### 세 가지 방법의 비교

#### 1. 생성자 (Constructor)

```java
public class Member {
    private String email;
    private String password;
    private String nickname;
    
    // 문제점: 매개변수가 많아지면 가독성 저하
    public Member(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }
}

// 사용
Member member = new Member("test@test.com", "password", "테스터");
// 어떤 게 email이고 어떤 게 password인지 헷갈림
```

**장점**:
- 간단하고 직관적
- 불변 객체 만들기 쉬움

**단점**:
- 매개변수가 많으면 가독성 저하
- 같은 타입 매개변수가 여러 개면 실수하기 쉬움
- 선택적 매개변수 처리 어려움

#### 2. 정적 팩토리 메서드 (Static Factory Method)

```java
public class Member {
    private String email;
    private String password;
    private String nickname;
    
    private Member(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }
    
    // 의도를 명확히 표현
    public static Member create(String email, String password, String nickname) {
        validateEmail(email);
        validatePassword(password);
        return new Member(email, password, nickname);
    }
    
    // 다양한 생성 방법 제공
    public static Member createWithDefaultNickname(String email, String password) {
        return new Member(email, password, generateDefaultNickname());
    }
    
    // 싱글톤이나 캐싱 가능
    public static Member guest() {
        return GUEST_MEMBER; // 미리 만들어둔 인스턴스 반환
    }
}

// 사용
Member member = Member.create("test@test.com", "password", "테스터");
Member guest = Member.guest();
```

**장점**:
- **이름으로 의도를 표현** (create, of, from, getInstance 등)
- 같은 타입의 다양한 생성 방법 제공 가능
- 객체 생성을 제어 (싱글톤, 캐싱, 불변 객체 풀 등)
- 하위 타입 반환 가능

**단점**:
- 매개변수가 많으면 여전히 가독성 문제
- 생성자가 private이면 상속 불가

**사용 시기**:
- 생성 의도를 명확히 표현하고 싶을 때
- 객체 생성을 제어하고 싶을 때
- 같은 타입의 다양한 생성 방법이 필요할 때

#### 3. 빌더 (Builder Pattern)

```java
public class Member {
    private String email;
    private String password;
    private String nickname;
    private LocalDate birthDate;
    private String phoneNumber;
    
    // Lombok @Builder 또는 직접 구현
    @Builder
    private Member(String email, String password, String nickname, 
                   LocalDate birthDate, String phoneNumber) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
    }
}

// 사용
Member member = Member.builder()
    .email("test@test.com")
    .password("password")
    .nickname("테스터")
    .birthDate(LocalDate.of(1990, 1, 1))
    .build();

// 선택적 매개변수 처리 쉬움
Member simpleMember = Member.builder()
    .email("test@test.com")
    .password("password")
    .build(); // nickname, birthDate, phoneNumber는 null
```

**장점**:
- **매개변수가 많아도 가독성 좋음**
- 선택적 매개변수 처리 쉬움
- 메서드 체이닝으로 유창한 API

**단점**:
- 코드가 장황함 (Lombok 없으면)
- 객체 생성 비용이 약간 높음
- 불변성 보장 위해 추가 작업 필요

**사용 시기**:
- 매개변수가 4개 이상일 때
- 선택적 매개변수가 많을 때
- 가독성이 중요할 때

### 실전 선택 기준

```java
// 매개변수 1-2개, 필수만: 생성자
public class Email {
    private String value;
    
    public Email(String value) {
        this.value = value;
    }
}

// 매개변수 2-3개, 의도 표현 필요: 정적 팩토리 메서드
public class Money {
    private BigDecimal amount;
    private Currency currency;
    
    private Money(BigDecimal amount, Currency currency) {
        this.amount = amount;
        this.currency = currency;
    }
    
    public static Money won(long amount) {
        return new Money(BigDecimal.valueOf(amount), Currency.KRW);
    }
    
    public static Money dollar(double amount) {
        return new Money(BigDecimal.valueOf(amount), Currency.USD);
    }
}

// 매개변수 4개 이상, 선택적 많음: 빌더
@Builder
public class Order {
    private String orderId;
    private Member member;
    private List<OrderItem> items;
    private Address shippingAddress;
    private PaymentMethod paymentMethod;
    private String couponCode;        // 선택
    private String memo;              // 선택
    private LocalDateTime orderedAt;
}
```

### 배운 점

**Keep**: 다양한 생성 방법 시도  
**Problem**: 언제 뭘 써야 하는지 명확하지 않았음  
**Try**: 
- 매개변수 개수와 의도로 판단
- 필수 vs 선택 고려
- 팀 컨벤션 따르기

---

## 4. 구현할 때의 태도 - 기술/라이브러리 선택 시 '왜?'를 생각하기

### 문제 상황: "그냥 써봤어요"

PR 리뷰에서 이런 질문들을 받았다:
- "왜 record를 썼나요?"
- "왜 Mapper를 안 썼나요?"
- "왜 이 라이브러리를 사용했나요?"

대답할 수 없었다. **그냥 봤더니 좋아 보여서, 다른 사람들이 쓰길래** 사용했기 때문이다.

### 의사결정의 부재

**한 줄씩 "왜?"를 설명해 보기, 해당 기술 or 라이브러리 쓸 때 "왜?"를 생각해 보기**를 하지 않았다.

결과:
- 선택의 근거 없음
- 대안 비교 없음
- 트레이드오프 이해 없음

### Case 1: Record vs Class

#### Record
```java
public record MemberResponse(
    Long id,
    String email,
    String nickname
) {}
```

**장점**:
- 불변 객체 (immutable)
- equals, hashCode, toString 자동 생성
- 간결한 코드

**단점**:
- 모든 필드가 final
- 상속 불가
- 커스텀 로직 추가 제한적

**언제 사용?**
- DTO, VO처럼 단순 데이터 전달용
- 불변성이 보장돼야 할 때
- equals/hashCode가 필요할 때

#### Class
```java
public class MemberResponse {
    private Long id;
    private String email;
    private String nickname;
    
    // getter, setter, equals, hashCode, toString 직접 작성
    // 또는 Lombok 사용
}
```

**장점**:
- 유연함 (상속, 확장 가능)
- 커스텀 로직 자유롭게 추가
- 변경 가능 (mutable) 객체도 가능

**단점**:
- 보일러플레이트 코드 많음
- 불변성 보장 안 됨 (final 직접 명시 필요)

**언제 사용?**
- 상속이 필요할 때
- 복잡한 로직이 필요할 때
- 변경 가능한 객체가 필요할 때

**내 선택:**
- 모든 DTO를 Class로 통일
- 이유:
1. Jackson 직렬화/역직렬화 호환성
2. 필드 추가 시 유연성 (정적 팩토리 메서드만 수정)
3. 일관성 (모든 DTO가 같은 패턴)
4. 향후 확장 가능성 (상속, 커스텀 로직)

### Case 2: Mapper 라이브러리 vs 정적 팩토리 메서드

#### MapStruct / ModelMapper
```java
// MapStruct
@Mapper(componentModel = "spring")
public interface MemberMapper {
    MemberResponse toResponse(Member member);
    MemberDto toDto(Member member);
}

// ModelMapper
ModelMapper mapper = new ModelMapper();
MemberResponse response = mapper.map(member, MemberResponse.class);
```

**장점**:
- 반복 코드 자동 생성
- 복잡한 매핑 처리 가능
- 여러 엔티티 조합 용이

**단점**:
- 의존성 추가
- 학습 곡선 (특히 MapStruct)
- 단순 매핑엔 오버엔지니어링

#### 정적 팩토리 메서드

**장점**:
- 의존성 없음
- 명확하고 직관적
- 디버깅 쉬움
- IDE 지원 완벽

**단점**:
- 필드 많으면 코드 길어짐
- 여러 엔티티 조합 시 복잡해질 수 있음

**언제 Mapper 라이브러리가 필요한가?**
1. **필드/엔티티 개수가 많을 때**
   - 10개 이상의 필드
   - 여러 엔티티를 조합해야 할 때

2. **복잡한 변환이 필요할 때**
   - 타입 변환 로직이 복잡
   - 조건부 매핑
   - 중첩된 객체 변환

3. **매핑 로직이 반복될 때**
   - 같은 패턴의 매핑이 수십 개

**내 선택**:
- **정적 팩토리 메서드 선택**
- 이유:
  1. 단순 1:1 매핑이 대부분
  2. 필드 개수가 적음 (3-5개)
  3. 복잡한 변환 불필요
  4. 의존성 최소화
- Mapper가 필요한 경우: 필드 개수가 많아지거나, 여러 엔티티를 조합하거나, 복잡한 변환이 필요할 때 고려

### Case 3: Refresh Token - DB vs Redis

#### DB 저장
```java
@Entity
public class RefreshToken {
    @Id
    private String token;
    private Long memberId;
    private LocalDateTime expiresAt;
}
```

**장점**:
- 영속성 보장 (서버 재시작해도 유지)
- 복잡한 쿼리 가능
- 트랜잭션 관리 용이

**단점**:
- 조회 속도 느림
- DB 부하 증가
- 만료 토큰 정리 작업 필요

#### Redis 저장
```java
@RedisHash(value = "refreshToken", timeToLive = 604800) // 7일
public class RefreshToken {
    @Id
    private String token;
    private Long memberId;
}
```

**장점**:
- **빠른 조회 속도** (메모리 기반)
- TTL 자동 만료
- DB 부하 분산

**단점**:
- 영속성 약함 (메모리 날아가면 손실)
- 복잡한 쿼리 제한적
- 추가 인프라 필요

**선택 기준**:
- 성능 중요, 단순 조회 → Redis
- 영속성 중요, 복잡한 관리 → DB
- 하이브리드: 단기는 Redis, 장기는 DB

**내 선택**:
- Redis 선택 (성능, TTL 자동 관리)
- 단, Redis 장애 시 대응 방안 필요

### 의사결정 프로세스

```
1. 요구사항 파악
   - 무엇을 해결하려는가?
   
2. 대안 탐색
   - 어떤 선택지가 있는가?
   
3. 장단점 비교
   - 각각의 트레이드오프는?
   
4. 선택 기준 설정
   - 우리 상황에서 중요한 건?
   
5. 의사결정
   - 근거와 함께 선택
   
6. 문서화
   - "왜"를 기록
```

### 실제 적용 예시

**잘못된 의사결정**:
```
"다른 프로젝트에서 MapStruct 쓰더라"
→ 우리 프로젝트에도 MapStruct 도입
→ 단순 매핑에 오버엔지니어링
```

**올바른 의사결정**:
```
1. 요구사항: Entity ↔ DTO 변환
2. 대안: MapStruct vs ModelMapper vs 정적 팩토리 메서드
3. 우리 상황:
   - 필드 3-5개 (단순)
   - 1:1 매핑 (복잡한 변환 없음)
   - 의존성 최소화 선호
4. 결정: 정적 팩토리 메서드
5. 근거: 단순한 매핑에는 명시적 코드가 더 명확하고 관리하기 쉬움
```

### 배운 점

**Keep**: 다양한 기술 시도  
**Problem**: 선택 근거 없음, "왜?"에 대한 답변 불가, 무조건 최신/유명 기술 사용  
**Try**: 
- 기술 선택 전 대안 비교
- 우리 프로젝트 상황 먼저 파악
- 장단점, 트레이드오프 파악
- **과도한 기술 적용 경계** (YAGNI 원칙)
- 선택 이유 문서화

---

## 5. Spring Security 구현

### 인증과 인가의 이해

프로젝트에서 **Spring Security를 구현**하면서 인증/인가에 대한 이해가 필요했다.

#### 인증 (Authentication)
"너 누구야?"
- 사용자의 신원을 확인
- 로그인, JWT 검증 등

#### 인가 (Authorization)
"너 이거 할 수 있어?"
- 인증된 사용자의 권한 확인
- 역할 기반 접근 제어 (RBAC)

### Spring Security 기본 구조

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter(), 
                            UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### JWT 기반 인증 흐름

```
1. 로그인 (POST /api/auth/login)
   ↓
2. Access Token + Refresh Token 발급
   ↓
3. 클라이언트, Access Token을 헤더에 담아 요청
   ↓
4. JwtAuthenticationFilter에서 토큰 검증
   ↓
5. SecurityContext에 인증 정보 저장
   ↓
6. Controller에서 @AuthenticationPrincipal로 사용자 정보 접근
```

### 세션 vs JWT

#### 세션 기반 인증
```java
// 로그인 시 세션 생성
HttpSession session = request.getSession();
session.setAttribute("memberId", member.getId());

// 인증 확인
Long memberId = (Long) session.getAttribute("memberId");
```

**장점**:
- 서버에서 세션 제어 가능
- 강제 로그아웃 쉬움
- 보안 (토큰 탈취 위험 낮음)

**단점**:
- 서버 메모리 사용 (확장성 문제)
- 분산 환경에서 세션 공유 필요
- CORS 문제

#### JWT 기반 인증
```java
// 로그인 시 JWT 발급
String accessToken = jwtProvider.createAccessToken(member.getId());
String refreshToken = jwtProvider.createRefreshToken(member.getId());

// 인증 확인
Claims claims = jwtProvider.parseClaims(token);
Long memberId = claims.get("memberId", Long.class);
```

**장점**:
- Stateless (서버 메모리 사용 안 함)
- 확장성 좋음 (분산 환경 유리)
- 모바일 앱에 적합

**단점**:
- 토큰 탈취 시 대응 어려움
- 강제 로그아웃 어려움
- 토큰 크기 큼

**선택 기준**:
- 모바일 앱, 마이크로서비스 → JWT
- 웹 애플리케이션, 단일 서버 → 세션
- 하이브리드: 단기는 JWT, 중요 작업은 세션

### @PreAuthorize 활용

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    // 메서드 레벨 권한 체크
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserResponse> getUsers() {
        // ADMIN 역할을 가진 사용자만 접근 가능
    }
    
    // SpEL 표현식 활용
    @PreAuthorize("hasRole('ADMIN') or #memberId == authentication.principal.id")
    @GetMapping("/users/{memberId}")
    public UserResponse getUser(@PathVariable Long memberId) {
        // ADMIN이거나 본인인 경우만 접근 가능
    }
    
    // 커스텀 권한 체크
    @PreAuthorize("@memberSecurity.canAccessMember(#memberId)")
    @PutMapping("/users/{memberId}")
    public UserResponse updateUser(@PathVariable Long memberId, @RequestBody UpdateRequest request) {
        // 커스텀 로직으로 권한 체크
    }
}
```

**@PreAuthorize vs SecurityConfig**:
- SecurityConfig: URL 패턴 기반, 전역 설정
- @PreAuthorize: 메서드 레벨, 세밀한 제어

### 배운 점

**Keep**: Spring Security 적용  
**Problem**: 인증/인가 개념 혼동, 설정 복잡  
**Try**: 
- 인증과 인가 명확히 구분
- JWT vs 세션 트레이드오프 이해
- @PreAuthorize로 세밀한 권한 제어
- 보안 설정 문서화

---

## 5. Spring Security와 인증/인가 구현

### 인증과 인가의 이해

프로젝트에서 회원가입, 로그인, 로그아웃 기능을 구현하면서 **인증/인가**에 대한 깊은 이해가 필요했다.

#### 인증 (Authentication)
"너 누구야?"
- 사용자의 신원을 확인하는 과정
- 예: 로그인, JWT 토큰 검증

#### 인가 (Authorization)
"너 이거 할 수 있어?"
- 인증된 사용자가 특정 리소스에 접근할 권한이 있는지 확인
- 예: ADMIN만 회원 목록 조회 가능

### 회원가입/로그인/로그아웃 프로세스

#### 1. 회원가입 흐름

```
1. 클라이언트: POST /api/auth/signup
   {
     "email": "user@example.com",
     "password": "password123",
     "nickname": "유저"
   }
   ↓
2. Controller: @Valid로 입력값 검증
   ↓
3. Service: 
   - 이메일 중복 체크
   - 비밀번호 암호화 (BCrypt)
   - Member 엔티티 생성
   - DB 저장
   ↓
4. 응답: 201 Created + 회원 정보
```

#### 2. 로그인 흐름

```
1. 클라이언트: POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ↓
2. Controller: 로그인 요청 받음
   ↓
3. Service:
   - 이메일로 회원 조회
   - 비밀번호 검증 (BCrypt matches)
   - JWT Access Token 생성 (15분)
   - JWT Refresh Token 생성 (7일)
   - Refresh Token은 Redis에 저장
   ↓
4. 응답: 200 OK
   {
     "accessToken": "eyJhbGc...",
     "refreshToken": "eyJhbGc...",
     "member": { ... }
   }
   ↓
5. 클라이언트: Access Token을 로컬 저장소에 저장
   이후 모든 요청 헤더에 포함
   Authorization: Bearer {accessToken}
```

#### 3. 인증이 필요한 API 요청 흐름

```
1. 클라이언트: GET /api/members/me
   Header: Authorization: Bearer {accessToken}
   ↓
2. JwtAuthenticationFilter:
   - 헤더에서 토큰 추출
   - 토큰 유효성 검증 (만료, 서명)
   - 토큰에서 memberId 추출
   - SecurityContext에 인증 정보 저장
   ↓
3. Controller: @AuthenticationPrincipal로 사용자 정보 접근
   ↓
4. Service: 비즈니스 로직 처리
   ↓
5. 응답: 200 OK + 사용자 정보
```

#### 4. Access Token 만료 시 재발급 흐름

```
1. 클라이언트: API 요청
   ↓
2. 서버: 401 Unauthorized (Access Token 만료)
   ↓
3. 클라이언트: POST /api/auth/refresh
   {
     "refreshToken": "eyJhbGc..."
   }
   ↓
4. Service:
   - Refresh Token 검증
   - Redis에서 Refresh Token 확인
   - 새로운 Access Token 발급
   ↓
5. 응답: 200 OK
   {
     "accessToken": "eyJhbGc..."
   }
   ↓
6. 클라이언트: 새 Access Token으로 API 재요청
```

#### 5. 로그아웃 흐름

```
1. 클라이언트: POST /api/auth/logout
   Header: Authorization: Bearer {accessToken}
   ↓
2. Service:
   - Redis에서 Refresh Token 삭제
   - (선택) Access Token을 블랙리스트에 추가
   ↓
3. 응답: 200 OK
   ↓
4. 클라이언트: 로컬 저장소의 토큰 삭제
```

### 세션 vs 쿠키 vs JWT

#### 세션 기반 인증
```java
// 로그인 시 세션 생성
HttpSession session = request.getSession();
session.setAttribute("memberId", member.getId());

// 인증 확인
Long memberId = (Long) session.getAttribute("memberId");
```

**장점**:
- 서버에서 세션 제어 가능
- 강제 로그아웃 쉬움
- 토큰 탈취 위험 낮음

**단점**:
- 서버 메모리 사용 (확장성 문제)
- 분산 환경에서 세션 공유 필요 (Redis 등)
- CORS 문제

#### 쿠키 기반 인증
```java
// 로그인 시 쿠키 생성
Cookie cookie = new Cookie("memberId", member.getId().toString());
cookie.setHttpOnly(true);  // XSS 방지
cookie.setSecure(true);    // HTTPS only
response.addCookie(cookie);
```

**장점**:
- 브라우저가 자동으로 쿠키 전송
- HttpOnly 플래그로 XSS 방지

**단점**:
- CSRF 공격 취약
- 모바일 앱에서 사용 어려움
- 도메인 제한

#### JWT 기반 인증
```java
// 로그인 시 JWT 발급
String accessToken = jwtProvider.createAccessToken(member.getId());
String refreshToken = jwtProvider.createRefreshToken(member.getId());

// 인증 확인
Claims claims = jwtProvider.parseClaims(token);
Long memberId = claims.get("memberId", Long.class);
```

**장점**:
- **Stateless** (서버 메모리 사용 안 함)
- **확장성** 좋음 (분산 환경 유리)
- 모바일 앱에 적합
- CORS 문제 없음

**단점**:
- 토큰 탈취 시 대응 어려움
- 강제 로그아웃 구현 복잡 (Redis 블랙리스트 필요)
- 토큰 크기 큼

### JWT 채택 이유

**우리 프로젝트의 선택: JWT**

```
1. 세션의 문제점:
   - 서버 재시작 시 세션 소실
   - 서버 증설 시 세션 공유 필요
   - 메모리 사용량 증가

2. JWT의 장점:
   - Stateless: 서버 부담 감소
   - 분산 환경 적합
   - 모바일 친화적

3. JWT의 단점 보완:
   - Access Token (60분): 짧은 유효기간으로 탈취 위험 최소화
   - Refresh Token (7일): Redis 저장으로 강제 로그아웃 구현
   - Redis 블랙리스트: 긴급 토큰 무효화 가능
```

**JWT 토큰 구조**:
```
eyJhbGc...  (Header: 알고리즘 정보)
.eyJzdWI... (Payload: 사용자 정보, 만료시간)
.SflKxwR... (Signature: 검증 서명)
```

### Spring Security의 장단점 체감

#### 장점: 빠른 구현
- 인증/인가 로직을 프레임워크가 처리
- 보안 관련 기능 제공 (CSRF, CORS, BCrypt 등)
- 커뮤니티와 문서 풍부

#### 단점: 책임이 너무 커짐
프로젝트를 진행하면서 **Spring Security의 책임이 너무 커진다**는 것을 체감했다.

**문제 상황**:
```
1. 간단한 기능 추가하려는데...
   → SecurityConfig 수정 필요
   → Filter 체인 이해 필요
   → Security Context 관리 필요

2. 디버깅이 어려움
   → Filter가 여러 개 연결
   → 어디서 막혔는지 추적 어려움
   → Security 내부 동작 이해 필요

3. 커스터마이징 제약
   → Security의 방식을 따라야 함
   → 자유로운 설계 어려움
   → "뭐만 하면 여기서 뻑남"
```

**예시: 간단한 권한 체크인데...**
```java
// 이렇게 하고 싶었는데
if (member.isAdmin()) {
    // 처리
}

// Security는 이렇게 하라고 함
@PreAuthorize("hasRole('ADMIN')")
public void doSomething() {
    // 처리
}

// 그런데 이게 안 되면?
// → SecurityConfig 뒤지기
// → Filter 순서 확인
// → Authentication 객체 확인
// → 결국 Security에 묶여버림
```

#### 대안: Security 직접 구현 검토

```
현재: Spring Security 사용
문제: 책임 과중, 자율성 저하, 디버깅 어려움

대안: 인증/인가 직접 구현
장점:
- 간단명료한 로직
- 완전한 제어
- 쉬운 디버깅
- 팀 프로젝트에 맞는 설계

단점:
- 구현 시간 필요
- 보안 취약점 가능성
- 검증된 프레임워크 아님

결정: 아직 바꾸지 않음
이유:
- 현재 Spring Security로도 동작 중
- 리팩토링 우선순위 낮음
- 하지만 이슈로 등록 (#123)
- 추후 트래픽 증가 시 재검토
```

**직접 구현한다면?**
```java
// 1. JWT 유틸리티
public class JwtProvider {
    public String createToken(Long memberId) { ... }
    public boolean validateToken(String token) { ... }
    public Long getMemberId(String token) { ... }
}

// 2. 인증 인터셉터
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, ...) {
        String token = extractToken(request);
        if (jwtProvider.validateToken(token)) {
            Long memberId = jwtProvider.getMemberId(token);
            request.setAttribute("memberId", memberId);
            return true;
        }
        throw new UnauthorizedException();
    }
}

// 3. 권한 체크 어노테이션
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireAuth {
    Role[] roles() default {};
}

// 4. AOP로 권한 체크
@Aspect
public class AuthAspect {
    @Around("@annotation(requireAuth)")
    public Object checkAuth(ProceedingJoinPoint pjp, RequireAuth requireAuth) {
        Long memberId = (Long) request.getAttribute("memberId");
        Member member = memberService.findById(memberId);
        
        if (!hasRequiredRole(member, requireAuth.roles())) {
            throw new ForbiddenException();
        }
        
        return pjp.proceed();
    }
}
```

**이렇게 하면**:
- Security 의존성 제거
- 간단한 로직 (JWT + 인터셉터 + AOP)
- 완전한 제어권
- 팀원 모두 이해 가능

### 배운 점

**Keep**: 
- JWT 기반 인증 구현
- Access + Refresh Token 전략
- 인증/인가 흐름 이해

**Problem**: 
- Spring Security의 과도한 책임
- 자율성 저하 ("뭐만 하면 뻑남")
- 디버깅 어려움
- 커스터마이징 제약

**Try**: 
- 인증/인가 직접 구현 검토 (이슈 등록)
- 프레임워크 의존도 낮추기
- 간단하고 명확한 설계 추구
- 트레이드오프 지속 관찰

---

## 7. @Email 검증과 Bean Validation

### 문제 상황: 검증 로직의 중복

```java
// Controller마다 검증 로직 중복
@PostMapping("/members")
public ResponseEntity<?> register(@RequestBody MemberRequest request) {
    if (request.getEmail() == null || !request.getEmail().contains("@")) {
        throw new IllegalArgumentException("유효하지 않은 이메일");
    }
    // ...
}
```

### Bean Validation 활용

#### @Email 어노테이션
```java
public class MemberRequest {
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 형식이 아닙니다")
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 20, message = "비밀번호는 8-20자여야 합니다")
    private String password;
    
    @Pattern(regexp = "^[가-힣a-zA-Z0-9]{2,10}$", 
             message = "닉네임은 2-10자의 한글, 영문, 숫자만 가능합니다")
    private String nickname;
}
```

#### Controller에서 @Valid 사용
```java
@PostMapping("/members")
public ResponseEntity<MemberResponse> register(
    @Valid @RequestBody MemberRequest request  // @Valid 추가
) {
    // 검증 통과한 데이터만 여기 도달
    Member member = memberService.register(request.toCommand());
    return ResponseEntity.ok(MemberResponse.from(member));
}
```

### Bean Validation 어노테이션 정리

| 어노테이션 | 설명 | 예시 |
|----------|------|------|
| `@NotNull` | null 불가 | `@NotNull Long id` |
| `@NotBlank` | null, 빈 문자열, 공백 불가 | `@NotBlank String email` |
| `@Email` | 이메일 형식 검증 | `@Email String email` |
| `@Size` | 문자열, 컬렉션 크기 | `@Size(min=2, max=10)` |
| `@Min`, `@Max` | 숫자 범위 | `@Min(0) @Max(100)` |
| `@Pattern` | 정규식 검증 | `@Pattern(regexp="^[0-9]+$")` |
| `@Past`, `@Future` | 날짜 검증 | `@Past LocalDate birthDate` |

### 배운 점

**Keep**: 검증 로직 작성  
**Problem**: 검증 로직 중복, Controller에 분산  
**Try**: 
- Bean Validation 활용
- DTO에 검증 로직 집중
- @Valid로 자동 검증
- 커스텀 Validator 필요 시 작성

> "검증 로직은 Controller가 아닌 DTO에 선언적으로 작성하라."

---

## 8. 닉네임 생성기 - 오픈소스 라이브러리 직접 만들기

### 문제 상황: 적합한 닉네임 생성 라이브러리 부재

회원가입 시 닉네임을 입력하지 않으면 자동으로 생성해 주는 기능이 필요했다. 기존 오픈소스 라이브러리를 찾아봤지만 문제가 있었다.

### 선택지 비교

#### 선택지 1: 기존 랜덤 문자열 생성 오픈소스 라이브러리 사용

**장점**:
- 빠른 구현
- 검증된 알고리즘
- 유지보수 불필요

**단점**:
- **원하는 형식이 아님** (랜덤 문자열)
- 커스터마이징 어려움
- 의존성 추가
- 서비스 톤앤매너와 안 맞음

#### 선택지 2: 프로젝트 내부에 직접 구현

```java
@Component
public class NicknameGenerator {
    
    private static final List<String> ADJECTIVES = List.of(
        "귀여운", "멋진", "행복한", "즐거운", "신나는"
    );
    
    private static final List<String> NOUNS = List.of(
        "토끼", "사자", "호랑이", "곰", "여우"
    );
    
    public String generate() {
        Random random = new Random();
        String adjective = ADJECTIVES.get(random.nextInt(ADJECTIVES.size()));
        String noun = NOUNS.get(random.nextInt(NOUNS.size()));
        int number = random.nextInt(1000);
        
        return adjective + noun + number;
    }
}
```

**장점**:
- 의존성 없음
- 원하는 형식으로 생성
- 빠른 구현

**단점**:
- **프로젝트 코드베이스 증가**
- 다른 프로젝트에서 재사용 불가
- 단어 목록 관리 부담
- 비즈니스 로직과 섞임

#### 선택지 3: 오픈소스 라이브러리 직접 만들기

**장점**:
- **완전한 커스터마이징**
- **재사용 가능** (다른 프로젝트에서도)
- 오픈소스 기여 경험
- 프로젝트 코드베이스 깔끔
- 포트폴리오 자산

**단점**:
- 초기 구현 시간 필요
- 배포 과정 학습 필요
- 유지보수 책임

### 내 선택: 오픈소스 라이브러리 직접 만들기

**결정 이유**:

1. **기존 라이브러리가 요구사항을 충족하지 못함**
   - 랜덤 문자열 ≠ 친근한 한국어 닉네임
   
2. **재사용 가능성**
   - 다른 한국 서비스들도 비슷한 니즈
   - 포트폴리오 자산으로 활용
   
3. **학습 기회**
   - 라이브러리 설계 경험
   - 오픈소스 유지보수 경험

4. **프로젝트 코드베이스 정리**
   - 비즈니스 로직과 유틸리티 분리
   - 의존성으로 관리

### 배운 점

**Keep**: 
- 문제 인식 (기존 라이브러리의 한계)
- 재사용 가능성 고려

**Problem**: 
- 없는 라이브러리를 찾느라 시간 소비
- "있을 거야" 가정

**Try**: 
- **없으면 만들자는 마인드**
- 오픈소스 기여 적극 고려
- 라이브러리 설계 학습
- 배포 프로세스 경험

---

## 시리즈 3 종합 회고

### Keep (계속할 것)
- 설계 우선 사고
- 계층별 책임 분리
- 의사결정 시 "왜?" 질문하기
- 대안 비교하고 선택
- Bean Validation 활용
- 보안 고려 (암호화, JWT 전략)

### Problem (개선 필요)
- "일단 돌아가게" 구현
- 설계 없이 코드 작성
- 책임 경계 모호
- 기술 선택 근거 부족
- 언어 특성 고려 안 함
- 검증 로직 중복

### Try (다음엔)
- 코드 작성 전 설계 먼저
- 계층별 책임 명확히
- 객체 생성 방법 상황에 맞게 선택
- 기술 선택 시 장단점 비교
- 트레이드오프 이해하고 결정
- 선택 이유 문서화
- DTO에 검증 로직 집중

### 핵심 깨달음

1. **설계가 명확하면 구현은 따라온다**
   - 테스트가 어렵다 = 설계가 안 됐다
   - 책임이 모호하다 = 설계가 안 됐다

2. **계층별 책임을 명확히 하라**
   - Controller: HTTP 처리
   - Service: 비즈니스 로직
   - Entity: 도메인 로직

3. **"왜?"를 항상 물어라**
   - 왜 이 기술을?
   - 왜 이 라이브러리를?
   - 왜 이렇게 설계했는가?

4. **트레이드오프를 이해하라**
   - 완벽한 선택은 없다
   - 상황에 맞는 선택이 있을 뿐

5. **검증은 선언적으로**
   - Bean Validation 활용
   - DTO에 집중
   - Controller는 깔끔하게