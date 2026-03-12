---
title: 'JAVA) 어노테이션'
slug: CS-JAVA-어노테이션S-JAVA-어노테이션
date: 2025-03-19T08:02:24.419Z
tags: []
---
> ** 1. 어노테이션을 사용하는 이유는 무엇일까? **
** 2. 나만의 어노테이션은 어떻게 만들 수 있을까? **

# 어노테이션(Annotation)

## 1. 메타데이터
**"데이터를 설명하는 데이터"**
- 기본 데이터에 대한 추가 정보를 제공하는 데이터
>예시 
>- 데이터 : 자바의 정석
>- 메타데이터 : 저자: 남궁성, 출판년도: 2016

## 2. 어노테이션
- Java에서 어노테이션이 메타데이터 역할을 수행 => 소스 코드에 추가적인 정보 제공
- ** 어노테이션은 코드의 실행 방식 or 처리 방식을 결정하는 추가적인 정보를 담고 있음**
- ** 직접 실행 X, 자바 컴파일러, 런타임 환경이 어노테이션을 읽고 처리하는 방식만 결정**

## 3. 어노테이션 종류
- 표준(내장) 어노테이션 : 자바가 기본적으로 제공하는 어노테이션
- 메타 어노테이션 : 어노테이션을 위한 어노테이션
- 사용자 정의 어노테이션 : 사용자가 직접 정의하는 어노테이션

### 3.1 표준 어노테이션

- @0verride : 선언한 메서드가 오버라이드되었음을 나타냄
- @Deprecated : 해당 메서드가 더이상 사용되지 않음을 나타냄
- @SuppressWarnings : 선언한 곳의 컴파일 경고 무시
- @SafeVarargs : Java 7부터 지원, 제너릭 같은 가변인자의 매개변수를 사용할 때 경고 무시
- @FunctionalInterface : Java 8부터 지원, 함수형 인터페이스를 지정하는 어노테이션

### 3.2 메타 어노테이션 : 사용자 정의 어노테이션 만들 때 사용 가능

- @Retention : 자바 컴파일러가 어노테이션을 다루는 방법을 기술하며, 특정 시점까지 영향을 미치는지 결정
- @Documented : 해당 어노테이션을 javadoc 문서에 포함시킬지 여부 결정
- @Target : 어노테이션이 적용할 위치 지정
- @Inherited : 어노테이션의 상속을 가능하게 함
- @Repeatable : Java 8부터 지원, 연속적으로 어노테이션을 선언할 수 있게 함

### 3.3 사용자 정의 어노테이션
- @Interface 키워드를 사용해 인터페이스 정의 가능
- 어노테이션 속성을 추가하기 위해 멤버 정의 가능
- 메타 어노테이션을 이용하여 사용자 정의 어노테이션의 적용 지점과 유지 기간 지정

## 4. 어노테이션 실무 활용

- Spring Framework 커스텀 확장 기능
- 점증 및 데이터 바인딩
- 보안 및 인증
- 문서화 및 코드 분석
- Aspect+-Oriented Programming(AOP)
- 커스텀 메타데이터 및 확장성
- 컴파일 타임 체크 및 경고 억제

## 5. 스프링에서의 어노테이션 활용

- 어노테이션을 활용하여 **설정 파일(XML)을 줄이고, 직관적인 방식으로 빈(Bean)관리**
- 의존성 주입(DI), AOP, 트랜잭션 관리, MVC 컨트롤러 설정 등에 사용

### 5.1 컴포넌트 스캔과 빈 등록
- 스프링 컨테이너가 관리하는 객체(빈, Bean)를 자동으로 등록하기 위해 사용
- **@Component**를 사용하면 applicationContext가 자동으로 이 클래스를 **빈으로 등록**
```
import org.springframework.stereotype.Component;

@Component //스프링이 자동 관리 (빈으로 클래스 등록)
public class MyComponent {
	public void doSomething() {
    	System.out.println("컴포넌트 실행 중!");
    }
}
```
** 유사 어노테이션 **
- @Service :  비즈니스 로직 담당 서비스 클래스
- @Repository : DAO(데이터 접근 계층) 역할을 하는 클래스
- @Controller : MVC 패턴의 컨트롤러 역할

### 5.2 의존성 주입(DI, Dependency Injection)
- 스프링에서 객체 간 의존성을 관리하기 위해 @Autowired, @Inject 사용
```
@Component
class Engine {
    public void start() {
        System.out.println("엔진이 가동됩니다!");
    }
}

@Component
class Car {
    @Autowired // Engine 객체를 자동으로 주입
    private Engine engine;

    public void drive() {
        engine.start();
        System.out.println("차가 출발합니다!");
    }
}

```
- **@Autowired**를 사용하면, 스프링이 자동으로 Engine 객체를 주입해서 Car 객체가 사용할 수 있게 함

### 5.3 MVC 웹 개발에서 활용
- 스프링 웹 애플리케이션을 만들 떄, 컨트롤러와 요청 매핑을 설정하는 데에 어노테이션 필수적으로 사용
```
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hello") // 기본 URL 패턴 설정
public class HelloController {

    @GetMapping // GET 요청을 처리
    public String sayHello() {
        return "안녕하세요!";
    }

    @PostMapping // POST 요청을 처리
    public String postHello() {
        return "POST 요청 완료!";
    }
}

```
- **@RestController** : REST API를 위한 컨트롤러
- **@RequestMapping("/hello")** : 기본 URL을 /hello로 설정
- **@GetMapping, @PostMapping** : HTTP 요청을 처리하는 엔드포인트 설정

### 5.4 트랜잭션 관리
- DB 작업 중 오류가 발생하면 롤백하도록 설정 가능
```
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MyService {

    @Transactional // 트랜잭션을 자동으로 관리
    public void processData() {
        // DB 작업 수행
        System.out.println("데이터 처리 중...");
    }
}

```
- **@Transactional** : DB 작업 중 오류가 나면 자동으로 롤백하도록 함

## 6. 어노테이션 사용하는 이유는 무엇일까?

### 6.1 설정을 간결하게
- 기존 XML 기반 설정보다 훨씬 가독성이 높고 유지보수 쉬움
```
<XML 설정 방식>
<bean id="myComponent" class="com.example.MyComponent"/>

<어노테이션 활용>
@Component
public class MyComponent { }
```
### 6.2 자동화된 빈 관리
- @Component, @Autowired 같은 어노테이션 사용 => 스프링이 자동으로 객체를 생성하고 주입 => 개발자가 객체 생성 직접 관리할 필요 X
### 6.3 유지보수와 확장성 증가
- 설정을 직관적으로 볼 수 있고, 새로운 기능 쉽게 추가 가능

## 7. 나만의 어노테이션은 어떻게 만들까?

- 메서드 실행 시간을 측정하는 어노테이션을 만든다면

### 7.1 어노테이션 정의
```
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME) // 실행 시에도 유지됨
@Target(ElementType.METHOD) // 메서드에 적용 가능
public @interface LogExecutionTime { }

```

### 7.2 어노테이션 처리 로직
```
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;

@Aspect
@Component
public class LogAspect {

    @Around("@annotation(LogExecutionTime)") // LogExecutionTime이 붙은 메서드를 감싸서 실행
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long end = System.currentTimeMillis();

        System.out.println("메서드 실행 시간: " + (end - start) + "ms");
        return result;
    }
}

```

### 7.3 어노테이션 활용
```
import org.springframework.stereotype.Service;

@Service
public class MyService {

    @LogExecutionTime
    public void doWork() {
        System.out.println("작업 수행 중...");
    }
}

```