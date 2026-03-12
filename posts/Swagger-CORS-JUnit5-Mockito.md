---
title: 'Swagger, CORS, JUnit5, Mockito'
slug: Swagger-CORS-JUnit5-Mockito
date: 2025-07-24T06:10:55.754Z
tags: []
---
> 뭔가 기능을 다 만든 것 같은데 하나의 흐름으로 그려지지 않고 따로 노는 느낌이란 말이지

# 1. API 명세서

## 📘 API 명세서 (Markdown 기반)

---

# 🧑‍💻 User API

### 🔹 회원가입

* **URL**: `/api/users/signup`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **요청 예시**:

```json
{
  "username": "testuser",
  "password": "testpassword",
  "nickname": "tester",
  "email": "test@example.com"
}
```

* **응답 예시**:

```json
{
  "username": "testuser",
  "nickname": "tester",
  "email": "test@example.com"
}
```

* **응답코드**:

  * 200 OK – 회원가입 성공
  * 400 Bad Request – 유효성 실패
  * 409 Conflict – 중복 사용자명

---

### 🔹 로그인

* **URL**: `/api/users/login`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **요청 예시**:

```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

* **응답 예시**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

* **응답코드**:

  * 200 OK – 로그인 성공
  * 401 Unauthorized – 비밀번호 불일치
  * 404 Not Found – 존재하지 않는 사용자

---

### 🔹 사용자 정보 수정

* **URL**: `/api/users/{id}`
* **Method**: `PUT`
* **Content-Type**: `application/json`
* **요청 예시**:

```json
{
  "password": "newpass123",
  "nickname": "newnickname",
  "email": "newemail@example.com"
}
```

* **응답코드**:

  * 200 OK – 수정 성공
  * 400 Bad Request – 유효성 오류

---

### 🔹 전체 사용자 목록 조회 (페이징)

* **URL**: `/api/users/page`
* **Method**: `GET`
* **Query Params**:

  * `page`: 페이지 번호 (기본값 0)
  * `size`: 페이지 크기 (기본값 10)
  * `sort`: 정렬 기준 (기본값 id)
* **응답 예시**:

```json
{
  "content": [
    {
      "username": "user1",
      "nickname": "nick1",
      "email": "user1@example.com"
    }
  ],
  "totalPages": 1,
  "totalElements": 1
}
```

---

# 📝 Post API

### 🔹 게시글 작성

* **URL**: `/api/posts`
* **Method**: `POST`
* **Content-Type**: `multipart/form-data`
* **요청**:

  * `post`: JSON (본문)
  * `files`: MultipartFile\[] (optional)
* **예시**:

```json
{
  "title": "제목",
  "content": "내용"
}
```

* **응답코드**: 200 OK

---

### 🔹 전체 게시글 조회

* **URL**: `/api/posts`
* **Method**: `GET`
* **Query**: `page`, `size`, `sort`
* **응답**: Page

---

### 🔹 게시글 단건 조회

* **URL**: `/api/posts/{id}`
* **Method**: `GET`
* **응답**: PostResponseDto

---

### 🔹 게시글 수정

* **URL**: `/api/posts/{id}`
* **Method**: `PUT`
* **Content-Type**: `multipart/form-data`
* **요청**:

  * `post`: JSON
  * `files`: MultipartFile\[] (optional)

---

### 🔹 게시글 삭제

* **URL**: `/api/posts/{id}`
* **Method**: `DELETE`
* **응답코드**: 200 OK

---

### 🔹 인기 게시글

* **URL**: `/api/posts/popular`
* **Method**: `GET`
* **응답**: List

---

### 🔹 카테고리 통계

* **URL**: `/api/posts/statistics/category-count`
* **Method**: `GET`
* **응답**: List

---

# 📢 Notice API

### 🔹 엑셀 업로드 (공지사항 대량 등록)

* **URL**: `/notices/upload`
* **Method**: `POST`
* **Content-Type**: `multipart/form-data`
* **Request Param**: `file` (엑셀 파일)
* **응답코드**: 200 OK

---

### 🔹 전체 공지사항 조회

* **URL**: `/notices`
* **Method**: `GET`
* **Query**: `page`, `size`, `sort`
* **응답**: Page

---

### 🔹 공지사항 단건 조회

* **URL**: `/notices/{id}`
* **Method**: `GET`
* **응답**: NoticeResponseDto

---

### 🔹 공지사항 단건 수정

* **URL**: `/notices/{id}`
* **Method**: `PUT`
* **RequestBody**: NoticeUpdateDto
* **응답코드**: 200 OK

---

### 🔹 공지사항 삭제

* **URL**: `/notices/{id}`
* **Method**: `DELETE`
* **응답코드**: 204 No Content

---

> ✅ PDF로 변환하려면 Typora, Obsidian, MarkText 또는 VSCode + Markdown PDF 플러그인을 추천합니다. ✅ 다음 단계: CORS 설정, JUnit 테스트, 통합 테스트(MockMvc)로 넘어갈 준비 완료.

# 2. CORS 설정
> React 안 할 거지만, 연결은 필수이므로 가상의 상황을 가정하여 설정

## cmd로 CORS 설정 체크
![](https://velog.velcdn.com/images/emprimula/post/e8eccc2c-f55c-4a67-a112-1cfbe8fc8df1/image.png)

| 헤더                                 | 의미                                             |
| ---------------------------------- | ---------------------------------------------- |
| `200 OK`                           | Preflight 요청을 허용했다는 뜻 (CORS 통과)                |
| `Access-Control-Allow-Origin`      | React 개발 서버(`http://localhost:3000`)의 요청을 허용   |
| `Access-Control-Allow-Methods`     | POST, GET 등 모든 메서드 허용                          |
| `Access-Control-Allow-Headers`     | `Authorization` 헤더를 허용 (→ JWT 통신 가능)           |
| `Access-Control-Expose-Headers`    | 응답에 `Authorization` 헤더를 노출 가능 (브라우저에서 읽을 수 있음) |
| `Access-Control-Allow-Credentials` | 쿠키나 토큰 등 인증 정보를 허용 (→ JWT 사용에 필수)              |

# 3. JUnit5 + Mockito
🔹 JUnit5 = 자바의 표준 테스트 프레임워크
🔹 Mockito = 테스트할 때 사용할 가짜 객체(Mock)를 만드는 도구

> 리액트 안 하고 테스트하려고 사용

## 3.1 정리
### 일반 사용자 흐름
- AuthServiceTest: 회원가입, 로그인(정상/실패)
- UserServiceTest: 유저 CRUD
- PostServiceTest: 게시글 등록, 수정, 삭제
- FileUploaderTest: S3/Local 업로드 성공 및 성능 비교

### 관리자 흐름
- NoticeServiceTest: Excel 업로드 정상 처리, 예외 처리, 중복 제거

## 3.2 테스트
### AuthServiceTest
#### 성공 
![](https://velog.velcdn.com/images/emprimula/post/ac920a13-ba68-4286-ad01-71fa2473a82c/image.png)

#### 코드
```java
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void 회원가입_성공_일반회원() {
        // given
        SignupRequestDto dto = SignupRequestDto.builder()
                .username("snowd")
                .password("1234")
                .nickname("눈사람")
                .email("snowd@example.com")
                .build();

        given(userRepository.existsByUsername("snowd")).willReturn(false);
        given(passwordEncoder.encode("1234")).willReturn("encrypted1234");

        // when
        authService.signup(dto);

        // then
        then(userRepository).should().save(argThat(user ->
                user.getUsername().equals("snowd") &&
                        user.getPassword().equals("encrypted1234") &&
                        user.getNickname().equals("눈사람")
        ));
    }

    @Test
    void 회원가입_실패_중복ID() {
        // given
        SignupRequestDto dto = SignupRequestDto.builder()
                .username("snowd")
                .password("1234")
                .build();

        given(userRepository.existsByUsername("snowd")).willReturn(true);

        // when & then
        assertThrows(BlogException.class, () -> authService.signup(dto));
    }

    @Test
    void 로그인_성공_토큰발급() {
        // given
        String rawPassword = "1234";
        String encodedPassword = "encrypted1234";
        User user = User.builder()
                .id(1L)
                .username("snowd")
                .password(encodedPassword)
                .build();

        given(userRepository.findByUsername("snowd")).willReturn(Optional.of(user));
        given(passwordEncoder.matches(rawPassword, encodedPassword)).willReturn(true);
        given(jwtTokenProvider.createToken(1L, "snowd")).willReturn("mocked-jwt-token");

        // when
        String token = authService.login("snowd", rawPassword);

        // then
        assertEquals("mocked-jwt-token", token);
    }

    @Test
    void 로그인_실패_비밀번호틀림() {
        // given
        User user = User.builder()
                .username("snowd")
                .password("encrypted1234")
                .build();

        given(userRepository.findByUsername("snowd")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("wrongpass", "encrypted1234")).willReturn(false);

        // when & then
        assertThrows(BlogException.class, () -> authService.login("snowd", "wrongpass"));
    }

    @Test
    void 로그인_실패_존재하지않는유저() {
        // given
        given(userRepository.findByUsername("nouser")).willReturn(Optional.empty());

        // when & then
        assertThrows(BlogException.class, () -> authService.login("nouser", "1234"));
    }
}
```
### UserServiceTest
#### 성공
![](https://velog.velcdn.com/images/emprimula/post/5ee7c868-c31f-4bfe-8945-86fc5a99e9cb/image.png)

#### 코드
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void 유저_생성_성공() {
        // given
        SignupRequestDto dto = SignupRequestDto.builder()
                .username("user1")
                .password("pw1234")
                .nickname("닉네임")
                .email("user1@email.com")
                .build();

        given(userRepository.save(any(User.class))).willAnswer(invocation -> invocation.getArgument(0));

        // when
        User savedUser = userService.create(dto);

        // then
        assertEquals("user1", savedUser.getUsername());
        assertEquals("닉네임", savedUser.getNickname());
    }

    @Test
    void 유저_조회_성공() {
        // given
        User user = User.builder()
                .id(1L)
                .username("user1")
                .build();

        given(userRepository.findById(1L)).willReturn(Optional.of(user));

        // when
        Optional<User> found = userService.findById(1L);

        // then
        assertTrue(found.isPresent());
        assertEquals("user1", found.get().getUsername());
    }

    @Test
    void 유저_삭제_성공() {
        // when
        userService.delete(1L);

        // then
        then(userRepository).should().deleteById(1L);
    }

    @Test
    void 유저_수정_성공() {
        // given
        User user = User.builder()
                .id(1L)
                .username("user1")
                .password("old")
                .nickname("oldNick")
                .email("old@email.com")
                .build();

        given(userRepository.findById(1L)).willReturn(Optional.of(user));

        UserUpdateDto dto = UserUpdateDto.builder()
                .password("newPw")
                .nickname("newNick")
                .email("new@email.com")
                .build();

        // when
        userService.update(1L, dto);

        // then
        assertEquals("newPw", user.getPassword());
        assertEquals("newNick", user.getNickname());
        assertEquals("new@email.com", user.getEmail());
    }
}
```

### PostServiceTest
#### 성공
![](https://velog.velcdn.com/images/emprimula/post/8c2d3380-5c7e-4b79-b5a7-aecfac2bca72/image.png)

#### 코드
```java
@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileRepository fileRepository;

    @Mock
    private FileService fileService;

    @InjectMocks
    private PostService postService;

    @Test
    void 게시글_생성_성공_파일없음() throws Exception {
        // given
        Long userId = 1L;
        User user = User.builder().id(userId).username("user1").build();
        PostRequestDto dto = PostRequestDto.builder()
                .title("제목")
                .content("내용")
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        // when
        postService.createPost(userId, dto, null);

        // then
        then(postRepository).should().save(any(Post.class));
    }

    @Test
    void 게시글_생성_실패_존재하지않는유저() {
        // given
        Long userId = 100L;
        PostRequestDto dto = PostRequestDto.builder()
                .title("제목")
                .content("내용")
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.empty());

        // when & then
        assertThrows(BlogException.class, () -> postService.createPost(userId, dto, null));
    }

    @Test
    void 게시글_수정_성공() throws Exception {
        // given
        Long postId = 1L;
        Post post = Post.builder()
                .title("old title")
                .content("old content")
                .build();

        //.id(1L) Builder로 주입하려 했지만, Entity에서 id는 DB에서 자동 생성
        //따라서 Builder에 존재 X
        //테스트 전용으로 id 필드 값 주입
        ReflectionTestUtils.setField(post, "id", 1L);

        PostUpdateDto dto = PostUpdateDto.builder()
                .title("new title")
                .content("new content")
                .build();

        given(postRepository.findById(postId)).willReturn(Optional.of(post));

        // when
        postService.update(postId, dto, null);

        // then
        assertEquals("new title", post.getTitle());
        assertEquals("new content", post.getContent());
    }

    @Test
    void 게시글_삭제_성공() {
        // given
        Long id = 1L;

        // when
        postService.delete(id);

        // then
        then(postRepository).should().deleteById(id);
    }
}
```

### LocalFileUploaderTest
#### 성공
![](https://velog.velcdn.com/images/emprimula/post/d09a0233-4b06-464e-8532-2881aac3f0d6/image.png)

#### 코드
```java
class LocalFileUploaderTest {

    private LocalFileUploader localFileUploader;

    @BeforeEach
    void setUp() {
        localFileUploader = new LocalFileUploader();
        // 수동으로 @Value 값 세팅
        localFileUploader.setUploadDir("src/test/resources/upload");
        localFileUploader.setLocalBaseUrl("http://localhost:8080/files");
        // 업로드 디렉토리 미리 생성
        new java.io.File("src/test/resources/upload").mkdirs();
    }

    @Test
    void 이미지파일_업로드_성공_WebP변환() throws Exception {
        // given
        BufferedImage testImage = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
        byte[] jpegBytes = ImageProcessUtil.bufferedImageToBytes(testImage, "jpg");
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", jpegBytes);

        // when
        org.example.demo3.domain.file.File uploadedFile = localFileUploader.storeFile(multipartFile);

        // then
        assertNotNull(uploadedFile);
        assertEquals("image/webp", uploadedFile.getContentType());
        assertTrue(uploadedFile.getStoredFilename().endsWith(".webp"));
        assertEquals(FileType.IMAGE, uploadedFile.getFileType());

        // 실제 파일이 로컬에 존재하는지 확인
        java.io.File savedFile = new java.io.File(uploadedFile.getFilePath());
        assertTrue(savedFile.exists());
        assertTrue(savedFile.length() > 0);
    }

    @Test
    void 엑셀파일_업로드_성공() throws IOException {
        // given
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file", "test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "엑셀파일더미".getBytes());

        // when
        org.example.demo3.domain.file.File uploadedFile = localFileUploader.storeFile(multipartFile);

        // then
        assertNotNull(uploadedFile);
        assertEquals(FileType.EXCEL, uploadedFile.getFileType());
        assertTrue(uploadedFile.getStoredFilename().endsWith(".xlsx"));

        java.io.File savedFile = new java.io.File(uploadedFile.getFilePath());
        assertTrue(savedFile.exists());
    }

    @Test
    void pdf파일_업로드_성공() throws IOException {
        // given
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file", "sample.pdf", "application/pdf", "PDF dummy content".getBytes());

        // when
        org.example.demo3.domain.file.File uploadedFile = localFileUploader.storeFile(multipartFile);

        // then
        assertNotNull(uploadedFile);
        assertEquals(FileType.PDF, uploadedFile.getFileType());
        assertTrue(uploadedFile.getStoredFilename().endsWith(".pdf"));
    }

    @Test
    void 기타파일_업로드_성공() throws IOException {
        // given
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file", "readme.txt", "text/plain", "텍스트 파일".getBytes());

        // when
        org.example.demo3.domain.file.File uploadedFile = localFileUploader.storeFile(multipartFile);

        // then
        assertNotNull(uploadedFile);
        assertEquals(FileType.OTHER, uploadedFile.getFileType());
        assertTrue(uploadedFile.getStoredFilename().endsWith(".txt"));
    }
}

```

### S3FileUploaderTest
#### 성공
![](https://velog.velcdn.com/images/emprimula/post/88f9a1bd-5b6f-477e-8fde-737a0f7637a6/image.png)
#### 코드
```java
class S3FileUploaderTest {

    private AmazonS3 amazonS3;
    private S3FileUploader s3FileUploader;

    @BeforeEach
    void setUp() {
        amazonS3 = mock(AmazonS3.class);

        s3FileUploader = new S3FileUploader(amazonS3);
        // 필드 수동 주입
        s3FileUploader.setS3BucketName("my-test-bucket");
        s3FileUploader.setCloudFrontUrl("https://cdn.example.com");
    }

    @Test
    void 이미지파일_업로드_성공_WebP() throws Exception {
        // given
        BufferedImage image = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        byte[] webpBytes = ImageProcessUtil.convertToWebPUsingCLI(image, 0.8f);

        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                webpBytes
        );

        // when
        File result = s3FileUploader.storeFile(multipartFile);

        // then
        assertThat(result.getOriginalFilename()).isEqualTo("test.jpg");
        assertThat(result.getStoredFilename()).endsWith(".webp");
        assertThat(result.getFilePath()).contains("uploads/");
        assertThat(result.getUrl()).startsWith("https://cdn.example.com");
        assertThat(result.getContentType()).isEqualTo("image/webp");
        assertThat(result.getSize()).isEqualTo(webpBytes.length);

        // verify S3 업로드 호출 여부
        ArgumentCaptor<ByteArrayInputStream> inputCaptor = ArgumentCaptor.forClass(ByteArrayInputStream.class);
        verify(amazonS3).putObject(
                eq("my-test-bucket"),
                contains("uploads/"),
                inputCaptor.capture(),
                any(ObjectMetadata.class)
        );
    }
}

```

### NoticeServiceTest
#### 성공
![](https://velog.velcdn.com/images/emprimula/post/78fe648d-9c85-44bf-9738-7d8f177ec173/image.png)

#### 코드
```java
class NoticeServiceTest {

    private NoticeRepository noticeRepository;
    private NoticeService noticeService;

    @BeforeEach
    void setUp() {
        noticeRepository = mock(NoticeRepository.class);
        noticeService = new NoticeService(noticeRepository);
    }

    @Test
    @DisplayName("공지사항 상세조회 - 성공")
    void 공지사항_상세조회_성공() {
        // given
        Notice notice = Notice.builder()
                .title("title")
                .content("content")
                .importance(Importance.HIGH)
                .build();
        ReflectionTestUtils.setField(notice, "id", 1L);

        when(noticeRepository.findById(1L)).thenReturn(Optional.of(notice));

        // when
        NoticeResponseDto result = noticeService.getNoticeById(1L);

        // then
        assertThat(result.getTitle()).isEqualTo("title");
        assertThat(result.getImportance()).isEqualTo("HIGH");
        verify(noticeRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("공지사항 수정")
    void 공지사항_수정() {
        // given
        Notice notice = Notice.builder()
                .title("old title")
                .content("old content")
                .importance(Importance.NORMAL)
                .build();
        ReflectionTestUtils.setField(notice, "id", 1L);

        when(noticeRepository.findById(1L)).thenReturn(Optional.of(notice));

        NoticeUpdateDto dto = new NoticeUpdateDto("new title", "new content", Importance.HIGH);

        // when
        noticeService.updateNotice(1L, dto);

        // then
        assertThat(notice.getTitle()).isEqualTo("new title");
        assertThat(notice.getContent()).isEqualTo("new content");
        assertThat(notice.getImportance()).isEqualTo(Importance.HIGH);
        verify(noticeRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("공지사항 목록 페이징조회")
    void 공지사항_목록_페이징조회() {
        // given
        Notice notice = Notice.builder()
                .title("공지사항 제목")
                .content("내용")
                .importance(Importance.NORMAL)
                .build();
        ReflectionTestUtils.setField(notice, "id", 1L);

        Page<Notice> page = new PageImpl<>(Collections.singletonList(notice));
        PageRequest pageable = PageRequest.of(0, 10);

        when(noticeRepository.findAll(pageable)).thenReturn(page);

        // when
        Page<NoticeResponseDto> result = noticeService.getNoticeList(pageable);

        // then
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("공지사항 제목");
        verify(noticeRepository, times(1)).findAll(pageable);
    }
}

```

#### 엑셀 업로드 saveAllFromExcel(MultipartFile) 따로 테스트
> 업로드만 따로 테스트 진행

#### 성공
![](https://velog.velcdn.com/images/emprimula/post/cd6503d5-71d6-4963-8110-b4af831ce1d0/image.png)

#### 코드
```java
    @DisplayName("엑셀 업로드 - 유효한 파일은 성공")
    @Test
    void 엑셀_업로드_성공() throws Exception {
        // given
        InputStream is = new ClassPathResource("sample/valid_sample.xlsx").getInputStream();
        MockMultipartFile file = new MockMultipartFile(
                "file", "valid_sample.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", is
        );

        when(noticeRepository.saveAll(anyList())).thenReturn(Collections.emptyList());

        // when & then
        assertDoesNotThrow(() -> noticeService.saveAllFromExcel(file));
    }

    @DisplayName("엑셀 업로드 - 잘못된 중요도는 예외 발생")
    @Test
    void 엑셀_업로드_중요도_실패() throws Exception {
        // given
        InputStream is = new ClassPathResource("sample/invalid_importance.xlsx").getInputStream();
        MockMultipartFile file = new MockMultipartFile(
                "file", "invalid_importance.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", is
        );

        // when & then
        BlogException exception = assertThrows(BlogException.class, () -> {
            noticeService.saveAllFromExcel(file);
        });
        assertEquals(ErrorCode.INVALID_EXCEL_ROW, exception.getErrorCode());
        System.out.println("예외 메시지: " + exception.getMessage());
    }

    @DisplayName("엑셀 업로드 - 제목/내용/중요도 누락 시 예외 발생")
    @Test
    void 엑셀_업로드_누락_실패() throws Exception {
        // given
        InputStream is = new ClassPathResource("sample/invalid_blank.xlsx").getInputStream();
        MockMultipartFile file = new MockMultipartFile(
                "file", "invalid_blank.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", is
        );

        // when & then
        BlogException exception = assertThrows(BlogException.class, () -> {
            noticeService.saveAllFromExcel(file);
        });
        assertEquals(ErrorCode.INVALID_EXCEL_ROW, exception.getErrorCode());
        System.out.println("예외 메시지: " + exception.getMessage());
    }
```




