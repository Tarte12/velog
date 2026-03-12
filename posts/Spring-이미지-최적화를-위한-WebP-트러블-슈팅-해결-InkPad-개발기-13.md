---
title: '[Spring] 📦 이미지 최적화를 위한 WebP 트러블 슈팅 해결 - InkPad 개발기 #13'
slug: Spring-이미지-최적화를-위한-WebP-트러블-슈팅-해결-InkPad-개발기-13
date: 2025-07-12T06:48:15.258Z
tags: []
---
# 문제 상황: 이미지 용량 최적화를 위한 WebP 변환
- 목표: 업로드된 이미지를 **WebP 포맷으로 변환 후 저장**하여 **용량 절감 및 성능 개선**을 하고 싶었음

# 1차 시도: Thumbnailator + ImageIO로 WebP 변환
- 사용 도구: `Thumbnailator`, `javax.imageio.ImageIO`
- 기대한 방식:
	-`BuggeredImage`로 이미지 조작 -> `ImageIO.write(image, "webp", output)`으로 저장
- **실패 원인**
	- `ImageIO`는 기본적으로 WebP 지원 X
    - `ImageWriter` 목록을 확인해도 `webp` 포맷을 처리할 수 있는 writer가 없음(콘솔 로그 찍어서 확인했을 때 지원 포맷에 `webp`이 뜨지 않음)

# 2차 시도: TwelveMonkeys 이미지 라이브러리 추가
- 사용 도구: `com.twelvemonkeys.imageio` 라이브러리
- 기대한 효과: WebP 플러그인이 등록되어 있으므로 `"image/webp" 변환이 가능할 것
- **실패 원인**
	- `TwelveMonkeys`는 **`WebP`를 "읽기"만 지원하고, "쓰기는 지원하지 않는다고 함**
    	- 공식 GitHub에도 write 기능 미지원 언급 있음
   	- `ImageWriter`는 여전히 `webp` 포맷 처리 X
    - 착각 포인트: 지원되는 줄 알고 삽질했는데 지원이 안 되는 거였음

# 3차 시도: 외부 CLI 도구 cwebp 사용
- 사용 도구: Google WebP 공식 CLI 도구 `cwebp`
- 방식:
	- 원본 이미지 -> 임시 파일로 저장
    - `cwebp [입력 파일] -> [출력 파일.webp]`
- 자바에서 직접 WebP 포맷으로 변환하는 게 아니라, **외부 프로그램 호출**로 해결

## png -> WebP 변환

![](https://velog.velcdn.com/images/emprimula/post/28794848-fc50-46d9-b229-96cbaeedfdfb/image.png)
- png -> WebP로 바뀌어 저장된 걸 알 수 있음
- 용량이 유의미하게 줄어든 걸 알 수 있음

## WebP를 리사이징했을 때
![](https://velog.velcdn.com/images/emprimula/post/01fb2658-fa08-4ab4-9651-b5a7c514bb9d/image.png)
- 리사이징 크기를 너무 크게 해서 처음에 유의미하게 이미지 용량이 줄어들지 않았음
- WebP 변환을 한 상태에서 리사이징 크기(`1080` -> `400`)으로 축소
- 유의미하게 용량이 줄어든 것을 알 수 있음

# 회고

| 시도 | 도구                      | 결과          | 비고            |
| -- | ----------------------- | ----------- | ------------- |
| 1차 | Thumbnailator + ImageIO | ❌ WebP 미지원  | 기본 ImageIO 한계 |
| 2차 | TwelveMonkeys           | ❌ Write 미지원 | 읽기만 지원        |
| 3차 | cwebp CLI               | ✅ 성공        | 외부 도구 호출 방식   |
