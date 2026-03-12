---
title: 'java) 자바 복습노트 #1 - this, 상속, 인터페이스, 제네릭'
slug: java-자바-복습노트-1-this-상속-인터페이스-제네릭
date: 2025-05-30T12:21:49.248Z
tags: []
---
> 자바를 공부한 후 복습의 필요성을 느껴 gpt를 이용해 복습한 내용을 담음

# CH06 클래스

- this의 의미와 동작에 대한 언어 혼동 

### this

- this.name = name;에서 this.name은 인스턴스 변수, name은 매개변수
- 만약 this 없이 name = name이라면 -> 둘 다 매개변수를 가리켜 자기 자신을 대입하는 셈이라 아무런 일도 일어나지 않음

```
class Car {
	String color;
    Car(String color) {
    	System.out.println("before: " + this.color);
        this.color = color;
        System.out.println("after: " + this.color);
    }
}
```

#### 코드 해석
1. Car 클래스 안에 color라는 필드와 생성자 존재
-> String color는 인스턴스 필드, 생성자는 매개변수로 color를 받음
2. 생성자의 매개변수 이름은 꼭 color일 필요 X, 가독성을 위해 사용
-> 매개변수명이 c여도 상관없음
```
Car(String c) {
    this.color = c;
}
```
-> **this.color = 객체의 필드, color(or c)는 매개변수**
3. 첫 번째 출력문은 this.color가 초기화되지 않아 null 출력
4. 두 번째 출력문은 this.color = color가 실행되어 필드의 값이 들어가 출력
# CH07 상속
- super()에 대한 개념이 약간 부족
### super()
- super(): 부모 생성자 호출, 자식 생성자에서 무조건 첫줄에 존재해야 함
- 생략해도 자동으로 super();가 들어감(부모에 기본 생성자가 있을 경우)
# CH08 인터페이스
- 클래서 다중 상속이 왜 안 되는지 구체적 이유 부족
- 인터페이스 코드 작성 약함

### why 클래스 다중 상속 X?
- 동일 메서드가 여러 상위 클래스에 정의되어 있을 경우 -> 어떤 것을 상속해야 하는지 모호해짐

### 인터페이스 코드 작성
```
interface Flyable {
	void fly();
}
# -> 이러고 fly를 구체적으로 구현할 클래스를 새로 만드는 거임

class Duck implements Flyable {
	public void fly() {
    	System.out.println("날개로 난다");
    }
}

class Airplane implements Flyable {
	public void fly() {
    	System.out.println("엔진으로 난다");
    }
}
```
# CH09 중첩 클래스와 익명 객체
- 정적/인스턴스 중첩 클래스 구분 혼동
- 익명 객체와 리스너 예시 흐름 안 잡힘

### 정척 중첩 클래스
- 정척 중첩 클래스는 **외부 클래스 인스턴스 없이 사용 가능**
-> 마치 static처럼
- 인스턴스 중첩 클래스는 외부 클래스 인스턴스가 필요함

### 익명 객체 예시 흐름
```
Button b = new Button();
b.setOnClickListener(new Button.OnClickListener() {
    public void onClick() {
        System.out.println("클릭!");
    }
});
b.press();
```
1. Button b = new Button();
2. setOnClickListener)에 익명 구현 객체를 넘김
3. press()호출 시, 내부에서 listener.onClick() 호출


# CH10 라이브러리와 모듈
- java.base 모듈에 어떤 패키지가 기본적으로 포함되어 있는지
- 모듈 시스템의 장점
- requires, exports
### java.base 모듈 기본 포함 패키지
- java.lang, java.util, java.io, java.nio, java.math, java.net...

### 모듈의 장점
- 정보 은닉 강화: exports로 공개할 패키지 지정 가능
- 명확한 의존성 명시: requires로 필요한 모듈만 선언
- 모듈 단위 관리 기능: 패키지가 아닌 모듈 단위로 프로그램 구성
- 컴파일 타임 검증

### requires, exports
- requires: 해당 모듈이 다른 모듈에 의존하고 있음
-> ex) requires java.sql =java.sql 모듈의 API 사용 가능
- exports:지정한 패키지를 외부 모듈에 공개
-> **공개하지 않은 패키지는 모듈 외부에서 접근 불가**
# CH11 예외 처리
- 문법적으로 아리까리
- throws는 메서드 선언부에 작성

### throws
```
public void withdraw(int amount) throws InsufficientBalanceException {
    if (amount > balance) {
        throw new InsufficientBalanceException("잔액 부족");
    }
}

```
# CH12 java.base 모듈
- hashCode(), String 불변 이유 잘 모름

### hashCode()
- equals()가 true이면 hashCode도 같아야 Set, Map에서 제대로 동작함
**이거 첨 알았는데?**
### String
- 불변 객체이기 때문에 **해시 값 캐싱이 가능하고 동기화 이슈가 적음**

# CH13 제네릭
- 와일드카드 개념(extends, super) 미숙
- 제네릭 메서드의 타입 결정 흐름

### 와일드카드 개념
- <? extends T>: 읽기 전용 (T의 하위 타입 허용)
- <? super T>: 쓰기 전용 (T의 상위 타입 허용)

### 제네릭 메서드
```
<T> T returnSame(T t) {
    return t;
}
```
- <T> T method(T t)에서 T는 **메서드 호출 시점에서 전달된 타입으로 추론됨