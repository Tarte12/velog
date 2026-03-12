---
title: '[Spring] 📦 예외 처리 구현기: Exception, 유효성 검증 검사 -Inkpad 개발기 #11'
slug: DBJPA-예외-처리-구현기-Inkpad-개발기-11
date: 2025-07-06T03:57:36.809Z
tags: []
---
# 1. 지금 방식
- **예시: `UserService`에서 유저 없을 때**
```
userRepository.findById(id)
    .orElseThrow(() -> new IllegalArgumentException("해당 유저 없음"));

```
- **문제점:**
	- 메시지만 있고 **에러 코드 없음**
    - 발생한 예외가 **클라이언트에 어떻게 응답되는지 제어 불가**
    - 로그도 똑같은 `IllegalArgumentException`으로 뒤섞임
    
# 2. 왜 구성 요소 분리?
> - 예외가 발생했을 때
> - **어떤 코드로, 어떤 메시지로, 어떤 HTTP 상태로, 어떤 응답 포맷으로**
- 👉 **명확하게 제어**하기 위해 구조를 나누는 것

# 3. 구조 리팩토링

| 구성요소                                     | 역할                   | 비유                          |
| ---------------------------------------- | -------------------- | --------------------------- |
| 1. **서비스 내부**                            | 예외를 `던지는` 곳          | "문제 발생!"을 외치는 곳             |
| 2. **예외 클래스** (`BlogException`)          | 예외를 담는 상자            | "이 문제는 USER\_NOT\_FOUND야!"  |
| 3. **에러 코드 enum** (`ErrorCode`)          | 모든 에러의 코드 + 메시지 + 상태 | "이 문제는 404야. 메시지는 이거야."     |
| 4. **전역 핸들러** (`GlobalExceptionHandler`) | 예외를 받아서 응답을 만들어줌     | "문제 생겼네? JSON으로 예쁘게 응답해줄게." |
| 5. **클라이언트**                             | 응답을 받는 쪽             | Postman, 브라우저, 프론트엔드 등      |

### 어떤 느낌?
```
🔧 서비스: "이 유저 없어! USER_NOT_FOUND 던질래!" ← throw

📦 예외 클래스: BlogException ← USER_NOT_FOUND를 담은 예외 상자

📃 에러코드: USER_NOT_FOUND = 404 + "해당 유저 없음"

🎯 전역 핸들러: "오, 이거 BlogException이네? JSON으로 포장해서 보내줘야지"

📨 클라이언트: 
{
  "code": "USER_NOT_FOUND",
  "message": "해당 유저 없음"
}

```

# 4. 실제 실행 순서
## 1) 서비스 내부 - 예외 발생

```java
throw new BlogException(ErrorCode.USER_NOT_FOUND);
```
- 예외를 **던짐**
- 어떤 예외인지, 어떤 메시지인지 코드로 명확히 전달

## 2) 예외 클래스 - 예외를 포장
```java
public class BlogException extends RuntimeException {
    private final ErrorCode errorCode;
}
```
- `USER_NOT_FOUND`처럼 **무슨 문제인지 분류된 코드**를 담고 있음

## 3) 에러 코드 - 이 문제가 뭔지 정의
```java
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 유저 없음");
}
```
- `404`, `"해당 유저 없음"`을 함께 정의

## 4) 전역 핸들러 - 예외를 JSON 응답으로 바꿈
```java
@ExceptionHandler(BlogException.class)
public ResponseEntity<ErrorResponse> handle(BlogException e) {
    return ResponseEntity.status(e.getStatus())
                         .body(new ErrorResponse(code, message));
}

```

## 5) 클라이언트 - 응답 받음
```java
{
  "code": "USER_NOT_FOUND",
  "message": "해당 유저 없음"
}
```


# 5. 왜 이렇게?
| 이유               | 설명                                        |
| ---------------- | ----------------------------------------- |
| 🎯 **응답 통일**     | 모든 예외가 동일한 JSON 포맷으로 나감                   |
| 🧭 **에러 코드 관리**  | 서버와 클라이언트가 코드로 정확히 소통함 (`USER_NOT_FOUND`) |
| 🔐 **보안과 정보 은닉** | 민감한 서버 메시지 숨기고, 사용자에게 필요한 메시지만 전달         |
| 🔍 **로깅/디버깅 용이** | 에러 코드로 로그 필터링 가능                          |
| 💬 **프론트 협업**    | 프론트가 `code` 기준으로 처리 로직을 만들 수 있음           |

# 6. 요약
> 기존에 `RutimeException("문자열")로 대충 던져서 해결
=> 이것을 **어떤 문제인지, 어떤 코드/메시지로 응답할지** 체계적으로 던지고 받는 구조로 설계

**구현 순서**
1. `ErrorCode.java`
2. `BlogException.java`
3. `GlobalExceptionHandler.java`
4. `ErrorResposne.java`
5. 실제 적용

# 7. 실제 구현 적용
## 예시 1: 유저 존재 X 예외 처리
**PostService.java**
```java
User user = userRepository.findById(userId)
    .orElseThrow(() -> new BlogException(ErrorCode.USER_NOT_FOUND));
```
-> 원래 `IllegalArgumentException("유저 없음")`으로 썼지만, `BlogException`과 `ErrorCode`로 통일감 있게 던짐

## 예시 2: 파일 업로드 유효성 검사 실패 시 예외 처리
**FileService.java**
```java
private void validateFile(MultipartFile file) {
    if (file.getSize() > MAX_FILE_SIZE) {
        throw new BlogException(ErrorCode.FILE_SIZE_EXCEEDED);
    }

    String filename = file.getOriginalFilename();
    if (filename == null || ALLOWED_EXTENSIONS.stream().noneMatch(filename.toLowerCase()::endsWith)) {
        throw new BlogException(ErrorCode.UNSUPPORTED_FILE_TYPE);
    }
}
```
-> 파일의 크기/확장자 제한을 통과하지 못하면 커스텀 예외로 던짐
-> `GlobalExceptionHandler`에서 JSON으로 응답 처리

## 예시 3: DTO 유효성 검사(@Valid)
**PostRequestDto.java**
```java
@NotBlank(message = "제목은 필수입니다.")
private String title;

@NotBlank(message = "본문 내용은 필수입니다.")
private String content;
```

**PostController.java**
```java
@PostMapping(consumes = "multipart/form-data")
public ResponseEntity<Void> createPost(
    @Valid @RequestPart("post") PostRequestDto postDto,
    @RequestPart(value = "files", required = false) List<MultipartFile> files
)

```
-> 유효성 실패 시 'MethodArgumentNotValidException' 발생
-> 'GlobalExceptionHandler'가 가로채서 클라이언트에게 메시지 전달

**실제 클라이언트 응답 예시**
```json
{
  "code": "FILE_SIZE_EXCEEDED",
  "message": "파일 크기가 너무 큽니다."
}
```

# 8. 실수 & 리팩토링 포인트
- ❌ 처음엔 모든 예외를 `IllegalArgumentException("문자열")`로만 처리해서** 로그 추적이 어려웠음**
- ✅ `BlogException + ErrorCode + GlobalExceptionHandler` 구조를 도입하면서
→ 각 예외의 **의도, 위치, 응답**이 명확해짐
- ✅ 파일 업로드/DTO 검증처럼 서비스 & 컨트롤러 양쪽에서 **일관된 예외 응답 체계 유지 가능**

# 9. 정리: 예외 처리 설계 포인트
| 포인트                                          | 설명 |
| -------------------------------------------- | -- |
| 🎯 `ErrorCode`로 에러의 **코드/메시지/상태** 분리 관리      |    |
| 📦 `BlogException`으로 **구조화된 예외 던지기**         |    |
| 📡 `GlobalExceptionHandler`로 **일관된 응답 처리**   |    |
| 💬 `@Valid + message`로 **입력 유효성 메시지 커스터마이징** |    |
| 🔍 JSON 포맷 통일로 **프론트 협업과 디버깅 개선**            |    |

