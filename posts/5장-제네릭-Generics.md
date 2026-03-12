---
title: '5장) 제네릭 (Generics)'
slug: 5장-제네릭-Generics
date: 2025-11-12T08:50:56.078Z
tags: []
---
> 주제: "타입 안전한 코드" 만드는 방법
=> **실행 중에 터질 오류를 컴파일 시점에 막는 기술 = 제네릭**

# ITEM 26 로 타입(raw type)은 사용하지 말라
| 용어                               | 정의                                            | 예시                                            |
| -------------------------------- | --------------------------------------------- | --------------------------------------------- |
| **제네릭(Generic)**                 | 클래스나 메서드를 만들 때, 타입을 미리 정하지 않고 나중에 정하도록 하는 문법. | `List<E>` → 나중에 `E`를 `String`이나 `Integer`로 지정 |
| **타입 매개변수(Type Parameter)**      | 제네릭에서 타입을 대신하는 변수 이름.                         | `List<E>`의 `E`                                |
| **매개변수화 타입(Parameterized Type)** | 제네릭에 실제 타입을 지정한 형태.                           | `List<String>`                                |
| **로 타입(Raw Type)**               | 제네릭을 사용하지만 타입 매개변수를 아예 안 쓴 형태.                | `List list = new ArrayList();`                |
| **와일드카드 타입(Wildcard Type)**      | `?`로 표현하는, “어떤 타입이든 올 수 있다”는 뜻.               | `List<?>`                                     |
### 제네릭 이전
- 제네릭 도입 이전에는 컬렉션에 타입 정보를 넣지 않음
- **문법상 문제없지만**, 나중에 `String`만 꺼내려고 하면 `ClassCastException`이 터짐
```java
List list = new ArrayList();
list.add("hi");
list.add(123);
```

### 제네릭 이후
-> 제네릭을 쓰면 **잘못된 타입 추가를 컴파일러가 잡아 줌**
```
List<String> list = new ArrayList<>();
list.add("hi");
list.add(123); // ❌ 컴파일 에러 발생
```

### 근데 raw type을 쓰면?
-> 제네릭을 선언했는데 타입을 생략하면 `raw type`이 되어 버려서 타입 안전성이 무너짐
```
List list = new ArrayList<String>();
list.add(123); // ❌ 여전히 들어감
```

#### 결론
- 제네릭 타입을 선언할 때는 **<> 안을 반드시 채우기**
- `List<Object>`도 raw type이 아님 (raw type은 **<> 자체가 없는 것**)

# ITEM 27 비검사 경고(unchecked warning)를 제거하라
| 용어                                 | 정의                                                  | 예시                                                       |
| ---------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| **비검사 경고(unchecked warning)**      | 제네릭 타입을 명확히 쓰지 않아 컴파일러가 “타입 안전을 보장할 수 없다”고 알려주는 경고. | `List<String> list = new ArrayList();`                   |
| **다이아몬드 연산자(<>)**                  | 자바 7부터 도입된 문법으로, 컴파일러가 타입을 추론하게 함.                  | `new ArrayList<>();`                                     |
| **@SuppressWarnings("unchecked")** | 정말로 안전할 때만 비검사 경고를 무시하겠다고 표시하는 주석.                  | `@SuppressWarnings("unchecked") List<String> list = ...` |

### 문제 
- 제네릭을 사용할 떄 "타입 불일치"가 완벽히 잡히지 않으면 컴파일러가 경고를 띄움
```java
List<String> list = new ArrayList();
```
-> 비검사 형변환 경고 발생 => **안전성을 보장할 수 없음**

### 해결
1. 타입 파라미터를 명시적으로 써라
```java
List<String> list = new ArrayList<String>();
```
2. 다이아몬드 연산자(`<>`)를 사용
```java
List<String> list = new ArrayList<>();
```
3. 정말로 경고를 무시해도 되면
```java
@SuppressWarnings("unchecked")
```
를 붙이되, **주석으로 이유 작성** 필요

# ITEM 28 배열보다는 리스트를 사용하라
| 용어                      | 정의                           | 예시                                                  |
| ----------------------- | ---------------------------- | --------------------------------------------------- |
| **공변(Covariant)**       | 부모-자식 관계가 그대로 유지되는 것.        | `String`은 `Object`의 자식 → `String[]`은 `Object[]`의 자식 |
| **불공변(Invariant)**      | 부모-자식 관계를 인정하지 않는 것.         | `List<String>`과 `List<Object>`는 서로 아무 관계 없음         |
| **타입 소거(Type Erasure)** | 제네릭 정보가 컴파일 후 런타임에는 사라지는 현상. | `List<String>` → 런타임에는 단순히 `List`로 취급               |

### 배열의 문제
- 제네릭은 불공변(invariant), 배열은 공변(covariant)
-> 배열은 컴파일러가 못 막고 실행할 때 터짐
```java
Object[] arr = new String[2];
arr[0] = 1; // ❌ 실행 시 오류 (ArrayStoreException)
```

### 제네릭의 경우
-> **타입 안정성**을 위해 불공변 선택
- "잘못된 타입을 애초에 넣을 수 없게" 막음
```java
List<Object> list = new ArrayList<String>(); // ❌ 컴파일 자체가 안 됨
```

### 배열과 제네릭은 같이 쓰기 어려움
- 배열은 런타임에 타입 정보를 지우지 않지만, 제네릭은 **타입 소거(Type Erasure)** 때문에 실행 시점에 `List<?>`로만 남음
- 따라서 섞어 쓰면 타입 검사가 불완전해져서 금지
```java
List<String>[] lists = new List<String>[2]; // ❌ 컴파일 에러
```
# ITEM 29 이왕이면 제네릭 타입으로 만들라
| 용어                                    | 정의                      | 예시                                        |
| ------------------------------------- | ----------------------- | ----------------------------------------- |
| **제네릭 클래스(Generic Class)**            | 클래스 전체가 타입 파라미터를 받는 형태. | `class Stack<E> { void push(E e) {...} }` |
| **실제 타입 매개변수(Actual Type Parameter)** | 제네릭을 쓸 때 구체적으로 지정한 타입.  | `Stack<Integer>`의 `Integer`               |
| **정규 타입 매개변수(Formal Type Parameter)** | 클래스 정의 시 사용된 타입 변수.     | `Stack<E>`의 `E`                           |

클래스를 만들 때 내부 필드가 타입에 의존 => **그 클래스도 제네릭으로 만들자**

### 예시) 잘못된 Stack
- `Object`를 쓰니까 `pop()`할 때마다 **형변환이 필요하고**, 잘못 캐스팅하면 터짐
```java
class Stack {
    private Object[] elements;
    ...
    public void push(Object e) { ... }
    public Object pop() { ... }
}
```
### 제네릭 Stack
- 타입 안정성을 확보하여 컴파일 시점에 오류 잡을 수 있음
```java
class Stack<E> {
    private E[] elements;
    public void push(E e) { ... }
    public E pop() { ... }
}
```

# ITEM 30 이왕이면 제네릭 메서드로 만들라
| 용어                          | 정의                               | 예시                                       |
| --------------------------- | -------------------------------- | ---------------------------------------- |
| **제네릭 메서드(Generic Method)** | 메서드 선언부에 타입 파라미터가 있는 메서드.        | `<E> Set<E> union(Set<E> s1, Set<E> s2)` |
| **타입 추론(Type Inference)**   | 컴파일러가 메서드 호출 시 타입을 자동으로 유추하는 기능. | `Set<Integer> result = union(s1, s2);`   |

### 예시: 형변환이 필요한 메서드
-> 반환 타입이 `Set<Object>`가 되어 버려 매번 형변환 필요
```java
public static Set union(Set s1, Set s2) {
    Set result = new HashSet(s1);
    result.addAll(s2);
    return result;
}

```
### 제네릭 메서드로 개선
-> 타입 안정성 확보 + 형변환 필요 X
```java
public static <E> Set<E> union(Set<E> s1, Set<E> s2) {
    Set<E> result = new HashSet<>(s1);
    result.addAll(s2);
    return result;
}

```

- 메서드 내부에서 타입이 유동적이라면 **제네릭 메서드로 바꿔라**
- `<E>`는 '이 메서드 안에서 타입 E를 쓸 거야`라는 선언

# ITEM 31 한정적 와일드카드를 사용해 API 유연성을 높이라
| 용어                                 | 정의                                    | 예시                            |
| ---------------------------------- | ------------------------------------- | ----------------------------- |
| **한정적 와일드카드(Bounded Wildcard)**    | `extends`나 `super`로 타입 범위를 제한한 와일드카드. | `List<? extends Number>`      |
| **비한정적 와일드카드(Unbounded Wildcard)** | 아무 제약 없는 `?`.                         | `List<?>`                     |
| **PECS 원칙**                        | Producer Extends, Consumer Super.     | 읽기용은 `extends`, 쓰기용은 `super`. |

### 예시
-> 여기에서 `E`만 쓰면 타입이 정확하게 같을 때만 허용
```
public static void pushAll(Iterable<E> src)
```

### 한정적 와일드카드로 개선
- Producer → extends (생산자)
- Consumer → super (소비자)
```java
void pushAll(Iterable<? extends E> src)
void popAll(Collection<? super E> dst)

```

- extends는 읽기용, super는 쓰기용
- 불필요한 형변환 없이 다양한 타입 조합을 허용할 수 있음

# ITEM 32 제네릭과 가변인수를 함께 쓸 땐는 신중하라
| 용어                | 정의                                | 예시                                                  |
| ----------------- | --------------------------------- | --------------------------------------------------- |
| **가변인수(Varargs)** | 인수를 여러 개 받을 수 있는 문법.              | `void print(String... args)`                        |
| **@SafeVarargs**  | 제네릭 가변인수가 안전하다는 걸 컴파일러에게 알려주는 주석. | `@SafeVarargs static <T> List<T> of(T... elements)` |

가변인수(...)는 내부적으로 배열을 만들기 때문에, 제네릭과 섞으면 타입 안전성이 깨질 수 있음
```java
@SafeVarargs
static <T> List<T> asList(T... elements) {
    return Arrays.asList(elements);
}
```

- 제네릭 + 가변인수 조합은 신중하게
- 내부에서 배열을 외부로 넘기면 절대 안 됨
- 안전할 때만 `@SafeVarargs` 붙이기

# ITEM 33 타입 안전 이종 컨테이너를 고려하라
| 용어                                   | 정의                                      | 예시                              |
| ------------------------------------ | --------------------------------------- | ------------------------------- |
| **이종 컨테이너(Heterogeneous Container)** | 여러 타입의 데이터를 한 컨테이너에 안전하게 저장할 수 있는 구조.   | `Favorites` 예제                  |
| **타입 토큰(Type Token)**                | 클래스 객체(`Class<T>`)를 이용해 타입 정보를 전달하는 방법. | `String.class`, `Integer.class` |
| **Class.cast()**                     | 런타임에 타입을 확인하고 캐스팅하는 안전한 방법.             | `type.cast(object)`             |

### 일반 제네릭 컨테이너의 한계
- 매번 캐스팅해야 해서 타입 안정성 떨어짐
```java
Map<String, Object> map = new HashMap<>();
map.put("age", 25);
int age = (Integer) map.get("age"); // 형변환 필요
```

### 이종 컨테이너 패턴
- 타입을 키로 사용하는 구조
```java
class Favorites {
    private Map<Class<?>, Object> map = new HashMap<>();

    public <T> void putFavorite(Class<T> type, T instance) {
        map.put(type, instance);
    }

    public <T> T getFavorite(Class<T> type) {
        return type.cast(map.get(type));
    }
}
```

- 키로 타입 정보를 저장하면 여러 타입을 안전하게 한 Map에 담을 수 있음
- 스프링의 ApplicationContext 같은 프레임워크도 이 원리를 활용