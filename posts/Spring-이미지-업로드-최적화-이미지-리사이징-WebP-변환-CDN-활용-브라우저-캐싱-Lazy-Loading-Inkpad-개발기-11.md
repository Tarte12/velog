---
title: '[Spring] 📦 Multipart 이미지 최적화 흐름 : S3 & Local 이미지 업로드 + 리사이징 구현기 - Inkpad 개발기 #11'
slug: Spring-이미지-업로드-최적화-이미지-리사이징-WebP-변환-CDN-활용-브라우저-캐싱-Lazy-Loading-Inkpad-개발기-11
date: 2025-07-10T01:12:17.458Z
tags: []
---
# 1. 이미지 업로드 최적화
## 1.1 이미지 리사이징
### 왜 필요할까?
- 원본 이미지가 클 경우 => 트래픽 낭비 + 렌더링 시간 증가

### 어떻게 적용할까?
- Spring 서버에서 `Thumbnailator`, `imgscalr`, `ImageIO` 등 라이브러리로 리사이징

### 관련 트러블 슈팅
- 파일 포맷 유지 안 됨 -> `BufferedImage.TYPE_INT_RGB`로 강제 변환
- 투명도 손실 -> PNG => JPEG 전환 시 알파 채널 날아감 (뭔솔인지 모르겟)
- 원본 비율 깨짐 -> 비율 유지하려면 가로/세로 중 하나 기준으로 리사이징 필요
## 1.2 WebP 변환
### 왜 필요할까?
- WebP가 PNG보다 최대 26%, JPEG보다 34% 더 압축률이 높음
- 이미지 품질 유지하면서 용량을 줄일 수 있어 사용자 입장에서 빠르게 로딩됨
### 어떻게 적용할까?
- `webp-imageio`나 `libwebp` 사용 -> Java에서는 `Xuggler`, `Google WebP`, `TwelveMonkeys` 등 써야 함
- 업로드 직후 JPEG/PNG를 WebP로 변환 후 저장하거나, S3에 WebP 버전 같이 저장
### 관련 트러블 슈팅
- 브라우저 호환성 확인 필수
- 변환 과정에서 색상 손실, 깨짐 현상 -> 품질 조정 파라미터 조절 필요(`quality`, `lossless` 등)
## 1.3 CDN 활용
### 왜 필요할까?
- 이미지가 S3에 저장되어 있더라도, 직접 요청 시 네트워크 지연 발생
- CDN을 쓰면 사용자 가까운 엣지 서버에서 빠르게 응답 가능
### 어떻게 적용할까?
- S3 + CloudFront(AWS CDN 서비스) 연동
- 이미지 요청 경로를 CloudFront 도메인으로 변경
### 관련 트러블 슈팅
- S3 퍼블릭 권한 필요 여부 확인
- 캐시 갱신 문제 -> 변경된 이미지가 바로 안 보임 -> `cache-control` 설정 또는 `invalidate` API 사용
## 1.4 브라우저 캐싱
### 왜 필요할까?
- 동일한 이미지를 매번 요청하지 않도록 하여 네트워크 비용 줄임
### 어떻게 적용할까?
- S3 객체에 `Cache-Control`, `Expires` 헤더 설정
### 관련 트러블 슈팅
- 이미지 교체했는데 이전 캐시가 남는 현상 -> 파일명에 `uuid` 등 유니크 값 붙이기
- CloudFront와 브라우저 캐시가 충돌하는 경우 -> 수동 무효화 필요
## 1.5 Lazy Loading
### 왜 필요할까?
- 페이지에 이미지가 많을 때, 처음부터 다 로딩하지 않고 **보이는 것만 로딩**
- UX 및 성능 향상
### 어떻게 적용할까?
- `<img loading="lazy">` 속성 사용
- or 프론트에서 `IntersectionObserver` 사용해 스크롤 위치에 따라 동적 로딩
### 관련 트러블 슈팅
- 오래된 브라우저에서 작동 안 함 -> JS fallback 필요
- SEO 측면에서 구글 크롤러가 일부 lazy 이미지 못 읽을 수 있음 -> SSR 또는 이미지 프리로드 필요

> **이 게시글에서는 이미지 리사이징만 다룰 것**

# 2. 이미지 리사이징

## 2.1 코드 리뷰

### 2.1.1 ImageReSizeUtil 리뷰

```java
public class ImageResizeUtil {
    public static BufferedImage resize(MultipartFile multipartFile, int targetWidth) throws IOException {
        BufferedImage originalImage = ImageIO.read(multipartFile.getInputStream());
        if (originalImage == null) throw new IllegalArgumentException("업로드된 파일은 이미지가 아닙니다.");

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        int targetHeight = (int) ((double) originalHeight / originalWidth * targetWidth);

        System.out.println("📌 리사이징 전: " + originalWidth + "x" + originalHeight);
        System.out.println("📌 리사이징 후: " + targetWidth + "x" + targetHeight);

        return Thumbnails.of(originalImage).size(targetWidth, targetHeight).asBufferedImage();
    }
}

```
- **기능**:
	- `Thumbnailator` 사용으로 고품질 리사이징
    - 정해진 너비로 비율 유지
    - 확장자에 의존하지 않고 이미지 여부 검증 가능(`BufferedImaged null` 체크)
    
### 2.1.2 S3FileUploader 리뷰
```java
// 주요 흐름 요약
1. 원본 파일 정보 및 확장자 파싱
2. 이미지면 리사이징 수행
3. 확장자에 맞춰 ImageIO.write (예외 핸들링)
4. S3로 업로드
5. File 엔티티 리턴
```
- **기능**:
	- JPEG -> JPG 표준화
    - 확장자 기반 ImageIO.write 지원 여부 확인 -> `written` 체크로 안정성 확보
    - 리사이징된 바이트로 S3 업로드 전송(용량 최적화 시도)
- **개선할 점*8:
	- `contentType`도 리사이징 시 MIME 표준에 따라 변경 가능(EX. WebP로 변환할 경우 반드시 `image/webp` 저장)
    - 추후 확장자 -> MIME 매핑을 enum이나 별도 유틸로 관리하면 좋음
    
### 2.1.3 LocalFileUploader 리뷰
```java
1. 업로드 경로 설정 (uploadDir + UUID)
2. 이미지면 리사이징
3. byte 배열을 파일로 저장 (FileOutputStream)
4. File 엔티티 리턴
```
- **기능**:
	- S3FileUploader와 구조 유사 -> 전략 교체 용이
    - 리사이징 적용 일관성 확보
- **개선**
	- 저장 실패 시 IOException 핸들링 로깅 필요

# 2.2 트러블 슈팅

## 2.2.1 S3 환경 변수 적용
### 문제 상황
- `.env` 파일에 AWS 키를 적었는데도 불구하고, `@Value(${cloud.aws.se.bucker})`가 `null`로 돌아옴
- `.env` 내용을 `application.yml`이 못 읽는 문제 발생
### 원인 분석
- Spirng Boot는 `.env` 파일을 기본적으로 읽지 않음
- `application.yml`에서 `${ENV_VAR}` 형식으로 쓰려면 **JVM이 해당 환경 변수를 알고 있어야 함**
### 해결
- **JVM 실행 옵션에 환경 변수 등록**
```
-DAWS_ACCESS_KEY=xxx -DAWS_SECRET_KEY=xxx -DS3_BUCKET=inkpad-blog-upload
```

## 2.2.2 이미지 리사이징은 되었는데, S3에 저장된 이미지가 여전히 1.7MB?

### 문제 상황
- 콘솔 로그:
```
📌 리사이징 전: 1536x1024
📌 리사이징 후: 1080x720
✅ 리사이징된 이미지 크기: 1080x720
```
![](https://velog.velcdn.com/images/emprimula/post/85abd7e6-cb15-4b34-877f-f565370ff67f/image.png)

- 리사이징은 되었음
- 그런데 S3에서 확인한 파일 용량은 **1.7MB**
- 리사이징 전
![](https://velog.velcdn.com/images/emprimula/post/f63e4ab1-d1c0-4cb3-892d-a54dcce712c8/image.png)
- 리사이징 후
![](https://velog.velcdn.com/images/emprimula/post/554af31d-9c31-4956-8344-16cfd875fd5c/image.png)
-> 기대한 만큼 줄어들지 않았음

### 원인 분석
- **리사이징은 '해상도'를 줄이는 것**이지, **파일 용량 자체를 압축하는 것은 X**
- PNG나 JPG는 압축률이 낮거나 이미지가 복잡하면 용량 차이가 크지 않을 수 있음

### 해결 방향
- **WebP 포맷 적용**을 해 보자 -> 더 높은 압축률로 최적화 가능

## 2.2.3 리사이징된 이미지를 S3에 저장할 때 확장자 문제 발생

### 문제 상황
- `jpeg` 파일을 업로드했더니 `ImageIO.write(...,"jpeg",...)` 실패

### 원인 분석
- Java 기본 `ImageIO`는 `.jpeg` 대신 `.jpg`만 기본 지원
- `ImageIO.write(...,"jpeg",...)` -> false 반환

### 해결
- 확장자를 표준화함
```java
if (ext.equals("jpeg")) ext = "jpg";
```

# 3. WebP 적용

> JPEG/PNG 이미지 리사이징으로는 용량 줄이는 효과가 별로 없었음 -> **WebP**를 이용해 압축하여 이미지 최적화를 더 하고 싶음

**[목표]**
> - 리사이징된 이미지를 WebP 형식으로 인코딩하여 S3에 저장
>- 기존 `ImageIO.write(...,ext,os)` 구조를 WebP 지원으로 확장
>- S3 `content-type`도 `"image/webp"`로 설정

> Java 기본 `ImageIO`는 WebP를 지원하지 않음

## 3.1 이미지 용량 최적화를 위한 WebP 변환 시도
- 목적: 네트워크 비용 줄이기 위한 이미지 포맷 최적화
- 시도: `Thumbnailator` + `twelvmonkeys` 라이브러리로 WebP 변환 구현
- 문제:
	- `ImageIO.write(..., "webp", ...)` 실패
    - `ImageWriter` 스캔 로그 확인 결과 -> WebP writer 로드 실패
    ![](https://velog.velcdn.com/images/emprimula/post/bbd2b3cb-dded-4201-a7e6-b4cb5187a11f/image.png)
    -> **Java에서 직접 WebP 변환하는 건 어렵겠다**
    
## 3.2 대안: CDN 활용한 WebP 변환 방안 조사

| 저장 방식      | CDN            | WebP 처리                           | 비고                       |
| ---------- | -------------- | --------------------------------- | ------------------------ |
| ✅ S3 방식    | AWS CloudFront | 직접 WebP 변환 후 저장                   | Spring에서 `webp` 변환 코드 필요 |
| ✅ Local 방식 | Cloudflare CDN | Cloudflare Polish 기능으로 WebP 자동 변환 | 별도 코드 필요 없음              |

**전략**
- **S3 방식**:
	- `webp`로 변환해서 저장하고, CloudFront가 캐싱/전송 담당
- **Local 방식**:
	- `jpg/png`로 저장하고, Cloudflare가 WebP 자동 변환
    
## 3.3 S3 VS Local 방식 비교 실험
- **장점**:
	- 구현한 기능을 빠르게 실험하고 결과 수치를 확보할 수 있음
	- 블로그/스터디에서 "CDN + 이미지 포맷 최적화"라는 성능 개선 포인트를 바로 정리 가능
	- 엑셀 업로드 기능과 무관하게 이미지 자체의 성능 실험이라는 메시지가 명확함
- **단점**:
	- 지금 비교해도 실험 범위는 "이미지"에 한정됨 (엑셀은 빠짐)
	- 추후 엑셀 업로드 기능까지 구현하면 실험을 다시 조정할 수 있음
