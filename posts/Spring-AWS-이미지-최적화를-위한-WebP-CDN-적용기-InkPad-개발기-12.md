---
title: '[Spring + AWS] 📦 이미지 최적화를 위한 WebP & CDN 적용기 - InkPad 개발기 #12'
slug: Spring-AWS-이미지-최적화를-위한-WebP-CDN-적용기-InkPad-개발기-12
date: 2025-07-10T05:43:16.629Z
tags: []
---
## 1. 문제의식
- 네트워크 비용을 줄이고 싶었다
- 이미지 업로드 시 용량이 크고, 전송 시간이 오래 걸림

## 2. 첫 번째 시도: Java에서 WebP 변환
- Thumbnailator + TwelveMonkeys 사용
- `ImageIO.write(..., "webp", ...)` 시도 → 실패
- 라이브러리 스캔 결과 WebP 지원 안 됨

## 3. 해결 방안: CDN 활용
### S3 + CloudFront 전략
> **목표**: 이미지 업로드 시 S3에 저장, CloudFront가 해당 파일을 WebP로 변환하거나 캐싱하여 최적화된 이미지 제공

- **구현 포인트**
	- 이미지는 그대로 `.jpg` or `.png` 등으로 업로드
    - CloudFront의 "Content Negotiation" 기능을 통해 브라우저가 `Accept: image/webp`일 경우 WebP 버전 제공
    - `CloudFront + Lambda@Edge`나 `CloudeFront Funtions`로 확장 가능
- **작업 목록**
	- `S3FileUploader`는 구조 그대로 사용
    - CloudFront 도메인 설정 후 S3 이미지 URL을 CloudFront URL로 매핑
    - 테스트 페이지에서 `Accept: tmage/webp` 헤더 설정 시 WebP 제공 여부 확인

### Local + Cloudflare 전략
> **목표**: 로컬 서버에 저장된 이미지를 Cloudflare를 통해 WebP 변환 후 제공
- **구현 포인트**
	- 로컬에서는 WebP로 직접 변환 X
    - Cloudflare가 `image.webp` 헤더를 감지하고 자동 WebP 제공
    - Cloudflare Images or Polish 기능 사용
- **작업 목록**
	- 로컬 서버에 이미지 저장(기존 `LocalFileUplodaer` 유지)
    - 외부에서 접속 가능한 URL을 Cloudflare로 프록시 설정
    - Cloudflare에서 WebP 최적화 기능 적용 여부 확인
    
#### Cloudflare
- Cloudflare는 **S3처럼 오브젝트 저장소가 아니라**, 내 **로컬 서버** 위에 있는 정적 자원을 **CDN 캐싱**해 주는 **Reverse Proxy** 방식

## 4. 실험 설계

### 4.1 실험 대상
- 1MB 이상의 JPEG 파일 3종 (풍경, 텍스트 포함 이미지, 고해상도 인물)
- 각각 S3, Local 업로드

### 4.2 측정 항목

| 항목          | 설명                                       |
| ----------- | ---------------------------------------- |
| 원본 업로드 용량   | S3 / Local 각각                            |
| 변환된 WebP 용량 | CDN을 통해 제공되는 WebP                        |
| 이미지 로딩 시간   | 브라우저에서 `Accept: image/webp` 포함시 응답 속도 측정 |
| CDN 캐싱 여부   | 헤더 `cf-cache-status` or `x-cache` 확인     |

### 4.3 측정 방법
- 브라우저 개발자 도구 > 네트워크 탭에서 확인
- curl로 Accept 헤더 다르게 설정하여 직접 요청
```
curl -H "Accept: image/webp" https://cloudfront-url/image.jpg -I
```
- Lighthouse 또는 WebPageTest 도구 활용

## 5. 다음 실험 계획
- 엑셀 업로드 기능 + 대용량 파일 실험 예정
- WebP 비교 외에도 S3/Local 저장 비용 비교 실험 확장
