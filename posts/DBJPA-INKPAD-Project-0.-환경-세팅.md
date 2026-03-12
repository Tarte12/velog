---
title: '[DB/JPA] 📦 Spring 프로젝트 환경 세팅 기록 – Inkpad 개발기 #1
'
slug: DBJPA-INKPAD-Project-0.-환경-세팅
date: 2025-06-15T05:39:10.063Z
tags: ['Database', 'JPA', 'Spring', 'Springboot', 'db']
---
```
이번 스터디는 단순 DB 이론 학습이 아니라 실습을 통해 직접 결과물을 만드는 데 목적이 있음.
그래서 실습용 프로젝트를 포트폴리오 형태로 미리 설계하고 기본 환경을 세팅했다.

+스터디장님이 제공한 코드를 참고해 빠르게 환경 세팅 진행

📌 프로젝트명: Inkpad  
📌 목표: Notion + Velog 중간 지점에 있는 개인 블로그 시스템 구현  
📌 스택: Java, Spring Boot, JPA, MySQL, Docker, Swagger, GitHub
(추후 수정 예정 ^-^)

```

# Inkpad

## 1. 초기 프로젝트 생성
- Intellij에서 Gradle 기반 Spring Boot 프로젝트 생성
- 주요 의존성: `Spring Web`, `Spring Data JPA`, `MySQL Driver`, `Lombok`

## 2. Docker로 MySQL 세팅
- `docker-compose.yml` 사용

```yaml
version: '3'
services:
  mysql_db:
    image: mysql:8
    container_name: demo3-mysql_db-1
    ports:
      - "3307:3306"
    environment:
      MYSQL_ROOT_PASSWORD: 1234
      MYSQL_DATABASE: test
      MYSQL_USER: test
      MYSQL_PASSWORD: test
```
- 명령어 실행
```bash
docker compose up -d
```
- 실행 확인
```bash
docker exec -it demo3-mysql_db-1 mysql -uroot -p1234

```
## 3. application.yml 설정
> DB 연결 정보 입력, JPA 설정

```yaml
server:
  port: 8090

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3307/test?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
    username: root
    password: 1234

  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        highlight_sql: true

logging:
  level:
    org.hibernate.SQL: debug
    org.hibernate.orm.jdbc.bind: trace

```

## 4. Swagger(OpenAPI) 설정
> REST API를 개발할 때, 문서화 & 테스트를 쉽게 하기 위해 사용

- 의존성 추가(build.gradle)
```java
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.7.0'
```
- SwaggerConfg 클래스 생성
```java
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().openapi("3.0.0")
            .components(new Components().addSecuritySchemes("jwt-token",
                new SecurityScheme().type(SecurityScheme.Type.HTTP)
                    .scheme("bearer").bearerFormat("JWT")
                    .in(SecurityScheme.In.HEADER).name("Authorization")))
            .addSecurityItem(new SecurityRequirement().addList("jwt-token"))
            .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
            .title("inkpad Swagger")
            .description("inkpad 프로젝트 API 명세서")
            .version("1.0.0");
    }
}

```
- 접속 확인: `http://localhost:8090/swagger-ui.html`

## 5. JPA 공통 설정
> 게시글, 댓글 등 다양한 엔티티에서 생성/수정 시간을 자동으로 기록하려고 만든 설정
>`BaseTimeEntity`: `createdAt`, `modifiedAt` 자동 기록되는 공통 부모 클래스
> `JpaConfig`: JPA에 Auditing 기능 적용(시간 자동 기록)

- `BaseTimeEntity.java`
```java
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;
}

```
- `JpaConfig.java` 설정 추가
```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
```

## 6. Health Check 컨트롤러
> 서버가 잘 작동하는지 확인하는 간단한 API

```java
@RestController
public class HealthController {
    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}

```
- 확인: http://localhost:8090/health
## 7. GitHub 연동
- `gitignore`에 Docker 파일 제외 설정
```bash
mysql/data/
.env

```
-Git 명령어
```bash
git init
git add .
git commit -m "chore: 프로젝트 기본 설정 완료"
git remote add origin https://github.com/Tarte12/inkpad.git
git branch -M main
git push -u origin main

```

### 📌 다음 목표
- 기본 CRUD 기능 구현 (글 작성/조회/수정/삭제)
- JPA 연관관계 매핑 실습

👉 2편에서는 게시글(Post) 도메인을 설계하고, JPA를 통해 DB와 실제 데이터를 주고받는 과정을 기록할 예정!

