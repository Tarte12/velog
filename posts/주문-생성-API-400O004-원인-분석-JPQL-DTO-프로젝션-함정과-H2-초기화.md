---
title: '주문 생성 API - 400/O004 원인 분석: JPQL DTO 프로젝션 함정과 H2 초기화'
slug: 주문-생성-API-400O004-원인-분석-JPQL-DTO-프로젝션-함정과-H2-초기화
date: 2025-09-19T08:32:36.818Z
tags: []
---
> **주문 생성 api 만들면서 생긴 문제 정리**

#### Problem
- 주문 생성 API가 HTTP 400 + 내부 코드 O004 지속적 반환
- 동시에 H2 콘솔 접근 불가, 메시지 번들 한들 꺠짐/미존재 등 환경 이슈 존재

#### Investigation
- 요청 로깅 -> `buyerId, itemId, addressId` 정상 수신 확인
- 단계별 로그 삽입 -> `getItemOrThrow()` 직후 예외 재현
- 스택 트레이스:
	- `ItemPricingReader`의 **JPQL DTO 프로젝션** 연쇄 문제
    - **타입 불일치**(`Integer` -> `BigDecimal`)
    - **typed null**/주석 처리로 **SyntaxException**
- 환경 이슈:
	- H2 콘솔 400/403(보안 설정 미허용, CSRF)
    - `data.sql` 미로딩(파일/옵션 부적절)
    - 요청 JSON 필드명(snake_case)와 DTO 매핑 이슈
    - 한글 메시지 **인코딩/리소스 키 누락**
    
#### Fix 
1. **비즈니스 핵심 경로 안정화**
- JPQL DTO 생성 제거 -> **엔티티 직접 로드**로 단순화
- 예외/NULL을 서비스 계층에서 **일관된 에러코드로 매핑**
```java
// ItemPricingReader (최종)
@Component
public class ItemPricingJpaReader implements ItemPricingReader {
    @PersistenceContext EntityManager em;
    @Override
    public ItemView getById(Long itemId) {
        var item = em.find(Item.class, itemId);
        if (item == null || item.getStatus() != ItemStatus.FOR_SALE) return null;
        var price = item.getPrice() == null ? null : BigDecimal.valueOf(item.getPrice().longValue());
        return new ItemView(item.getId(), null, price); // sellerId 미연동
    }
}
```
2. **H2 콘솔/보안**
- `/h2-console/**` **permitAll + CSRF 무시** 추가, 프레임 옵션 허용
```java
http
  .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
  .headers(h -> h.frameOptions(f -> f.sameOrigin()))
  .authorizeHttpRequests(a -> a.requestMatchers("/h2-console/**").permitAll().anyRequest().permitAll());

```
3. **테스트용 더미 데이터 위한 세팅**
```java
spring.jpa.hibernate.ddl-auto=create
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.sql.init.encoding=UTF-8
```

#### Outcome
- 주문 생성 API 정상 동작(예: {"success": true, "data":{"order_id":1}})
- 원인 고립 시간 단축: 단계 로그 + 스택 노출로 디버깅 1회전 내 해결
- 개발 환경 확립: H2 콘솔 접근/초기 데이터 자동 로딩/한글 메시지 정상화

#### Next
- 로그인, 인증/인가 기능 구현 완료해 주면 거기에 맞춰서 다시 수정
