---
title: '[Spring] 📦 이미지 업로드 구현기 - File 도메인 리팩토링, S3 연동, 비밀키 관리, .env 사용, GiHub Push 오류 – Inkpad 개발기 #10'
slug: DBJPA-File-도메인-기능-보완-DTO-Inkpad-개발기-10-zzuf1ybn
date: 2025-06-28T05:23:14.189Z
tags: []
---
# 1. 기능 목표
> -`Post`에 이미지(파일) 업로드 기능 구현하고, **AWS S3에 연동하여 클라우드 저장소 사용**하는 것을 목표로 함
- 추후 Local VS S3을 하기 위해 패턴을 짬

- **기능 목표**
	- Multipart 이미지 파일 업로드
    - Post와 File의 연관관계 설정
    - S3로의 이미지 업로드 및 저장 경로 반환
    - 향후 이미지 최적화 및 성능 측정 기반 비교(S3 VS Local)
# 2. File 도메인 리팩토링
- `Post`가 소멸하면 `File`도 소멸할 것이기 때문에, 저장 로직을 `PostService`에 병합했었음

- **문제점**
	- **역할 분리 X**: 파일 저장 방식이 `PostService` 내부에 **하드 코딩**된 구조
    - 테스트 및 확장이 어려움(Local VS S3을 꼭 하고 싶었기 때문에 이것을 위해 수정)
    - 예외 처리, 파일 경로 관리 등 **중복 코드 발생 가능**
    
# 3. 이미지 업로드 구조 설계
- **기본 구조**:
	- 사용자가 이미지 업로드 시, `PostService`에서 전달받은 `MultipartFile' 리스트를 가공
    - `FileUploader`라는 인터페이스를 통해 전략적으로 **S3 or Local** 저장 방식 선택 가능하게 함
- **패키지 구조**(예시):
```
├── domain
│   └── file
│       ├── File.java
│       ├── uploader
│       │   ├── FileUploader.java <- 인터페이스
│       │   ├── S3FileUploader.java <- S3 사용
│       │   └── LocalFileUploader.java <- Local 사용
```
    
# 4. 전략 패턴 도입: LocalFileUploader VS S3FileUploader

## FileUploader 인터페이스
```java
public interface FileUploader {
    List<File> upload(List<MultipartFile> multipartFiles) throws IOException;
}
```
- **`LocalFileUploader`**: `files/` 경로에 파일 저장
- **`S3FileUploader`**: `.env`에서 키를 불러와 S3에 업로드(의존성: `AmazonS3`)
- **장점**
	- `FileUploader`를 DI로 주입만 바꾸면 저장 방식 변경 가능
    - 테스트/비교 용이
    - 향후 확장성(ex. WebP 변환, 이미지 리사이징) 고려

# 5. .env 기반 비밀키 관리
- S3 연동을 위해 AWS Access Key, Secret Key 필요
- **보안 문제**: 실수로 `.env` 파일을 GitHub에 푸시 -> secret scanning에 걸림
- 해결 과정:
	- `.env`에 값 작성
    - `Dotenv` 라이브러리로 환경변수 로딩
    - `S3Config`에서 환경변수 사용
    - `.env`는 반드시 `.gitignore`에 추가
```java
Dotenv dotenv = Dotenv.configure().load();
String accessKey = dotenv.get("AWS_ACCESS_KEY");

```
# 6. GitHub Push 오류
- GitHub의 **secret scanning** 기능에 의해 푸시가 막힘(GH013 오류)
- `main` 브랜치 자체가 **민감 정보가 담긴 커밋**을 포함 -> 푸시 불가
- 해결 방법:
1. `main` 브랜치를 `main-with-secret`으로 변경
2. 새 orphan 브랜치로 `main` 재생성
3. 안전한 커밋만 남긴 후 강제 푸시
    
```
1.  
git branch -m main main-with-secret
  
2.
git checkout --orphan main

3.
git add .
git commit -m "clean commit after removing AWS secrets"
git push -f origin main

  ```

# 7. 정리

| 구분                   | 개념 설명                                           |
| -------------------- | ----------------------------------------------- |
| `.env`               | 운영/배포 환경에서 민감 정보를 관리하는 방식. `.gitignore` 필수      |
| `Dotenv`             | Java에서 `.env` 환경변수를 로딩하는 라이브러리                  |
| `AccessKey`          | AWS에서 요청을 인증하는 공개 키                             |
| `SecretKey`          | AccessKey와 짝을 이루는 비밀 키 (절대 노출 금지!)              |
| `GitHub GH013`       | secret-scanning에 걸린 키는 푸시 불가, 커밋을 새로 만들어야 해결 가능 |
| `FileUploader` 전략 패턴 | 업로드 대상(Local/S3)을 바꿔가며 비교 가능하게 구성하는 디자인 패턴      |
| `MultipartFile`      | Spring에서 파일 업로드를 위한 기본 객체                       |
