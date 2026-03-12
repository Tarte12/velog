---
title: '[Project] 칼하트 중고거래 플랫폼 #1'
slug: Project-칼하트-중고거래-플랫폼-1
date: 2025-08-24T08:55:28.965Z
tags: []
---
> 주문 도메인 구현 담당

# 주문 기능 명세서
## 1. 결제(주문 생성)
- 역할: 사용자가 상품을 선택하고 최종 결제를 진행하면 주문 정보 생성
- 요청: `POST/api/orders`
- 응답: 주문 생성 성공 시, 생성된 `orderId` 반환
## 2. 주문 취소
- 역할: 사용자가 결제 완료된 주문 취소
- 조건: 주문 상태가 '결제 완료'일 때만 취소 가능, 이미 '배송 시작' 등 다른 상태로 변경되면 취소 불가능 예외 처리
- 요청: `DELETE/api/orders/{orderId}`
- 응답: 취소 성공 시 메시지 반환
## 3. 주문 전체 조회
- 역할: 특정 회원이 주문한 모든 내역 조회
- 요청: `GET/api/orders` 	
	- 추가 옵션: 페이지네이션, 정렬, 검색어
- 응답: 주문 목록 데이터 반환
## 4. 주문 기간별 조회
- 역할: 특정 기간 내애 주문한 내역 조회
- 요청: `GET/api/orders/search`
	- 쿼리 파라미터: `startDate`, `endDate`
- 응답: 해당 기간의 주문 목록 데이터 반환

# 로드맵
## 1. 기본 API 구현
- `OrderController`, `OrderService`, `OrderRepository`를 만들고 각 계층의 역할을 명확히 분리
- `POST/api/orders`: 주문을 생성하고 데이터베이스에 저장하는 로직
- `GET/api/orders`: JPA `findAll()` 같은 메서드를 사용해 주문 목록 조회
## 2. 기능 확장 및 심화
- 결제 상태 관리: `OrderStatus` 같은 열거형(Enum)을 사용하여 주문 상태 관리
- 기간별 조회 구현: `QueryDsl`을 이용해 동적 쿼리를 생성하고 기간별 주문 조회 로직
- 외부 api 연동: 카카오페이, 네이버페이 api 연동
- 트랜잭션 관리: 결제 요청과 주문 생성은 하나의 단위여야 함 `OrderService`에 `@Transcational` 사용해 원자성 보장, 결제가 실패하면 주문 생성도 롤백

# 결제 관련 ERD
![](https://velog.velcdn.com/images/emprimula/post/4769a0fe-6fdf-4ecd-a7c4-c5ec5418a03c/image.png)

## 결제 (주문 생성) 기능
- 로직: 사용자가 상품을 선택하고 결제 수단을 입력하면, Order 테이블에 주문 정보가 생성되고 동시에 OrderItem 테이블에 주문 상품 정보가 저장
- API: POST /api/orders를 구현하고, 요청 본문에 memberId, products (상품 ID와 수량), paymentMethod 등을 담아 처리
- 트랜잭션: 이 모든 과정은 하나의 트랜잭션으로 묶여야, 결제(Payment 테이블)와 주문(Order 테이블) 중 하나라도 실패하면 모두 롤백되도록 @Transactional을 적용

## 주문 조회 기능
- 로직: Order 테이블과 OrderItem 테이블을 조인하여 특정 주문의 상세 정보를 조회
- API: GET /api/orders/{orderId}를 구현하여 특정 주문을 조회하고, GET /api/orders를 구현하여 전체 주문 목록을 조회
- 배송 연동: 결제가 완료되면 Delivery 테이블에 배송 정보가 생성되도록 로직을 추가합니다. delivery_id를 Order 테이블에 연결하여 주문과 배송의 관계를 명확히 


## 배송 및 결제 관련 로직
- 결제 상태 관리: Payment 테이블의 payment_status와 transaction_id 컬럼을 활용하여 결제 상태를 업데이트하고, 결제 취소 로직(cancel_date 업데이트)을 구현
- 배송 연동: 결제가 완료되면 Delivery 테이블에 배송 정보가 생성되도록 로직을 추가합니다. delivery_id를 Order 테이블에 연결하여 주문과 배송의 관계를 명확히

## 기타 기능 및 코드 품질 관리
- DTO 패턴: 엔티티를 직접 API 응답으로 사용하지 않고, DTO(Data Transfer Object)로 변환하여 사용(순환 참조 문제 방지)
- 예외 처리: 결제 실패, 이미 취소된 주문 재취소 요청 등 예외 상황을 처리하는 로직을 추가하고, GlobalExceptionHandler를 통해 일관성 있게 관리
- API 문서화: 협업을 위한 Swagger 사용   

# 컨벤션
## 네이밍 규칙:
- 클래스/인터페이스: UpperCamelCase (예: UserOrderService)
- 메서드/변수: lowerCamelCase (예: getUserOrders)
- 상수: ALL_CAPS (예: MAX_ORDER_COUNT)

## 코드 포맷팅:
- 들여쓰기: 스페이스 4칸
- 중괄호: K&R 스타일 (예: if (...) { ... })
- 줄 길이: 한 줄의 최대 문자 수 (예: 120자)

## 주석 규칙:
- 클래스/메서드 주석: @author, @param, @return, @throws 등을 사용하여 Javadoc 스타일로 작성
- 인라인 주석: 코드의 복잡한 부분에만 간단한 설명을 추가

## 커밋 메시지:
- 형식: 타입: 커밋 제목 (예: feat: 주문 API 구현)
- 타입: feat (기능), fix (버그 수정), docs (문서), refactor (리팩토링) 등 통일된 접두사 사용


# 파일 구조 커밋 메시지
![](https://velog.velcdn.com/images/emprimula/post/936f87e3-4b57-4fff-8067-27fc09b81f80/image.png)
![](https://velog.velcdn.com/images/emprimula/post/06d1d71c-d2de-4d1a-8151-8cedb0eee663/image.png)


# 1차 목표 (8/25 ~ 8/31)
1. swagger를 위한 ci/cd 배포 => ci/cd랑 nginx 공부
2. api 변경점 자동화를 위한 웹훅 기반 디스코드 챗봇 공부
3. 주문 생성, 주문 취소, 주문 전체 조회 api 구현