---
title: '[DB/JPA] 📦 Post 도메인 기능 보완: 매핑, DTO, 페이징, 통계 쿼리 – Inkpad 개발기 #8
'
slug: DBJPA-Post-도메인-기능-보완-매핑-DTO-페이징-통계-쿼리-Inkpad-개발기-8
date: 2025-06-28T02:56:24.567Z
tags: []
---
# 1. Post -> User 단방향 매핑
> **DB의 Join이랑 Mapping이랑 뭐가 다른 건데?**
🔹 연관관계 매핑 = JOIN을 위한 설계도
🔹 JPA가 필요에 따라 JOIN 쿼리를 짬 (fetch 전략 또는 명시적 JPQL)
🔹 우리는 단지 어노테이션만 붙여도 됨. 실제 JOIN은 JPA가 관리
>
**=> JPA의 연관관계 매핑(예: @ManyToOne)은 "Join 쿼리를 자동 생성하기 위한 설계도"**

## Post.java (일부)
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private User user;

```
-> 연관관계 매핑 코드 추가

# 2. DTO 추가

>**보통 엔티티 하나에 DTO가 `request`, `response`, `update` 이렇게 세 개가 한 세트일까?**
**=> 일반적인 구조임**

| DTO 이름          | 역할                                      | 예시 상황            | DB 관점            |
| --------------- | --------------------------------------- | ---------------- | ---------------- |
| **RequestDto**  | 사용자가 **처음 데이터를 제출할 때** 사용하는 DTO         | 글 작성, 회원가입       | → DB에 새로 저장할 데이터 |
| **UpdateDto**   | 기존 데이터를 **부분 수정**할 때 사용하는 DTO           | 글 제목/내용 수정       | → DB에 덮어쓸 데이터    |
| **ResponseDto** | DB에서 꺼낸 데이터를 **클라이언트에게 응답**할 때 사용하는 DTO | 글 상세 보기, 글 목록 보기 | ← DB에서 조회한 데이터   |

## PostRequestDto

### .toEntity() 안 쓰는 이유
```java
    public Post toEntity(){
        return Post.builder()
                .title(title)
                .content(content)
                .user(user) // <- 여기에 user가 없음
                .build();
    }
```
>-`PostRequestDto` 안에서 `.toEntity()`를 만들려면 `User` 객체가 **이미 있어야** 함
- 그런데 `userId`만 있으니까, 실제 `User`는 **DB에서 꺼내와야 함**
- 그러니까 그건 **Service 레이어에서 하자**

## PostService
> **리팩토링 방향**
| 구분      | 기존 코드                       | 리팩토링 후 코드                                                     |
| ------- | --------------------------- | ------------------------------------------------------------- |
| 요청/응답   | `Post` 직접 다룸                | DTO (`PostRequestDto`, `PostResponseDto`, `PostUpdateDto`) 도입 |
| 유저 주입   | 외부에서 직접 `Post` 만들고 넘김       | `userId` 기반으로 내부에서 `User` 조회 후 연관관계 설정                        |
| 반환 타입   | `Post` / `Optional<Post>` 등 | `PostResponseDto` 사용                                          |
| 트랜잭션 처리 | 일부만 있음                      | 수정(`@Transactional`)은 동일하게 유지                                 |


```java
import org.example.demo3.domain.post.dto.PostResponseDto;
import org.example.demo3.domain.post.dto.PostUpdateDto;
import org.example.demo3.domain.post.repository.PostRepository;
import org.example.demo3.domain.user.User;
import org.example.demo3.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    //DTO -> 엔티티 변환 + 연관관계 주입을 서비스 내부에서 책임지게 개선
    //1. 글 작성
    public void save(PostRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .user(user)
                .build();

        postRepository.save(post);
    }


    // 2. 전체 글 조회
    public List<PostResponseDto> findAll() {
        return postRepository.findAll().stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    // 3. 글 단건 조회
    public PostResponseDto findById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 글이 존재하지 않습니다."));
        return new PostResponseDto(post);
    }

    // 4. 글 수정
    @Transactional
    public void update(Long id, PostUpdateDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 글이 존재하지 않습니다."));
        post.update(dto.getTitle(), dto.getContent());
    }

    // 5. 글 삭제
    public void delete(Long id) {
        postRepository.deleteById(id);
    }
}

```

### 메모
| 질문                    | 답변                                                                     |
| --------------------- | ---------------------------------------------------------------------- |
| "주입이란?"               | 다른 객체(UserRepository 등)를 직접 만들지 않고, 스프링이 생성해서 자동으로 넣어주는 것              |
| `.user(user)` 빨간 줄 이유 | Post 엔티티의 `@Builder` 생성자에 `User user`가 빠졌기 때문                          |
| 해결법                   | `Post(String title, String content, User user)` 생성자 만들고 `@Builder` 붙이기 |

## PostController
> **목표**
- HTTP 요청을 **DTO**로 받음
- 응답은 **PostResponseDto**로 반환
- 수정 `@PutMapping`, 삭제 `@DeleteMapping`
- 작성자(user)는 `userId`로 전달 받아서 서비스에서 처리

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    // ✅ 1. 글 작성
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody PostRequestDto dto) {
        postService.save(dto);
        return ResponseEntity.ok().build();
    }
    // 🔍 기존에는 Post 엔티티를 받았지만, 이제는 DTO로 받고
    // Service에서 userId로 유저 조회 + Post 생성 처리

    // ✅ 2. 전체 글 조회
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> findAll() {
        return ResponseEntity.ok(postService.findAll());
    }
    // 🔍 기존에는 List<Post> 리턴 → 위험 (엔티티 노출)
    // → 이제는 DTO 리스트로 변환해서 클라이언트에 필요한 필드만 응답

    // ✅ 3. 글 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }
    // 🔍 기존: Optional<Post> 반환해서 Controller가 조건 분기 처리
    // → 이제는 Service에서 not found 처리하고 DTO만 리턴

    // ✅ 4. 글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @RequestBody PostUpdateDto dto) {
        postService.update(id, dto);
        return ResponseEntity.ok().build();
    }
    // 🔍 기존에는 Post 엔티티 통째로 받음 → 위험
    // → 이제는 수정 가능한 필드만 담긴 DTO로 변경

    // ✅ 5. 글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
    // 🔍 이건 기존과 동일해도 무방함 (삭제는 단순 동작이므로 DTO 불필요)
}

```

### 요약

| HTTP Method | URI               | 설명      | 사용 DTO                  |
| ----------- | ----------------- | ------- | ----------------------- |
| POST        | `/api/posts`      | 글 작성    | `PostRequestDto`        |
| GET         | `/api/posts`      | 전체 글 조회 | `List<PostResponseDto>` |
| GET         | `/api/posts/{id}` | 단일 글 조회 | `PostResponseDto`       |
| PUT         | `/api/posts/{id}` | 글 수정    | `PostUpdateDto`         |
| DELETE      | `/api/posts/{id}` | 글 삭제    | 없음                      |

### 변경 사항

| 기능        | 기존 코드              | 리팩토링 후                               |
| --------- | ------------------ | ------------------------------------ |
| 요청 DTO 사용 | `Post` 직접 받음       | `PostRequestDto`, `PostUpdateDto` 사용 |
| 응답 DTO 사용 | `Post` 직접 반환       | `PostResponseDto` 사용                 |
| 응답 처리 방식  | Optional로 감쌈       | `orElseThrow` → 404 처리 또는 DTO 반환     |
| 로직 위치     | Controller에서 일부 처리 | DTO → Service로 위임                    |

# 3. 페이징: 글 전체 목록 조회

## PostService
```java
    // 2. 전체 글 조회
    public Page<PostResponseDto> findAllPaged(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(PostResponseDto::new);
    }
```
## PostController
```java
    // 2. 전체 글 조회
    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> findAllPaged(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        return ResponseEntity.ok(postService.findAllPaged(pageable));
    }
```

# 4. Group By
# 5. 서브 쿼리