---
title: '[Java] Week 3 CH 14 ~ CH 21'
slug: Week-3-CH-14-CH-21
date: 2025-06-02T09:50:44.910Z
tags: ['Java']
---

### 비동기 통신(Asynchronous Communication)
- **어떤 작업을 시작한 후, 그 작업의 완료를 기다리지 않고 다음 작업을 계속 진행하는 통신 방식**

#### 동기 통신(Synchronous Communication)
- 작업을 시작하면 해당 작업이 완료될 때까지 기다렸다가 다음 작업을 진행
- 예시:
	- 전화 통화: A가 B에게 전화를 걸면, B가 전화를 받을 때까지 A는 기다림
    - ATM 현금 인출: 카드를 넣고 비밀번호를 입력하면, 기기가 돈을 인출해 줄 때까지 기다려야 함
    - 일반적인 웹 요청(블로킹 I/O): 웹 브라우저가 서버에 페이지 요청을 보냈을 때, 서버가 응답을 보낼 때까지 브라우저는 아무것도 하지 않고 기다림

#### 비동기 통신(Asynchronous Communication)
- 어떤 작업을 시작한 후, 그 작업의 완료를 기다리지 않고 다음 작업을 계속 진행하는 통신 방식
- 예시:
	- 파일 다운로드 중 다른 작업 수행
    - 비동기 웹 요청(논블로킹 I/O): 웹 페이지에서 데이터를 가져오는 요청을 보낸 후, 응답이 올 때까지 기다리지 않고 다른 UI 작업을 함
- 싱글 코어 
> 병렬 처리는 멀티 코어

#### 1) 비동기(다른 작업해도 충분한 거) VS Non-blocking <- 싱글 코어(동시성 이미지)
- 싱글 코어 단계의 내용
- 비동기: 제어권 OS한테 위임 <= 넘기니까 자원을 더 적게 쓸 수밖에
	- api 호출 => React
- Non-blocking: 제어권 자기 자신이 처리 => 비동기보다 더 자원을 많이 씀
	- 파일 r/w, 데이터베이스 요청

#### 2) VS 병렬처리(CPU 바운드 특화, 성능) <- 멀티 코어
- 멀티 코어 단계의 내용

# CH14 멀티스레드 ⭐⭐⭐
## 스레드는 OS 개념인데, 왜 자바에서 나올까?
### OS에서 스레드
- 프로세스: 실행 중인 프로그램의 단위
- 멀티 프로세싱: 운영체제가 CPU 및 메모리 자원을 프로세스마다 할당해 주고 병렬로 실행시키는 것
- 스레드: 프로세스 내부에서 **실제로 일이 실행되는 작업 단위**
- 멀티 스레드: 여러 작업을 **동시에 실행**하는 구조

### 자바에서 스레드
- 자바는 **OS 위에서 실행되는 프로그램**을 작성하는 언어
- 자바 프로그램도 OS에서 실행되는 프로세스
- 여러 작업을 동시에 처리하거나, UI 이벤트와 백그라운드 처리를 병렬로 처리하려면 OS의 스레드 기능을 써야 함
- 자바는 이것을 위해 `java.lang.Thread`와 `Runnable` 인터페이스 이용(JVM이 `Thread` 객체를 통해 직접 생성하고 실행)

> 즉, 자바는 OS의 스레드 개념을 언어 수준에서 추상화해서 제공
-> **자바에서 멀티스레딩 프로그래밍을 하게 되면, 자연스럽게 OS 스레드 개념을 써야 함**

### 자바에서 스레드를 쓰는 이유
1. 병렬 처리: 여러 작업을 동시에 처리
2. UI 응답성 확보: UI 애플리케이션에서 백그라운드 작업 처리
3. 스프링에서 활용: 비동기 처리, 스케줄링, 웹 요청 처리 등에서 기본 스레드 동작 기반

### OS + 자바 연결 흐름 요약
```
[운영체제] 스레드
   ↑           ↖
[자바 Thread 클래스 / Runnable 인터페이스]
   ↑
[내가 짠 자바 프로그램에서 쓰레드를 생성/실행]

```
** 그렇다면 Thread 클래스와 Runnable 인터페이스가 뭘까? **

## Thread 클래스, Runnable 인터페이스

### 메인 스레드
- 자바의 모든 프로그램은 `main()` 메서드를 실행하며 시작
-> `main()` 메서드 실행 주체 = **메인 스레드**
- 우리가 작성하는 `public static vid main()` 메서드는 **메인 스레드의 시작점**
- 싱글 스레드 애플리케이션: 메인 스레드 종료 -> 프로세스 종료
- 멀티 스레드 애플리케이션: 메인 스레드 종료 -> IF 실행 중인 스레드 존재 -> 프로세스 종료 X
- **추가적인 작업은? ** => **별도 스레드 생성!**

## 작업 스레드: Thread 클래스, Runnable 인터페이스
- Thread를 상속받으면, 다른 클래스를 상속받을 수 없음 => 인터페이스를 구현하는 방법이 일반적

### Thread 클래스 상속
```java
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("스레드 실행 중...");
    }
}

MyThread t = new MyThread();
t.start();  // 스레드 시작

```
- 자바에서 제공하는 `Thread` 클래스를 상속받음
- `Thread` 클래스 자체는 OS 스레드를 생성해 줄 JVM의 포장 클래스
> `Thread` 클래스를 상속받아 사용한다면, 자바(프로세스)에서 사용할 스레드를 생성한 게 아닌가?
그렇다면 이것을 왜 OS 스레드라고 하는 거지?

**왜 Thread는 OS 스레드를 생성하는 포장 클래스일까?**

#### 1. 운영체제 관점
- 스레드: CPU에서 실행될 수 있는 작업 단위(실행 흐름)
- OS는 각각의 스레드를 스케줄링해서 CPU에 올리는 역할
- **즉, 스레드를 진짜 만들고, 동시 실행을 관리하는 주체 => OS**
#### 2. 자바 관점
- 자바는 `Thread` 클래스를 제공해서 개발자가 코드를 통해 "스레드를 만들고 실행하겠다"라고 선언할 수 있음
- But, 이것은 **JVM이 제공하는 일종의 래퍼(wrapper) 클래스**
- if 개발자가 `start()`를 호출:
	- JVM 내부에서 **OS에게 실제 스레드(네이티브 스레드)**를 만들어 달라고 요청
    - OS가 자바 프로세스 내에 **OS 수준의 새로운 스레드** 생성해 줌
    - OS 스레드가 개발자가 정의한 `run()` 메서드 실행
```java
public class MyThread extends Thread {
    public void run() {
        System.out.println("작업 실행!");
    }

    public static void main(String[] args) {
        new MyThread().start();
    }
}
```
1. `new MyThread()` -> 자바 객체 생성(아직 OS 스레드 없음)
2. `start()` 호출
	- JVM이 OS에게 새로운 스레드 생성 요청
    - OS는 실제 실행할 스레드를 만들고, `run()` 메서드 실행
    
#### 3. 기타 포인트
- JVM은 멀티플랫폼(윈도우, 리눅스, 맥 등)
- OS마다 스레드 만드는 방식 다름
- 자바는 `Thread`라는 통일된 클래스 하나만 제공
- ** JVM 내부에서 OS마다 다르게 스레드를 생성하도록 처리**

#### 4. 결론
- 자바는 OS 스레드를 직접 다루지 않고, `Thread` 클래스를 통해 **JVM이 중계**
- `Thread` 클래스는 직접 스레드를 돌리는 게 아니라,
- OS 스레드를 요청하고 -> 그 위에서 `run()`을 실행시킴
- 그래서 **JVM 입장에선 Thread 객체는 껍데기**, 진짜는 **OS Native Thread**

### Runnable 인터페이스 구현
```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable 스레드 실행 중");
    }
}

Thread t = new Thread(new MyRunnable());
t.start();  // 실행!

```
- `Runnable`은 실행할 작업만 정의
- 스레드 생성은 `Thread`가 담당하고, `Runnable`은 실행할 로직을 넘김
- **스레드와 로직을 분리하기 때문에 실무에서 더 많이 씀**

## 스레드의 이름
- 스레드는 이름을 가짐
- 이름은 특별히 쓸모있지는 않으나, 디버그할 때 어떤 스레드가 어떤 작업을 하는지 알기 좋음
- 스레드는 자동으로 `Thread-n`이라는 이름으로 명명됨
	- `n`: 스레드 번호
    - `main` 스레드 이름: `main`
- 스레드의 이름을 변경: 스레드 객체의 `.setName()` 메서드 이용
- 스레드 이름 알고 싶을 때: 스레드 객체의 `.getName()` 메서드 이용
- 현재 수행 중인 스레드가 궁금할 때: `Thread.currentThread()` 메서드로 현재 실행되고 있는 스레드의 참조를 얻을 수 있음

** 06/05 **

## 스레드의 우선 순위

### 동시성과 병렬성

#### 동시성(Concurrency)
- 하나의 코어에서 멀티스레드가 번갈아가며 실행되는 성질

#### 병렬성(Parallelism)
- 멀티 코어에서 개별 스레드를 동시에 실행하는 성질

![](https://velog.velcdn.com/images/emprimula/post/6afd31d0-c61f-4781-8ae7-70e45076ea62/image.png)

### 동시성에서 스케줄링
- **스레드의 개수가 CPU 코어의 수보다 많다면 동시성 성질을 가짐**
- CPU 코어의 수가 더 많으면 병렬성 성질을 갖게 되어 말 그대로 병렬적으로 처리되고 스케줄링도 필요없음
- **스케줄링**: 동시성 성질이 있을 때 CPU가 스레드를 어떤 방식으로 처리할지 정하는 방법

#### 우선순위(Priority)
- 우선순위가 높은 스레드 먼저 처리
- 자바에서 생성된 스레드는 **기본적으로 우선순위가 5(`Thread.NORM_PRIORITY`)**로 설정됨
- **JVM**은 **기본적으로 모든 스레드를 동일하게 취급** (우선순위가 없다면 **동등한 조건**에서 OS 스케줄러에게 넘김)
- 개발자가 코드로 스레드에게 우선순위 부여 가능

** `.setPriority()`메서드 **

- 개발자가 **스레드마다 우선순위 지정**할 수 있음
- 범위 ** 1(MIN_PRIORITY) ~ 10(MAX_PRIORITY) **
```JAVA
Thread thread1 = new Thread(...);
thread1.setPriority(10); // 높은 우선순위

```
> 가독성을 위해 `Thread.MAX_PRIORITY = 10`, `Thread.NORM_PRIORITY = 5`, `Thread.MIN_PRIORITY = 1`등의 상수도 정해짐

** 주의 **
- **JVM이 직접 스케줄링하지 않고 OS 스케줄러에게 위임**
- 따라서 `.setPriority()`는 **우선순위 힌트**일 뿐, **OS 정책에 따라 무시될 수 있음**
	- Windows는 거의 무시
    - 일부 UNIX/Linux 환경에서는 고려될 수 있음

=> 잘 안 쓸 것 같은데? **GPT도 실무에서 잘 안 쓴다고 그럼**

| 이유               | 설명                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| ⚙️ OS 종속성 있음     | JVM이 `setPriority()`를 넘겨도, 실제로 **OS 스케줄러가 반영할지 보장되지 않음**. 대부분 OS는 우선순위를 무시하거나 최소 반영함.             |
| 🧩 예측 불가능        | 같은 코드를 실행해도 **운영체제, JVM 구현, 하드웨어 상황에 따라 동작이 달라짐**. 테스트도 어려움.                                      |
| 💡 스레드 관리 전략과 충돌 | 실무에서는 대부분 \*\*스레드 풀 (ExecutorService)\*\*를 사용해서 스레드를 컨트롤함. 이때 우선순위보다는 **큐 관리, 태스크 분배 전략**이 더 중요함. |
| 👨‍💻 동시성 문제에 취약 | 우선순위로 실행 순서를 인위적으로 조작하면 **디버깅이 더 어려워지고**, \*\*경쟁 조건(race condition)\*\*이 생길 가능성도 증가함.  |

#### => 그러면 실제 스레드 제어는? 
- `ExecutorService`, `ThreadPoolExcutor`, `CompletableFuture`, `Reactor` 등을 사용해서 **스레드 수, 작업 분배, 실행 순서 등을 직접 관리**하는 방식이 일반적

#### 라운드 로빈(Round-Robin) => 줄을 서는 이미지
-> **스케줄링 전략** 중 하나
- OS에서 여러 스레드(or 프로세스)를 **짧은 시간 단위(타임 슬라이스)**로 **차례대로 실행**시키는 방식

**언제 등장할까?**
- 스레드가 많고 CPU는 하나
- 각 스레드가 조금씩 돌아가며 실행되는 방식
- **동시성 처리를 위한 OS 수준 스케줄링** 전략

**다른 스케줄링도 있지만, 일단 OS가 아니라 자바 공부니까 넘어가자**
(+ JVM이랑 OS가 알아서 지들이 스케줄링함)

## 동기화(Synchronization)

### 스레드 동기화?
- **멀티스레드 환경에서 두 개 이상의 스레드가 동시에 공유 자원에 접근할 경우,** 예기치 않은 결과(경쟁 상태, Race Condition)가 발생할 수 있음
- 스레드 동기화는 이것을 막는 것 <= **동시에 하나의 공유 자원에 접근할 수 없게!**
- 임계 영역(critical section): 공유 데이터가 사용되어 동기화가 필요한 부분
- 자바에서는 이 임계 영역에 `synchronized` 키워드를 사용하여 여러 스레드가 동시에 접근하는 것을 금지해서 동기화를 할 수 있음

### synchronized = 자물쇠를 거세요
- 자바는 동기화를 위해 `synchronized` 키워드 제공
- 동기화가 필요한 메서드 or 코드 블럭 앞에 사용하여 동기화 가능
- `synchronized`로 지정된 임계 영역은 한 스레드가 이 영역에 접근하여 사용할 때 lock이 걸림으로써 다른 스레드가 접근할 수 없게 됨
- 이후 해당 스레드가 이 영역의 코드를 다 실행한 후 벗어나게 되면 unlock 상태가 되어 그때서야 대기하고 있던 다른 스레드가 이 임계 영역에 접근하여 다시 lock을 걸고 사용할 수 있게 됨
- **lock은 해당 객체당 하나씩 존재하며, `synchronized`로 설정된 임게 영역은  lock 권한을 얻은 하나의 객체만 독점적으로 사용**

**1. `synchronized` 메서드**
```java
public synchronized void increment() {
    count++;
}
```
- 한 번에 **하나의 스레드만 접근 가능**
- 메서드 전체를 하나의 임계 구역으로 지정

**1. `synchronized` 블럭**
```java
public void increment() {
    synchronized(this) {
        count++;
    }
}
```
- 특정 **객체(this)**를 모니터로 지정 -> 해당 객체에 lock을 건다
- **부분적으로만 동기화**하고 싶을 때 사용

### 모니터(Monitor): 자바 동기화의 기반
- 자바 객체는 **모니터 락(monitor lock)**이라는 기능을 내장하고 있음
- `synchronized`는 객체의 모니터 락을 획득하고 반납하는 과정
- 하나의 락은 하나의 스레드만 소유 가능 -> 다른 스레드는 대기

#### 그러면 모니터가 뭘까?
- OS에서 등장한 개념으로,
- **공유 자원에 대한 접근을 하나의 스레드만 가능하게 제어하는 구조**
- 자바에서 이 개념을 그대로 구현함
- **모니터(Monitor) = 잠금(lock) + 조건 변수(condition variable)을 가진 동기화 도구**

#### 자바 객체 = 모니터 내장
- 자바에서는 **모든 객체가 하나의 모니터(lock)를 가지고 있음**
- 의미
	- `synchronized`를 쓰면, **그 객체의 모니터(lock)를 획득해야만** 코드 블럭에 들어갈 수 있음
    - 동시에 여러 스레드가 접근하려고 하면, **하나는 진입하고 나머지는 대기 상태**
    
> **결론**
> - 애초에 자바의 모든 객체가 내부에 모니터(=lock)을 가지고 있으니까,
> - `synchronized`만 붙이면 자바가 알아서 락을 걸어 주고 동기화를 보장해 주는 거임

**그러면 다른 언어는 락이 없어서 이런 방식으로 동기화를 안 하나?**
- 자바는 애초에 객체 지향이니까 객체 단위로 모니터를 가지고 있는 게 그럴듯함

> **Python: GIL(Gloval Interpreter Lock) 기반**
- **모든 스레드가 하나의 GIL을 공유**
- GIL로 인해 **동시에 하나의 스레드만 Python 바이트 코드를 실행**
- **멀티 스레드 환경에서 동기화가 항상 보장**
- 그러나 병렬성은 제한됨
- `threading.Lock()` 같은 **명시적 락 객체**를 사용해서 제어(객체 자체가 락을 내장하지는 않음)
- 객체마다 락이 있는 구조는 아니고 락을 별도로 생성하고 관리해야 함

> **C: 락 자체가 없음**
-C는 객체 지향 X -> 객체 단위의 락이라는 개념이 없음
- 스레드 라이브러리를 사용해서 락 구현
- 직접 락을 선언하고 수동으로 락/언락을 해 줘야 함

### 동기화의 부작용
- 성능 저하: 락을 사용하는 만큼 멀티 스레드의 이점(병렬성)이 줄어든다
- 데드락: 두 개 이상의 스레드가 서로 락을 기다리다가 영원히 대기

### 고급 동기화 기능(심화)
| 키워드/클래스               | 설명                              |
| --------------------- | ------------------------------- |
| `wait()` / `notify()` | 스레드 간 협업(조건 대기/신호 보내기)          |
| `ReentrantLock`       | 더 유연한 락 (공정성, 타임아웃 등 옵션)        |
| `volatile`            | 변수 자체의 **읽기/쓰기 동기화**, 원자성은 보장 X |
| `AtomicInteger` 등     | 원자 연산 클래스 (경량 락 없는 대체제)         |

### 자바의 synchronized VS 트랜잭션의 Isolation Level
> 약간 핀트를 벗어난 것 같기는 한데, DB 공부했을 때도 'Lock' 개념이 나왔던 게 떠올라서 살짝 정리

#### 자바 synchronized
- **Lock을 직접 거는 방식**
	- 이 블럭 안에 **한 번에 하나의 스레드만 진입 가능**
- 전부 다 막는 아주 강력한 락
	- `count++` 같은 아주 짧은 코드도 락이 걸림
- 세부적인 제어 불가능
- 개발자는 `synchronized` 키워드만 쓰고, **락 관리 전반은 JVM이 자동으로 처리**

#### DB의 Isolation Level
- **읽기와 쓰기의 격리 정도**를 정교하게 조절
	- 꼭 모든 트랜잭션에 자바처럼 전면적인 락을 걸 필요 없음
- ** DB에서는 "이 트랜잭션을 쓰기는 락을 걸고, 읽기는 허용할래" 같은 세밀한 제어 가능 **
- **락을 언제 걸고, 언제 해제하고, 누가 기다릴지** 전부 **DBMS 내부 Lock Manager가 처리**

| Isolation Level      | 허용되는 동시성 현상               | 읽기 가능 여부           | 쓰기 가능 여부 | 사용 예시     |
| -------------------- | ------------------------- | ------------------ | -------- | --------- |
| **READ UNCOMMITTED** | Dirty Read 허용             | O                  | O        | 거의 안 씀    |
| **READ COMMITTED**   | Non-repeatable Read 발생 가능 | 커밋된 데이터만 읽음        | O        | Oracle 기본 |
| **REPEATABLE READ**  | Phantom Read만 허용          | 같은 데이터를 반복 조회하면 동일 | O        | MySQL 기본  |
| **SERIALIZABLE**     | 완전 격리                     | 모든 트랜잭션을 직렬처럼 실행   | O        | 가장 엄격     |

#### 요약

| 항목     | 자바 멀티스레드 (`synchronized`)    | DB 트랜잭션 (`Isolation Level`)             |
| ------ | ---------------------------- | --------------------------------------- |
| 제어 대상  | **스레드 간 동시 실행 제어**           | **트랜잭션 간 데이터 충돌 제어**                    |
| 동기화 방법 | 코드/객체에 락을 직접 걸어 제어           | 트랜잭션이 읽고 쓰는 데이터에 대해 **자동으로 락 or 버전 제어** |
| 적용 방법  | 개발자가 명시적으로 `synchronized` 작성 | 격리 수준 설정 (ex: `READ COMMITTED`)         |
| 단위     | **자바 객체 (모니터 락)**            | **DB의 행(Row), 테이블 등**                   |
| 제어 방식  | 락을 걸면 **다른 스레드는 접근 불가**      | 읽기/쓰기의 종류와 시점에 따라 **세밀한 허용/차단 가능**      |

## 스레드 상태(Thread Lifecycle)

### 스레드 상태

![](https://velog.velcdn.com/images/emprimula/post/9e60e409-2c14-4839-93ea-27df6488bef2/image.png)


| 상태              | 설명                                         |
| --------------- | ------------------------------------------ |
| `NEW`           | 스레드 객체는 생성되었지만 `start()` 호출 전              |
| `RUNNABLE`      | 실행 가능 상태. CPU를 할당받으면 실행                    |
| `RUNNING`       | CPU를 할당받아 실제로 실행 중                         |
| `BLOCKED`       | lock(모니터)을 기다리는 상태                         |
| `WAITING`       | 다른 스레드의 작업을 무한정 기다리는 상태                    |
| `TIMED_WAITING` | 일정 시간 동안 대기하는 상태 (`sleep`, `join`, `wait`) |
| `TERMINATED`    | 스레드 실행이 종료된 상태 (`run()` 메서드 종료)            |

- `Thread.getState()`메서드로 현재 상태 확인 가능

### Thread VS Process Lifecycle

#### 공통점
- **OS 스케줄러가 CPU를 배정**해 줘야 `RUNNING` 상태로 진입 가능
- 둘 다 **BLOCKED 상태에서 깨어나면 READY로 돌아가고** 다시 CPU를 기다림
- **실행이 끝나면 TERMINATED로 종료**

#### 내부적으로는?
> 하나의 프로세스는 최소 하나의 스레드를 가지며,
> 스레드는 **해당 메모리 자원을 공유하면서 독립 실행 흐름**만 관리

- 프로세스는 **메모리 자원(코드, 힙, 스택, 데이터 영역)**을 가지고
- 스레드는 **해당 메모리 자원을 공유하면서 독립 실행 흐름**만 관리

#### 결론
- **스레드도 OS가 관리하는 "실행 단위"**
- 따라서 **프로세스와 거의 비슷한 상태 전이 구조**인 게 당연함
- 하지만 **스레드는 프로세스 내부 구성 요소**라는 점에서
	-> 메모리 자원 분리 유무, 스케줄링 주체 등에 차이가 있음


### 스레드 상태 제어

![](https://velog.velcdn.com/images/emprimula/post/e28e8390-09b8-44e9-b1f1-eaeb5aa2e55b/image.png)

| 메서드                   | 설명                                      |
| --------------------- | --------------------------------------- |
| `start()`             | NEW → RUNNABLE 상태로 전환하여 스레드 실행 시작       |
| `sleep(milliseconds)` | TIMED\_WAITING 상태로 전환. 지정 시간만큼 일시 정지    |
| `join()`              | 호출한 스레드가 종료될 때까지 현재 스레드 일시 정지 (WAITING) |
| `join(timeout)`       | 지정 시간까지만 기다림 (TIMED\_WAITING)           |
| `yield()`             | 현재 스레드가 CPU 양보. 다시 RUNNABLE 상태로 돌아감     |
| `interrupt()`         | 일시 정지 상태의 스레드 깨움. 인터럽트 발생시 예외 유도 가능     |
| `isAlive()`           | 스레드가 종료되지 않고 살아 있는지 여부 확인 (boolean)     |

    

## 스레드의 안전 종료(stop 플래그, interrupt())

### Deprecated: stop() = 강제 종료
- 스레드는 무한 루프 등을 실행 중일 수 있으므로, **안전하게 종료할 수 있는 방법** 필요
- 스레드는 기본적으로 `.run()` 메서드 실행을 마치면 자동으로 종료됨
	- 과거에는 스레드를 **강제 종료**시키기 위해 `stop()` 메서드로 사용했으나, 자원이 불안전하게 종료되는 문제로 `Deprecated`되었음
    	- `stop()`은 스레드가 **어떤 작업이든 바로 중단**시킴
        => 이러면 **자원을 반납하거나 종료 처리를 제대로 못하고** 프로그램이 비정상 상태에 빠질 수 있음
```java
Thread t = new Thread(() -> {
    while (true) {
        // 무한 루프
    }
});
t.start();
t.stop(); // 강제 종료
```
### stop 플래그 사용 = 외부 신호로 루프 종료
- 스레드 내에 boolean 변수를 두고, 외부에서 이 값을 변경해 루프를 빠져나가게 하는 방식
```java
class MyThread extends Thread {
    private boolean stop = false;

    public void run() {
        while (!stop) {
            System.out.println("작업 중...");
        }
        System.out.println("스레드 종료");
    }

    public void setStop(boolean stop) {
        this.stop = stop;
    }
}
```
```java
MyThread t = new MyThread();
t.start();

Thread.sleep(1000); // 1초 후 종료
t.setStop(true);    // 외부에서 stop 신호

```
### interrupt() 사용 = 일시 정지 중인 스레드를 깨워서 종료
- 스레드가 `sleep()`, `join()` 같은 메서드에서 **일시 정지 중일 때**, `interrupt()`를 호출하면 **InterruotedException이 발생**하면서 깨어나게 됨
- 그 예외를 catch해서 종료하는 구조
```java
class MyThread extends Thread {
    public void run() {
        try {
            while (true) {
                System.out.println("작업 중...");
                Thread.sleep(500); // 일시 정지 중
            }
        } catch (InterruptedException e) {
            System.out.println("인터럽트 발생. 스레드 종료.");
        }
    }
}
```
```java
MyThread t = new MyThread();
t.start();

Thread.sleep(1000);
t.interrupt(); // 인터럽트 신호 전달

```

## 데몬 스레드(Daemon Thread)
- **일반 스레드**가 모두 종료되면 자동으로 **종료되는 보조 스레드**
	- 이 부분을 제외하면 일반 스레드와 큰 차이 X
- 주로 **로그 기록, 자동 저장, 감시 등** 백그라운드 작업에 사용
- 스레드를 데몬으로 만드려면 데몬이 될 스레드의 `setDaemon(true)`를 호출
```java
Thread t = new Thread(() -> {
    while (true) {
        // 감시 작업
    }
});
t.setDaemon(true); // 데몬 스레드로 설정
t.start();

```
- 반드시 `start()` 호출 전에 `setDaemon(true)` 해야 함

## 스레드 풀(Thread Pool)
>- 병렬 작업 처리가 많아지면 => 스레드 갯수 폭증 => CPU가 바빠지며 메모리 사용량 증가
>- 따라서 애플리케이션의 성능의 급격한 저하 발생
>- 병렬 작업 증가로 인한 스레드 폭증을 막기 위해 => 스레드풀 사용

- 스레드 풀은 **작업을 수행할 수 있는 스레드를 미리 만들어 놓고**, 작업 요청이 들어오면 그 중 하나를 빌려서 사용한 다음, 다시 풀(pool)로 돌려 보내는 구조
	- **미리 만들어 놓은 스레드 집합**
    - **필요할 때 꺼내 쓰고 -> 작업이 완료되면 반납**
    - 스레드를 계속 재사용하므로 **성능과 자원 관리에 유리**
- Tomcat에 기본 내장
    
### 스레드 풀 동작 구조
```
[작업 큐] ← 작업 제출 (Runnable, Callable)
     ↓
[스레드 풀] ← 고정된 개수의 스레드가 대기 중
     ↓
 작업을 하나씩 꺼내어 스레드가 실행
     ↓
 실행 완료 → 스레드는 풀로 다시 돌아감 (재사용)
```
1. 애플리케이션은 작업(Runnable or Callable 객체)을 스레드 풀에 제출
2. 스레드 풀 내부의 **작업 큐(Queue)**에 작업 저장
3. 남는 스레드가 큐에서 작업을 가져와 실행
4. 작업이 끝나면 스레드는 풀에 **반환되어 재사용**

### 스레드 풀 생성
- 자바는 스레드 풀 생성, 사용을 위해 `java.util.concurrent` 패키지에서 `ExecutorService` 인터페이스와 `Executors` 클래스를 제공

#### 주요 생성 방식
| 방법                                    | 설명                                       |
| ------------------------------------- | ---------------------------------------- |
| `Executors.newFixedThreadPool(n)`     | **고정된 개수의 스레드**를 생성 (n개)                 |
| `Executors.newCachedThreadPool()`     | 요청이 많을 때 **필요한 만큼 스레드 생성**, 사용하지 않으면 제거됨 |
| `Executors.newSingleThreadExecutor()` | **하나의 스레드로 모든 작업 처리** (순차 처리 보장)         |

```java
ExecutorService executor = Executors.newFixedThreadPool(3);

```
### 작업 생성과 처리 요청
- 스레드 풀에 작업을 제출하려면 `Runnable` 혹은 `Callable` 인터페이스 구현체를 전달

#### Runnable(결과 없음)
```java
Runnable task = () -> {
    System.out.println("작업 실행: " + Thread.currentThread().getName());
};
executor.submit(task);
```

#### Callable(결과 반환 있음)
```java
Callable<String> task = () -> {
    return "결과 반환됨";
};
Future<String> future = executor.submit(task);
System.out.println(future.get()); // 결과 출력
```
- `submit()` 메서드는 작업을 큐에 넣고 스레드가 꺼내서 실행함

### 스레드 풀 종료
- 스레드 풀은 명시적으로 종료해야 함
- 그렇지 않으면 자원이 해재되지 않고 **계속 대기 상태**가 됨

#### 종료 방법
| 메서드             | 설명                                       |
| --------------- | ---------------------------------------- |
| `shutdown()`    | 더 이상 작업은 받지 않고, **기존 작업이 끝날 때까지 기다림**    |
| `shutdownNow()` | 모든 작업을 **즉시 종료 시도**, 처리 중이던 작업은 중단될 수 있음 |
```java
executor.shutdown(); // 정상 종료

```

### 전체 흐름 요약
```java
// 1. 생성
ExecutorService executor = Executors.newFixedThreadPool(3);

// 2. 작업 제출
for (int i = 0; i < 10; i++) {
    int taskId = i;
    executor.submit(() -> {
        System.out.println("Task " + taskId + " executed by " + Thread.currentThread().getName());
    });
}

// 3. 종료 요청
executor.shutdown();

```

# CH15 컬렉션 프레임워크
# CH16 람다식 ⭐⭐

## 람다식
- **익명 함수(Anoymous Funtion)**를 작성하기 위한 표현식
- **함수형 인터페이스**를 구현할 때 사용 <= 원래 함수적 프로그래밍 언어에서 쓰이던 개념으로 함수 지향 언어에 가까움
- 코드를 간결하게 하고, 컬렉션 처리/비동기 처리 등에서 가독성을 높임
- 병렬 처리, 이벤트 지향 프로그래밍에 적합
- java 8부터 지원
- 컬렉션 요소의 필터링, 매핑 등 작업을 쉽게 해 줌
- 매개변수를 지닌 코드 블럭으로, 런타임 시에 익명 구현 객체 생성

**기본 문법, 예시**
```
(매개변수) -> { 실행문 }

Runnable r = () -> System.out.println("Hello");

```

### 흐름을 이해해 보자

1. `Calculable` 인터페이스가 있다고 가정해 보자 = **역할**
```java
public interface Calculable {
	void calculate(int x, int y);
}
```
2. `Calculable` 인터페이스의 익명 구현 객체를 생성해 보자
```java
new Calculable(){
	@Override
    public void calculate(int x, int y) { ... 처리 내용 }
}
```
2. 이걸 람다식으로 표현한다면?
- 자바에서 람다식은 결국 **익명 내부 클래스(객체)로 변환**됨
- 그래서 `Calculable`처럼 **함수형 인터페이스**(매서드가 딱 하나인 인터페이스)에만 람다식을 쓸 수 있음 
```
(x, y) -> { 처리 내용 }
Calculable calc = (x, y) -> System.out.println(x + y);

```
3. `action()`에서 기능을 사용
```java
public void action(Calculable calculable) {
    int x = 10;
    int y = 4;
    calculable.calculate(x, y);
}

```
-`action()`은 `Calculable`을 매개변수로 받아서
- 내부적으로 계산을 실행해 줌
- **전략을 외부에서 주입**받는 구조

### 개념 정리
| 개념                   | 설명                            |
| -------------------- | ----------------------------- |
| 함수형 인터페이스            | 추상 메서드가 **1개뿐인 인터페이스**        |
| @FunctionalInterface | 해당 인터페이스가 함수형임을 **컴파일러에게 명시** |
| 람다식                  | 함수형 인터페이스를 **간결하게 구현**하는 표현법  |
| 익명 객체                | 이름 없이 즉석에서 만든 **인터페이스 구현체**   |

### 흐름
```
인터페이스(Calculable)
    ↳ 추상 메서드 1개
        ↳ 함수형 인터페이스
            ↳ 익명 객체로 구현
                ↳ 람다식으로 대체 가능!

```
## 매개변수가 없는 람다식
- 매개변수가 없으면 `()` 사용
- 실행할 내용만 `{}` 안에 작성
```java
Runnable r = () -> {
    System.out.println("매개변수 없음");
};
```
## 매개변수가 있는 람다식
- 매개변수가 1개면 `()` 생략 가능
- 2개 이상이면 `()`로 묶음
```java
Consumer<String> c = (s) -> {
    System.out.println(s);
};

BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;

```
## 리턴값이 있는 람다식
- 한 줄이면 `return` 생략 가능
- 여러 줄이면 `{}`와 `return`을 함께 사용
```java
Function<String, Integer> f1 = s -> s.length();

Function<Integer, String> f2 = n -> {
    if (n > 0) return "Positive";
    else return "Non-positive";
};

```
## 메서드 참조(Method Reference)
- 이미 존재하는 메서드를 **람다식 대신 참조**해서 사용
- `클래스이름::메서드이름` 형식
```
list.forEach(System.out::println);

Function<String, Integer> f = String::length;

```
## 생성자 참조(Constructor Reference)
- 람다식에서 객체 생성 코드를 간단히 표현
- `클래스이름:new` 형식
```
Supplier<List<String>> s1 = () -> new ArrayList<>();
Supplier<List<String>> s2 = ArrayList::new; // 위 코드와 동일

```

## 요약
| 항목      | 설명                   | 예시                              |
| ------- | -------------------- | ------------------------------- |
| 기본 람다식  | (매개변수) -> { 실행문 }    | `(x, y) -> x + y`               |
| 매개변수 없음 | `()` 사용              | `() -> System.out.println("x")` |
| 리턴값 있음  | 한 줄일 경우 return 생략 가능 | `x -> x.length()`               |
| 메서드 참조  | 이미 정의된 메서드 사용        | `System.out::println`           |
| 생성자 참조  | new 키워드를 생략하고 참조로 표현 | `ArrayList::new`                |

# CH17 스트림 요소 처리⭐⭐

## 스트림(Stream)
- 지금까지 컬렉션 및 배열에 저장된 요소를 반복 처리하기 위해 for문이나 iterator를 썼다
- 새로운 방법으로 java 8부터 도입된 **데이터 처리 흐름 API**
- 요소들이 하나씩 흘러가면서 처리된다는 의미 -> **lazy evaluation 지연 평가**
- 데이터를 직접 저장하지 않으며, 단지 데이터를 처리하는 파이프라인을 구축하는 역할
- 람다식을 활용하여 컬렉션 데이터를 선언형 방식으로 처리 가능
- 기존 반복문(for, while)을 대체하는 내부 반복자 방식

**장점**
- 배열과 컬렉션을 함수형으로 처리하여, 코드의 양을 줄이고 간결하게 표현 가능(람다)
- 간단한 병렬 처리 가능
- **병렬 처리**: 하나의 작업을 둘 이상의 작업으로 잘게 나눠 동시에 진행하는 것

** Stream VS Iterator**
- 내부 반복자 사용 => 처리 속도가 빠르고 병렬 처리에 효율적
- 람다식으로 다양한 요소 처리 동의 가능
- 중간 처리와 최종 처리를 수행하도록 파이프 라인 형성 가능

### 스트림 파이프라인의 구조
1. Source(데이터 소스)
	- 배열, 컬렉션, 파일 등
2. Intermediate Operations(중간 연산자)
	- filter, map, sorted, distinct 등
    - 데이터의 흐름을 변경하지만 즉시 실행되지 않음(lazy)
3. Terminal Operations(최종 연산자)
	- collect, forEach, reduce, count 등
    - 파이프라인을 실행해서 실제 결과 도출

### Stream의 지연 처리(Lazy Evaluation)
- 중간 연산자는 **게으르게 동작**함
- 파이프라인만 구성되고, **최종 연산자 호출 시에만 실제 데이터 흐름 실행**
- 이것 때문에 불필요한 계산을 줄이고 **최적화** 가능

### 람다식과 관계
- 스트림 API는 내부적으로 **함수 인터페이스** 기반으로 작동
- `map()`, `filter()` 등의 중간 연산자에 람다식을 전달하여 사용

## 내부 반복자

### 외부 반복자 VS 내부 반복자
- 외부 반복자(external iterator): 개발자가 코드로 직접 컬렉션 요소를 반복해서 가져오는 코트 패턴
	- for, iterator, while 등
    - 순차적 처리 방법
- 내부 반복자(internal iterator): 컬렉션 내부에서 요소들을 반복시키고, 개발자는 요소당 처리해야 할 코드만 제공하는 코드 패턴
	- 요소들을 분배시켜 병렬 작업 처리
- **스트림은 내부 반복자 사용**

![](https://velog.velcdn.com/images/emprimula/post/407f6202-2366-4fac-9d76-886fa0bdf608/image.png)
- 내부 반복자는 처리 코드만 제공 => 처리를 위임하여 병렬 처리가 컬렉션 내부에서 일어나게 만들 수 있음
- 외부 반복자는 요소를 가져오는 것부터 처리하는 것까지 싹 개발자가 작성해야 함

### 내부 반복자의 장점
- 개발자는 요소 처리 코드에만 집중 가능
- 내부 반복자는 반복 순서 변경 or 멀티 코어 CPU 활용을 위해 요소들을 분배시켜 **병렬 작업** 가능
	- 처리할 것들을 부분으로 나눠 병렬 작업을 한 다음 다시 합치는 방식
    
## 중간 처리와 최종 처리
- 스트림이 아래의 그림처럼 연결된 것이 **스트림 파이프라인**
![](https://velog.velcdn.com/images/emprimula/post/f73b7e14-c264-4d06-ae22-69c5c665d967/image.png)
- **중간 처리(Inermediate Operation)**: 스트림 파이프라인에 있는 스트림들은 최종 처리를 위해 **필터링, 매핑**하는 작업 수행
	- 매핑(mapXxx), 필터링(filter, distinct), 정렬(sorted), 반복(peek)
- **최종 처리(Terminal Operation)**: 중간 처리에서 정제된 요소들을 반복하거나 집계 작업 수행
	- 반복(forEach), 카운팅(count), 평균(average), 리듀스(reduce)

### 스트림의 흐름

#### 1. 생성: 스트림 인스턴스 생성
- 배열/컬렉션/숫자/파일
- 병렬 스트림
#### 2. 가공하기: 필터링 및 매핑을 해서 결과를 만드는 중간 과정
- 필터링, 매핑, 정렬, 루핑(peek())
#### 3. 결과 만들기: 최종적으로 결과를 만들어내는 작업
- 루핑(forEach()), 매칭, 집계
#### 순서: 전체 -> 매핑 -> 필터링1 -> 필터링2 -> 결과 만들기 -> 결과물

## 리소스로부터 스트림 얻기 <= 생성
- 보통 배열과 컬렉션을 이용해 스트림을 만들지만, 다른 다양한 방법으로 스트림 만들 수 있음
- `java.util.stream` 패키지에 스트림 인터페이스 존재
- `BaseStream` 인터페이스를 부모로 한 자식 클래스:
	- `Stream`, `IntStream`, `LongStream`, `DoubleStream`
    - `Stream`: 객체 요소를 처리하는 스트림
    - `IntStream`, `LongStream`, `DoubleStream`: 각자 기본 타입인 int, long, double 요소를 처리하는 스트림
    
### 컬렉션으로부터 스트림 얻기
- 컬렉션 타입(Collection, List, Set)의 경우,
- 인터페이스에 추가된 디폴트 메서드인 `stream()` 메서드를 이용해 스트림을 만들거나,
- 병렬 처리 스트림을 생성하는 `parallelStream()` 메서드를 이용해서 스트림을 만들 수 있음

### 배열로부터 스트림 얻기
- 배열의 경우 `Arrays.stream()` 메서드를 사용해 스트림을 생성할 수 있음

### 숫자 범위로부터 스트림 얻기
- IntStream이나 LongStream의 정적 메서드인 `range()`와 `rangeClosed()`  메서드를 이용하면 특정 범위의 정수 스트림을 얻을 수 있음

### 파일로부터 스트림 얻기
- java.nio.file.Files의 `lines()` 메서드를 이용하면 텍스트 파일의 행 단위 스트림을 얻을 수 있음

## 요소 걸러내기 <= 가공: 필터링
- 필터링(filtering): 요소를 걸러내는 중간 처리 기능
- 필터링 메서드: `distinct()`, `filter()`
	- `distinct()` 메서드: 요소의 중복 제거
    	-`equals()`의 리턴값이 true -> 동일한 요소로 판단
    - `filter()` 메서드: 매개값으로 주어진 `Predicate`가 true를 리턴하는 요소만 필터링
    - 인자로 받는 `Predicate`는 `boolean`을 리턴하는 함수형 인터페이스로 평가식이 들어가게 됨
    	- 종류: `Predicate<T>`, `IntPredicate`, `LongPredicate`, `DoublePredicate`
       - 모든 `Predicate`는 매개값을 조사한 후 boolean을 리턴하는 `test()` 메서드를 가짐
```java
//Predicate<T>의 람다식
  T -> { .... return true}
또는
T -> true; //return 문만 있을 경우 중괄호와 return 키워드 생략 가능
```

## 요소 반환 <= 가공: 매핑
- 매핑(mapping): 스트림의 요소를 다른 요소로 변환하는 중간 처리 기능
- 이때 값을 반환하기 위한 람다를 인자로 받음

### 종류
- `mapXxx()` 메서드: 요소를 다른 요소로 변환한 새로운 스트림 리턴
- `flatmapXxx()` 메서드: 하나의 요소를 복수 개의 요소들로 변환한 새로운 스트림 리턴
- `asXxxStream()`
- `boxed()`

## 요소 정렬 <= 가공: 정렬
- 정렬(Sorting): 요소를 오름차순 or 내림차순으로 정렬하는 중간 처리 기능

### Comparable 구현 객체의 정렬
- 스트림의 요소가 객체일 경우 객체가 Comparable을 구현하고 있어야만 `sorted()` 메서드를 사용하여 정렬할 수 있음
	- 내림차순 정렬: `Comparaor.reverseOrder()` 메서드가 리턴하는 Comparator를 매개값으로 제공하면 됨

### Comparator을 이용한 정렬
- 요소 객체가 Comparable을 구현하고 있지 않다면, 비교자를 제공하여 요소를 정렬시킬 수 있음
	- 비교자는 Comparator 인터페이스를 구현한 객체
    - 아래처럼 람다식으로 표현 가능    
```java
sorted((o1, o2) -> {...})
```

## 요소를 하나씩 처리 <= 루핑(가공, 결과)
- 루핑(Looping): 스트림에서 요소를 하나씩 반복해 가져와서 처리
- `peek()`와 `forEach()`가 해당
- `peek()`, `forEach()` 둘 다 **동일하게 요소 루핑**
- `peek()`: **중간 처리 메서드**
- `forEach()`: *+최종 처리 메서드**

## 요소 조건 만족 여부 <= 결과: 매칭
- 매칭(Matching): 요소들이 특정 조건에 만족하는지 여부를 조사하는 최종 처리 기능
- `anyMatch()`:  하나라도 조건을 만족하는 요소가 있는지
- `allMatch()`: 모두 조건을 만족하는지
- `noneMatch()`: 모두 조건을 만족하지 않는지

## 기본 요소 집계 <= 결과
- 집계(Aggregate): 요소들을 처리해서 카운팅, 합계, 평균값, 최대값, 최소값 등과 같이 하나의 값으로 산출하는 것
- `sum()`
- `count()`
- `average()`: `Optional` 반환
- `max()`: `Optional` 반환
- `min()`: `Optional` 반환
- 스트림이 제공하는 최종 처리 메서드는 최종값을 저장하는 객체로 `get()`, `getAsDouble()`, `getAsInt()`, `getAsLong()` 메서드를 호출하여 최종값을 저장할 수 있음

### Optional 클래스: null 처리용
- 집계 값 존재 X: 디폴트 값 설정 가능
- 집계 값 처리하는 `Consumer` 등록 가능

#### 메서드
- `isPresent()`: 값 저장 여부를 `boolean`로 반환
- `orElse(T)`: 값이 저장되지 않은 경우 디폴트 값 지정 가능
- `ifPresent(Consumer)`: 값이 저장된 경우 `Consumer`를 이용해 값을 처리할 수 있음

## 커스텀 집계: reduce() <= 결과
- 기본 집계 메서드 이외에 원하는 집계 방식이 있다면 `reduce()`를 통해 구현 가능

## 요소 수집: collect() <= 결과
- 스트림의 결과를 새로운 컬렉션으로 만들 때 사용
	-`R collect(Colletor<T, A, R> collector`
- 이 형태가 `collect()` 메서드의 기본형
- `T`: 타입
- `A`: `Accumulator`
- `R`: 결과의 타ㅇ;ㅂ

### Collectors 지원 메서드
- `Collectors` 클래스에서 `collect()`를 편리하게 쓸 수 있게 정적 메서드 지원

## 요소 병렬 처리
- 요소 병렬 처리(Parallel Operation): 멀티 코어 CPU 환경에서 전체 요소를 분할하여 각각의 코어가 병렬적으로 처리하는 것
- 목적: 작업 처리 시간 줄이기
- 자바에서는 요소 병렬 처리를 위해 병렬 스트림(Parallel Stream)을 제공

**스트림은 데이터의 병렬성을 이용한 병렬 처리를 한다**

### 병렬 처리의 종류
- 멀티 스레드에는 **동시성(Concurrency)와 병렬성(Parallelisem)** 존재
	- 싱글 코어: 멀티 스레드를 이용해도 ***동시성**을 이용한 처리를 번갈아 처리 => cpu 스케줄링
    - 멀티 코어: **병렬성**을 이용해 동시에 작업 처리
    - 동시성은 워낙 빠르게 번갈아 작업을 해서 동시에 처리하는 것**처럼** 보이게 하는 것, 병렬성이 동시성보다 더 좋은 성능을 가짐
    
- **병렬 처리**라는 카테고리 안에 **데이터 병렬성(Data Parallelism)**과 **작업 병렬성(Task Parallelism)**이 존재

### 데이터 병렬성
- 전체 데이터를 쪼개서 서브 데이터로 만들고, 서브 데이터를 병렬 처리해서 작업을 빨리 끝내는 것
- 자바 8에서 지원하는 **병렬 스트림** => **데이터 병렬성** 구현한 것

### 작업 병렬성
- 서로 다른 작업을 병럴 처리하는 것
- 대표적인 예시로 웹 서버
	- 웹 서버는 각각의 브라우저에서 요청한 내용을 개별 스레드에서 병렬로 처리
    
### 스트림으로 병렬 처리가 가능한 이유
> **내부 반복자 + 병렬 분할 구조 + 람다식 기반의 독립 연산**

- 내부 반복자는 반복 순서를 JVM에게 위임
- 병렬 스트림은 요소를 분할하여 각각의 스레드에서 처리
- 람다는 상태를 공유하지 않도록 설계되어 스레드 충돌 적음

### 포크조인 프레임워크(ForkJoin Framework)
- 병렬 스트림은 요소를 병렬 처리하기 위해 포크조인 프레임워크(ForkJoin Framework) 사용
 - `포크(Fork)` 단계: 전체 요소들을 서브 요소셋으로 분할 -> 각각의 서브 요소셋을 멀티 코어에서 병렬 처리
 - `조인(Join)` 단계: 서브 결과를 결합해서 최종 결과 도출
![](https://velog.velcdn.com/images/emprimula/post/361520c1-b70f-41f6-a03f-3c5ff5e9c2b1/image.png)


### 병렬 스트림 사용
- `parallel()`메서드와 `parallelStream()` 메서드를 사용해 병렬 스트림을 쉽게 생성
 - `parallel()`: 기존 스트림을 병렬 처리 스트림으로 변환
 - `parallelStream()`: 컬렉션으로부터 병렬 스르림을 바로 리턴

### 병렬 처리 성능
- 병렬 처리에 영향을 미치는 요인을 따져 봐야 실행 성능을 판단할 수 있음
**1. 요소의 수와 요소당 처리 시간**: 전체 요소의 수가 적고 요소당 처리 시간이 짧으면 일반 스트림이 병렬 스트림보다 빠를 수 있음
**2. 스트림 소스의 종류**: ArrayList, 배열과 달리 HashSet, TreeSet, LinkedList는 요소 분리가 쉽지 않아 병렬 처리가 늦음
**3. 코어의 수**: CPU 코어의 수가 많으면 많을수록 병렬 스트림의 성능이 좋음

# CH18 데이터 입출력(I0)
# CH19 네트워크 입출력 ⭐

## 네트워크 기초
- 네트워크: 여러 컴퓨터드을 통신 회선으로 연결한 것
	- LAN: 가정, 회사, 건물, 특정 영역에 존재하는 컴퓨터들을 연결한 것
    - WAN: LAN을 연결한, 우리가 흔히 말하는 인터넷
    
### 서버와 클라이언트
- 서버: 서비스를 제공하는 프로그램
- 클라이언트: 서비스를 요청하는 프로그램
![](https://velog.velcdn.com/images/emprimula/post/a125f828-4353-4c39-82d8-27f357a02998/image.png)

### IP 주소
- 네트워크 어댑터(LAN)마다 할당되는 컴퓨터의 고유한 주소
- 네트워크 어댑터에 어떤 IP 주소가 부여되어 있는지 확인 -> `ifconfig` 명령어 사용
- 연결할 컴퓨터의 IP 주소를 알아야 프로그램들이 통신 가능
- 프로그램은 DNS을 이용해서 컴퓨터의 IP 주소를 검색

### Port 번호
- 운영체제가 관리하는 서버 프로그램의 연결 번호
- 여러 프로그램이 동시 실행 => 컴퓨터 내부에서 실행하는 서버를 선택하기 위해 Port번호 필요
- 클라이언트도 서버에서 보낸 정보를 받기 위해 운영체제가 자동으로 부여하는 번호를 Port 번호로 사용

### 통신
- 두 대 이상의 컴퓨터가 데이터를 주고받는 것
- ex) 클라이언트(웹 브라우저) <-> 서버(웹 서버)

### 통신 방식

#### Socket(소켓) = 통신을 위한 연결 통로
- 자바에서는 네트워크 통신을 하기 위해 소켓을 열어야 함
- 소켓(Socket): 네트워크 통신을 위한 **양 끝단(EndPoint)**를 의미
- 자바에서는 `java.net` 패키지의 `Socket` 클래스와 `ServerSocket` 클래스를 통해 소켓 프로그래밍 가능

### IP 주소 + 포트 번호 = 소트 통신 기본 단위
- IP 주소: 상태 컴퓨터 식별
- 포트 번호: 그 컴퓨터 내의 어떤 서비스(프로그램)으로 보낼 것인지 식별

### 통신 프로토콜
- 프로토콜(Protocol): 네트워크 통신에서 데이터를 주고받는 **규칙, 약속**

- TCP(Transmission Control Protocol):
	- 연결 기반, 안정적, 신뢰성 보장
    - 파일 전송, HTTP
- UDP(User Datagram Protocol)"
	- 연결 없음, 빠름, 신뢰성 낮음
    - 실시간 스트리밍, 게임
    
## IP 주소 얻기
- 자바에서 특정 호스트(or 내 컴퓨터)의 IP 주소를 알아내는 방법
	1. `InetAddress` 이용
	2. 도메인 이름으로 DNS에서 검색한 후 IP주소를 가져오기
- 호스트 이름(Host Name): (www.naver.com) 같은 기억하기 쉬운 이름을 호스트 이름 or 도메인 네임이라고 함
- 실제 네트워크 통신은 IP 주소를 통해 이루어지므로, 호스트 이름은 DNS(Domain Name System)을 통해 IP 주소로 변환됨

### InetAddress 클래스
- IP 주소를 객체로 다루게 해 주는 클래스
-`java.net.InetAddress` 클래스 사용
- `InetAddress.getLocalHost()`: 현재 자신 컴퓨터 IP 주소 얻을 수 있음
- `InetAddress.getByName("호스트네임")`: 특정 호스트 이름에 해당하는 IP 주소 얻을 수 있음
- `InetAddress.getAllByName("호스트네임")`: 하나의 호스트 이름이 여러 IP 주소를 가질 경우, 모든 IP 주소를 배열로 얻을 수 있음
- `getHostName()`: IP 주소 객체로부터 호스트 이름을 얻음
- `getHostAddress()`: IP 주소 객체로부터 IP 주소(문자열)을 얻음

```java
import java.net.InetAddress;
import java.net.UnknownHostException;

public class IPAddressExample {
    public static void main(String[] args) {
        try {
            // 자신의 로컬 IP 주소 얻기
            InetAddress local = InetAddress.getLocalHost();
            System.out.println("내 컴퓨터 IP 주소: " + local.getHostAddress());

            // 특정 도메인의 IP 주소 얻기
            InetAddress naver = InetAddress.getByName("www.naver.com");
            System.out.println("네이버 IP 주소: " + naver.getHostAddress());

            // 구글의 모든 IP 주소 얻기
            InetAddress[] google = InetAddress.getAllByName("www.google.com");
            System.out.println("구글 IP 주소들:");
            for (InetAddress ip : google) {
                System.out.println("  " + ip.getHostAddress());
            }

        } catch (UnknownHostException e) {
            System.err.println("호스트를 찾을 수 없습니다: " + e.getMessage());
        }
    }
}
```

## TCP 네트워킹(Transmission Control Protocol) = 전송 제어 프로토콜
- TCP는 네트워크 통신에서 가장 널리 사용되는 프로토콜 중 하나
- 데이터를 정확하고 안정적으로 정달하는 것에 중점을 둠
- **연결 기반 프로토콜**이기 때문에 **서버가 먼저 열려 있어야 함**
- 상대방이 데이터를 전달 받았는지 관심 있음 => 신뢰할 수 있음
	-> 상대방이 데이터를 받지 못했다면 재전송
- 스트림 방식으로 데이터를 주고받음
- 자바에서 `Socket`(클라이언트 소켓), `ServerSOcket`(서버 소켓) 사용

### TCP의 특징
- 연결 지향(Connection-Oriented): 연결을 맺으며, 데이터 전송이 끝날 때까지 유지
- 신뢰성(Reliability)
- 흐름 제어(Flow Control: 데이터를 주고받는 양쪽의 처리 속도를 맞춰 데이터가 넘치거나 부족하지 않게 조절
- 혼잡 제어(Congestion Control): 네트워크가 혼잡할 떄 전송량을 줄여 네트워크 과부하를 막음

### TCP 기본 동작 흐름(연결성 동작 흐름)
- 서버:
	- `ServerSocket`으로 포트 열기
    - `accept()` 호출 -> 클라이언트 접속 대기
    - `Socket`을 얻고 통신 시작
- 클라이언트:
	- `Socket`으로 서버에 접속
    - `OutputStream`과 `InputStream`으로 메시지 송수신
 
 **예제 흐름**
 
```
// 서버
ServerSocket serverSocket = new ServerSocket(5000);
Socket socket = serverSocket.accept();  // 클라이언트 연결 대기
// 클라이언트
Socket socket = new Socket("localhost", 5000);
```

### TCP의 3-Way Handshaking
- TCP은 연결 지향 프로토콜이므로
- 데이터를 주고받기 전 **안정적인 연결 먼저 성립**해야 함
- 이 안정적인 연결 = **세션**
- 세션을 수립하는 절차 = **3-Way Handshaking**
- 이 과정을 통해 클라이언트와 서버는 통신에 필요한 초기 제어 정보(시퀀스 번호, ACK 번호 등)을 교환하고, 서로 통신할 준비가 되었음을 확인

#### 3-Way Handshaking 과정 

![](https://velog.velcdn.com/images/emprimula/post/3dd4ce95-3cdb-4cc7-a445-11019b9654ac/image.png)

| 단계  | 송신자(Client) | 수신자(Server)    | 설명                      |
| --- | ----------- | -------------- | ----------------------- |
| 1단계 | `SYN` 보냄    |                | 연결 요청 (시작 시퀀스 번호 포함)    |
| 2단계 |             | `SYN + ACK` 응답 | 수신자는 SYN 수락 + 자신도 연결 요청 |
| 3단계 | `ACK` 응답    |                | 서버의 요청에 응답 → 연결 완료      |

1. **클라이언트 -> 서버: SYN(Synchronize Sequence Numbers)**
- 클라이언트가 서버에게 연결을 요청하는 패킷
2. **서버 -> 클라이언트: SYN + ACK(Synchronize Sequence Numbers + Acknowledgement)**
- 서버는 클라이언트의 연결 요청을 수락한다는 응답과 함께, 자기도 클라이언트에게 연결을 요청하는 패킷을 보냄
3. **클라이언트 -> 서버: ACK(Acknowledgement)**
- 클라이언트는 서버의 SYN+ACK 응답을 잘 받았다는 최종 확인 패킷을 보냄

**예시 흐름(숫자는 시퀀스 번호)**
```
[Client] → SYN(seq=100) → [Server]
[Client] ← SYN(seq=200), ACK(ack=101) ← [Server]
[Client] → ACK(ack=201) → [Server]

```
### 자바에서는 왜 이게 생략되는가?
- 자바의 `Socket` 클래스는 이 과정을 내부에서 **추상화**하고, **자동으로 처리**해 주기 때문
```java
Socket socket = new Socket("localhost", 5000);
```
- 이 코드가 포함하는 것
	- DNS 조회 -> IP 확인
    - 포트 연결
    - 3-Way Handshaking
    - 세션 생성
- 따라서 내가 **직접 TCP 연결 수립 과정을 코드로 볼 수 없음**

### TCP의 4-Way Handshaking(보류)
- 연결을 해제(Connection Termination)하는 과정으로, FIN 플래그를 이용
- `FIN`(finish): 세션을 종료시킬 때 사용되며, 더 이상 보낼 데이터가 없음을 의미

## UDP 네트워킹(User Datagram Protocol)
- TCP와 달리 **비연결 지향** 프로토콜
- 연결이 없기 때문에 **서버 없이도 바로 전송 가능**
- 제대로 도착했는지 관심 X -> 데이터 전송에 신뢰성이 없음
- 데이터를 순서대로 보낸다는 보장도 없음
- 도착에 대한 확인 과정이 없어 TCP보다 전송 빠름
- 자바에서 `DatagramSocket`(소켓), `DatagramPacket`(패킷) 사용

### UDP의 특징
- 비연결 지향(Connectionless): 통신 시작 전 연결을 맺지 않고, 데이터를 보낼 때마다 목적지 주소를 포함하여 보냄
- 비신뢰성(Unreliability): 데이터가 전달되었는지, 순서가 바뀌지 않았는데 관심이 없음
- 빠른 전송: 연결 설정 과정이 없으므로
- 데이터그램(Datagram): UDP는 데이터를 **데이터그램**이라는 작은 패킷 단위로 전송

### UDP 기본 동작 흐름(비연결성 전송 흐름)
- 보내는 측(Sender):
	1. `DatagramSocket` 생성(보내는 소켓)
    2. 데이터 바이트 배열 준비
    3. `DatagramPacket`으로 보낼 데이터와 목적지 IP 포트 지정
    4. `DatagramSocket.send()`로 패킷 전송
    	-> 전송 후 바로 끝, 수신 여부 알 수 없음
- 받는 측(Receiver):
	1. 특정 포트로 `DatagramSocket` 생성(받는 소켓
    2. 바이트 배열 버퍼 준비
    3. `DatagramPacket` 객체 준비
    4. `DatagramSocket.receive()` 호출 -> 데이터 올 때까지 블로킹
    5. 받은 데이터 꺼내서 처리
  
    
 #### 흐름도
 
```
[클라이언트]                                  [서버]
DatagramSocket                               DatagramSocket(port)

↓                                            ↓
DatagramPacket 생성                           receive() 블로킹 대기

↓                                            ↓
send() 호출 ───────────────→ 패킷 도착 (IP, Port)

                                             ↓
                                        Packet 처리

```

## 서버의 동시 요청 처리

### 문제점
- 기본적인 서버는 클라이언트 하나당 하나의 스레드를 순차 처리
- if 여러 클라이언트가 동시에 접속하면? **대기 시간 발생**
- 수많은 클라이언트의 요청을 동시에 처리해야 한다면?

### 해결책 : 멀티 스레드
- `accept()`와 `receive()`를 제외한 요청 처리 코드를 별도의 스레드에서 작업하는 것이 좋음

1. 각 클라이언트 요청을 별도의 스레드에서 처리 => 한 요청이 지연되어도 다른 요청의 처리를 막지 않고 동시에 진행하도록 함
	- 서버의 응답성을 높히는 핵심 전략
2. 하지만 요청마다 스레드를 무한정 생성하는 것은 **성능 저하(오버헤드) 유발**
	- 스레드 생성/삭제 비용, 컨텍스트 스위칭 등의 문제
3. **스레드 풀**: 멀티스레딩의 비효율성을 해서하고 성능을 최적화하기 위한 **관리 기법**

### 서버의 동시 요청 처리 문제 해결 방법
1. 문제 인식: 단일 스레드 서버는 클라이언트 요청이 많아지면 응답 지연 or 먹통되는 문제 발생
2. 1차 해결책: 멀티스레드(동시성 확보)
	- CPU가 스레드들을 번갈아 실행하여 동시성을 확보하거나, 멀티 코어 CPU가 실제로 병렬로 실행하면서 처리 속도를 높이고 동시성도 향상시킴
    - **이게 기본적인 동시 요청 처리의 아이디어**
3. 1차 해결책의 문제점(멀티 스레드 남용의 문제점)
	- 멀티 스레딩 자체는 해결책
    - **무분별한 스레드 생성이 새로운 성능 문제(자원 관리의 비효율성) 야기**
4. 2차 해결책: 스레드 풀(멀티 스레드의 효율적 관리)
	- **멀티 스레딩의 장점을 유지하면서, 그로 인한 부작용 방지**
    
![](https://velog.velcdn.com/images/emprimula/post/0f1c7066-4ab4-4ef7-9ff8-706bee8178dd/image.png)


## JSON 데이터 형식
- 네트워크로 전달하는 데이터가 복잡할수록 구조화된 형식 필요
- 네트워크 통신에서 가장 많이 사용되는 데이터 형식이 JSON

### JSON(JavaScript Object Notation)
- 키-값 쌍 구조의 데이터 포맷
- 자바에서는 `org.json` 또는 `com.fasterxml.jackson` 같은 라이브러리를 사용
```json
{
  "name": "홍길동",
  "age": 30,
  "isStudent": false,
  "hobbies": ["독서", "여행", "코딩"],
  "address": {
    "city": "서울",
    "zipCode": "12345"
  },
  "courses": [
    {
      "title": "자바 프로그래밍",
      "credits": 3
    },
    {
      "title": "스프링 웹 개발",
      "credits": 4
    }
  ]
}
```

### 특징:
- 경량(Lightweight): XML보다 가볍고 단순해 전송 및 파싱 속도가 빠름
- 인간 친화적(Human-readable): 텍스트 기반이라 인간도 쉽게 이해
- 구조화된 데이터
- 언어 독립적

### 기본 구조:
- 객체(Object):`{ "키": 값, "키": 값, ... }`중괄호로 표현하며, 키-값 쌍의 집합
	- 키는 항상 문자열, 값음 문자열/숫자/불리언/null/배열/또다른 객체 가능
- 배열(Array): `[값1, 값2, 값3, ...]` 대괄호로 표현하며, 값들의 목록
	- 값의 타입은 자유로움

## TCP 채팅 프로그램
- 앞에서 배운 TCP, 스레드, 스트림을 활용해 **양방향 통신 프로그램(채팅)** 구현 가능

# CH20 데이터베이스 입출력 ⭐

## JDBC 개요

### 자바에서 DB를 왜 쓸까?
- 애플리케이션은 데이터를 메모리(RAM, 휘발성)에만 두지 않음
	-> **지속성(Persistence)** 필요
    - DB로 저장한다 => **궁극적으로 보조 기억 저장 장치에 데이터를 영구 저장하겠다**
    - 아이클라우드나 게임 서버 데이터 같은 건?
    	-> 이것도 결국 **물리적 저장 장치**에 저장되어 있음
- 자바로 개발한 백엔드 시스템은 보통 DB와 연결 -> DB 연동 기술 필수

### JDBC(Java Database Connectivity)

![](https://velog.velcdn.com/images/emprimula/post/d5863811-ad50-4df3-a8ca-13d61911b9e9/image.png)

- 자바가 다양한 종류의 데이터베이스(MySQL, Oracle, PostgreSQL 등)와 통신하기 위한 **자바 표준 API**
- 데이터베이스와 연결하여 데이터 입출력 작업을 해 주는 역할
- JDBC 인터페이스를 통해 실제로 DB와 작업하는 것은 JDBC Driver, 
- JDBC Driver: JDBC 인터페이스를 구현한 것

![](https://velog.velcdn.com/images/emprimula/post/16399b90-3784-45d1-bf01-bedee4eccdbb/image.png)

#### DriverManager
- JDBC Driver를 관리하며 DB와 연결해서 `Connection` 구현 객체 생성
- if MySQL을 쓴다면 -> 여기에서 JDBC Driver는 MySQL
- `DriverManager` -> `Connection` 구현체 생성

#### Connection
- `Connection` 인터페이스는 `Statement`, `PreparedStatement`, `CallableStatement` 구현 객체를 생성하며, 트랜잭션 처리와 DB 연결을 끊을 때 사용
- `Connection` 구현체 -> `Statement` 계열 객체 생성

#### Statement
- `Statement` 인터페이스는 DDL과 DML문 실행할 때 사용
- 주로 변경되지 않는 정적 SQL문 실행할 때 사용

#### PreparedStatement
- `PreparedStatement`는 `Statement`와 동일하게 DDL, DML문 실행할 때 사용
- 하지만 `PreparedStatement`는 매개변수화된 SQL문을 쓸 수 있어서 편리성, 보안성이 좋음

#### CallableStatement
- DB에 저장되어 있는 프로시저와 함수를 호출할 때 사용

#### ResultSet
- DB에서 가져온 데이터를 읽을 때 사용

## DBMS 설치
- DBMS = 데이터를 저장/수정/삭제/검색하는 시스템
- 로컬 설치 or Docker로도 가능
- MySQL, MariaDB, PostgreSQL, Oracle 등 설치

## 그렇다면 무슨 기준으로 DBMS를 선택할까?

### SQL(RDBMS, 관계형 데이터베이스): MySQL, PostgreSQL, Oracle

| 항목        | 설명                                       |
| --------- | ---------------------------------------- |
| 📌 데이터 구조 | **정형화된 테이블(스키마)** 기반 구조. 컬럼과 타입 사전 정의 필요 |
| 📌 정합성    | **ACID 트랜잭션 보장** → 일관성과 안정성 강함           |
| 📌 쿼리 방식  | SQL 표준 기반: JOIN, GROUP BY 등 복잡한 쿼리 가능    |
| 📌 수직 확장  | 성능 확장을 위해 주로 **Scale-Up** (좋은 서버로 갈아끼움)  |
| 📌 사용 사례  | 대부분의 기업 서비스: 쇼핑몰, 금융, ERP, 웹 서비스 등       |
| ✅ 장점      | 데이터 무결성, 트랜잭션 안정성, 복잡한 질의 처리에 강함         |
| ❌ 단점      | 유연성 부족 (스키마 변경 어려움), 분산 처리 어려움           |

-> Spring JPA/Hibernate는 RDB에 맞춘 ORM이라 **SQL 기반 RDBMS와 궁합이 좋음**

### NoSQL: MongoDB(문서형), Redis(키-값형), Cassandra(열지향)

| 항목        | 설명                                                |
| --------- | ------------------------------------------------- |
| 📌 데이터 구조 | **비정형 데이터** 지원. JSON, BSON 형태로 유연한 스키마            |
| 📌 정합성    | 대부분 **BASE 모델** (Eventually Consistent) → 일관성 느슨함 |
| 📌 쿼리 방식  | SQL 아님. 각 DB마다 고유의 질의 방식 사용                       |
| 📌 수평 확장  | 성능 확장을 위해 주로 **Scale-Out** (서버 여러 개로 분산)          |
| 📌 사용 사례  | SNS, 실시간 로그 수집, 캐시, IoT, 분산 데이터 저장 등              |
| ✅ 장점      | 스키마 자유로움, 빠른 속도, 대용량 분산 처리에 강함                    |
| ❌ 단점      | 복잡한 질의 어려움, 정합성 약함, 트랜잭션 제약 존재                    |

-> 대용량 로그, 이벤트 저장, 캐시 서버 등에 Redis, MongoDB 등을 서브로 붙이는 느낌으로 **SQL+NoSQL 하이브리드 구조**도 흔함

### 비교

| 항목     | SQL (RDBMS)  | NoSQL                    |
| ------ | ------------ | ------------------------ |
| 스키마    | 엄격           | 유연                       |
| 확장성    | 수직(Scale-Up) | 수평(Scale-Out)            |
| 트랜잭션   | ACID         | BASE                     |
| 정합성    | 강함           | 약함                       |
| 복잡한 쿼리 | 가능           | 제한적                      |
| 사용 예   | 금융, 쇼핑몰, 게시판 | 로그, 캐시, 채팅, IoT          |
| 실무 조합  | JPA + MySQL  | Redis + MongoDB (보조 저장소) |

### 언제 선택해야 할까?

| 상황                              | 추천 DB      |
| ------------------------------- | ---------- |
| 데이터 정합성 중요 (은행, 주문 처리 등)        | ✅ RDBMS    |
| 빠른 속도, 대규모 분산, 유연성 필요 (SNS, 로그) | ✅ NoSQL    |
| 둘 다 필요 (주문은 RDB, 캐시는 Redis)     | ✅ 하이브리드 구조 |

## Client Tool 설치

## DB 구성

## DB 연결
- 클라이언트 프로그램에서 DB와 연결하려면 해당 DBMS의 JDBC Driver 필요
- 또한 연결에 필요한 네 가지 정보가 있어야 함
	- DBMS가 설치된 컴퓨터의 IP 주소: 컴퓨터를 찾아가기 위해
    - DBMS가 허용하는 Port 번호: DBMS로 연결하기 위해
    - DB 계정 및 비밀번호: 어떤 사용자인지 인증받기 위해
    - 사용하고자 하는 DB 이름: DBMS가 여러 DB를 관리하므로 사용할 DB 이름 필요
![](https://velog.velcdn.com/images/emprimula/post/bfec3b8f-b355-4155-910f-7e6e701b7c95/image.png)

### 자바
- `DriverManager.getConnection(url, id, pw)' 이용
- JDBC URL 형식: `"jdbc:mysql://localhost:3306/mydb"`

### Spring
- `application,properties`에서 DB 연결 정보 관리
- 커넥션 풀을 이용해 커넥션 재사용
- 커넥션: DB와의 통신 선
- 매번 열면 비쌈 -> 커넥션 풀로 관리

## 데이터 저장/수정/삭제/조회
**자바**
```java
PreparedStatement pstmt = conn.prepareStatement("INSERT INTO board ...");
pstmt.setString(1, "제목");
```
**Spring**
- Spring JDBC Template: `jdbcTemplate.update(...)`
- JPA: `em.persist(entity)` or `repository.save()`

- SQL Injection 방지를 위해 `PreparedStatement` 사용 필수
- 수정/삭제: `update' 쿼리
- 조회: `ResultSet` -> 객체 매핑(DTO, Entity 등)

## 프로시저와 함수 호출

## 트랜잭션 처리
- 트랜잭션(transaction): 기능 처리의 최소 단위(묶어야 하는 한 세트)
	- ex) `계좌 이체(트랜잭션)` = `출금 작업` + `입금 작업`
    - 하나만 성공하면 안 되고 모두 성공하거나 실패해야 하는 한 세트
- DB는 트랜잭션을 처리하기 위해 **commit**과 **rollback** 제공
	- commit: 내부 작업을 모두 성공 처리
    - rollback: 실행 전으로 돌아간다는 의미에서 모두 실패 처리
    

## 게시판 구현

# CH21 자바 21 신기능

**참고**
1. https://velog.io/@jakeseo_me/%EC%9D%B4%EA%B2%83%EC%9D%B4-%EC%9E%90%EB%B0%94%EB%8B%A4-%EC%A0%95%EB%A6%AC-10-%EB%A9%80%ED%8B%B0-%EC%8A%A4%EB%A0%88%EB%93%9C
2. https://rebornbb.tistory.com/entry/JAVA-%EB%A9%80%ED%8B%B0%EC%8A%A4%EB%A0%88%EB%93%9C-%EA%B0%9C%EB%85%90#%EC%8A%A4%EB%A0%88%EB%93%9C%EC%9D%98%20%EC%9A%B0%EC%84%A0%EC%88%9C%EC%9C%84-1
3. https://kadosholy.tistory.com/123
4. https://velog.io/@ehyowon/14%EC%9E%A5-%EB%A9%80%ED%8B%B0-%EC%8A%A4%EB%A0%88%EB%93%9C
5. https://velog.io/@seo-faper/%EC%9D%B4%EA%B2%83%EC%9D%B4-%EC%9E%90%EB%B0%94%EB%8B%A4-17%EC%9D%BC%EC%B0%A8-Chapter19-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%9E%85%EC%B6%9C%EB%A0%A5
6. https://velog.io/@averycode/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-TCPUDP%EC%99%80-3-Way-Handshake4-Way-Handshake
7. https://velog.io/@dbwltkd1019/Chapter-20-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%9E%85%EC%B6%9C%EB%A0%A5