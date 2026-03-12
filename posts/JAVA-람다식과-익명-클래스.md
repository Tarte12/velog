---
title: 'JAVA) 람다식과 익명 클래스'
slug: JAVA-람다식과-익명-클래스
date: 2025-03-19T08:37:05.672Z
tags: []
---
### 익명 클래스 (Anonymous Class)
- 이름이 없는 클래스
- **한 번만 사용할 클래스를 간결하게 정의할 때** 사용
- 인터페이스나 추상 클래스를 구현할 때, 객체를 생성하면서 바로 메서드를 오버라이딩하는 방식으로 익명 클래스 생성 가능
```
interface Greeting {
    void sayHello();
}

public class Main {
    public static void main(String[] args) {
        Greeting greeting = new Greeting() {  // 익명 클래스 사용
            @Override
            public void sayHello() {
                System.out.println("안녕하세요!");
            }
        };

        greeting.sayHello();
    }
}

```

### 람다식 (Lambda Expression)
- 익명 함수를 표현하는 방법
- 익명 클래스보다 더 간결하게 코드 작성 가능
- 함수형 프로그래밍을 지원하는 중요한 기능
```
public class Main {
    public static void main(String[] args) {
        Greeting greeting = () -> System.out.println("안녕하세요!");
        greeting.sayHello();
    }
}
```

### 함수형 프로그래밍(Functional Programming)
- 자바는 원래 객체 지향 프로그래밍 언어지만, 자바 8부터 함수형 프로그래밍 스타일도 지원하게 됨
- 순수 함수 : 같은 입력에 대해 항상 같은 결과 반환
- 부수 효과 없음 : 외부 상태 변경 X
- 고차 함수 : 함수를 매개변수로 전달하거나 반환 가능
```
import java.util.function.Function;

public class Main {
    public static void main(String[] args) {
        Function<Integer, Integer> square = x -> x * x;
        System.out.println(square.apply(5)); // 25 출력
    }
}
```

### @FunctionalInterface(함수형 인터페이스)
- 자바에서 람다식을 이용하려면 인터페이스가 단 하나의 추상 메서드만 가져야 함
- 이런 인터페이스를 함수형 인터페이스라고 하고, @FunctionalInterface를 붙여 문법적 보장 가능
```
@FunctionalInterface
interface Calculator {
    int operate(int a, int b);
}

public class Main {
    public static void main(String[] args) {
        Calculator add = (a, b) -> a + b;
        System.out.println(add.operate(3, 7)); // 10 출력
    }
}

```

### 스트림 API
- 자바 8에선 배열이나 컬렉션을 다룰 때 함수형 스타일로 처리할 수 있도록 스트림 API를 제공
```
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("홍길동", "김철수", "이영희");

        names.stream() // 스트림 생성
            .filter(name -> name.startsWith("김")) // 필터링
            .forEach(System.out::println); // 출력
    }
}

```

### 메소드 레퍼런스 (Method Reference)
- 람다식이 너무 길어질 경우, 이미 정의된 메서드를 참조하여 람다식을 더 짧게 표현
```
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("홍길동", "김철수", "이영희");

        names.forEach(System.out::println); // 메소드 레퍼런스 사용
    }
}

```

### 정리 (키워드가 어떻게 연관되는가?)
**1. 람다식은 익명 클래스를 대체하기 위해 등장했지만, 단순한 문법 축소가 아니라 함수형 프로그래밍을 지원하기 위한 기능이다.**

**2. 람다식을 사용하려면 반드시 단 하나의 추상 메서드를 가진 "함수형 인터페이스"가 필요하고, 이를 명확히 하기 위해 @FunctionalInterface를 사용한다.**

**3. 람다식은 실무에서 주로 스트림 API와 함께 사용되며, 컬렉션을 다룰 때 강력한 기능을 제공한다.**

**4. 람다식을 더 간결하게 만들기 위해 메소드 레퍼런스를 활용하면 코드가 더욱 직관적이고 짧아진다.**

### 질문

#### 1. 자바의 람다식은 왜 등장한 걸까?
- 기존 익명 클래스의 방식이 번거롭고 코드가 길어지는 문제를 해결하기 위함
- 람다식을 사용하면 코드를 간결하게 줄이고, 함수형 프로그래밍 스타일 도입 가능

#### 2. 람다식과 익명 클래스의 관계는?
- 람다식은 익명 클래스의 단순한 형태
- 람다식은 함수형 인터페이스(메서드 하나만 가진 인터페이스)만 구현 가능
- 익명 클래스는 여러 개의 메서드를 가진 인터페이스나 클래스 확장 가능

#### 3. 람다식의 문법은?
- (매개변수) -> {실행 코드}