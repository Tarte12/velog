---
title: 'java GC (ing)'
slug: java-gc-ing
date: 2025-01-21T03:55:50.196Z
tags: ['CS', 'GC', 'TIL', 'garbage collection']
---
# 1. GC? Garbage Collection? 

## 1.1 개념

- 동적 메모리 관리 기법
- 동적으로 할당한 메모리 영역 중 필요 없어진 메모리 객체(Garbage)가 발생하는데, 이 메모리 객체들을 주기적으로 모아서 삭제하는 프로세스

> Java 메모리 구조 
- 자바 애플리케이션이 실행될 때, JVM은 프로세스 메모리 공간을 할당 받고, 이것을 다시 3가지 영역으로 나누어 관리
- Method Area : 클래스 정보, 정적 변수, 상수 등 저장
- Heap : 객체를 저장, GC 수시 실행 <= GC에선 얘가 메인
- Stack : 메소드 호출 시 생성되는 지역 변수, 매개변수 저장

## 1.2 언어별 차이 
- C : 프로그래머가 직접 free() 같은 함수를 사용해 메모리 할당 해제
- Java : JVM에 탑재된 가비지 컬렉터(Garbage Collector)가 알아서 정리 (당연히 신경 쓸 게 줄어드니까, 프로그래머 입장에서는 편함!)
- 다른 언어들(pythpn, javascript 등)도 가비지 컬렉션이 기본적으로 내장된 경우가 많음

## 1.3 장단점

### 1.3.1 장점
- 메모리 누수(Memory Leak) 문제 관리 X -> 개발에만 집중

### 1.3.2 단점
- 메모리가 언제 해제되는지 '정확히' 알 수 없음 -> 제어가 힘듦
- Stop-The-World(STW) : GC가 동작하는 동안 JVM 동작이 멈추는 현상 -> 오버헤드 발생

## 1.4 가비지 컬렉션 대상
GC의 대상 여부 : 도달성(Reachability) 개념 적용
- Reachable : 객체가 참조되고 있는 상태, 객체에 레퍼런스 있음
- Unreachable : 객체 참조 X 상태, 객체에 유효 레퍼런스 X => GC 대상

![](https://velog.velcdn.com/images/emprimula/post/02dbbd67-b7ec-4ef7-8d02-1b5d52eb1a2e/image.png)
- JVM 메모리에서 객체들은 Heap Area에서 실제 생성
- Mehod Area or Stack Area에서 Heap Area에서 생성된 객체의 '주소만 참조'하는 형식으로 구성
- 이렇게 생성된 Heap Area 객체들이 특정 이벤트들로 인해, Heap Area 객체의 메모리 주소를 가지고 있는 참조 변수가 삭제되는 현상 발생
- 위의 그림의 빨간색 객체처럼 Heap Area에 '참조 X 상태 객체(Unreachable)' 발생
- 이런 객체들을 가비지 컬렉터가 주기적으로 제거

### 1.4.1 가비지 컬렉션 청소 방식 = Mark And Sweep
그렇다면 GC가 어떻게 Reachable과 Unrechable을 판단할 것인가?

- Mark And Sweep : 다양한 GC에서 사용되는 객체를 걸러내는 내부 알고리즘 -> 아주 기초적인 청소 과정
- 가비지 컬렉션이 될 대상 객체를 식별(Mark)하고, 제거(Sweep)하여, 객체가 제거되어 파편화된 메모리 영역을 앞에서부터 채워나가는 작업(Compaction) 수행

![](https://velog.velcdn.com/images/emprimula/post/d690ff5b-b1bb-4314-ad8e-ae618a6a4f25/image.png)
- Mark : 먼저 Root Space로부터 그래프 순회를 통해 연결된 객체를 찾아낸 후, 각각 어떤 객체를 참조하고 있는지 찾아서 마킹
- Sweep : 참조 X 객체(Unreachable)를 Heap Area에서 제거
- Compact : Sweep 후에 분산된 객체들을 Heap Area의 시작 주소로 모아, 메모리가 할당된 부분과 그렇지 않은 부분으로 압축 (가비지 컬렉터 종류에 따라 하지 않는 경우도 존재)

(아직 Root Space가 뭔지 모르겠음 더 찾아봐야 할 듯)

# 2. 가비지 컬렉션 동작 과정
## 2.1 Heap 메모리 구조
![](https://velog.velcdn.com/images/emprimula/post/b69ae872-adf7-466e-b052-a98abb3539f8/image.png)

- Heap은 Java 애플리케이션에서 객체가 동적으로 할당되는 구간으로, 크게 Yong Generation과 Old Generation으로 나뉨
- Old > Yong : Yong Generation에 수명이 짧은 객체는 큰 공간 필요 X, 큰 객체들은 바로 Old Generation에 할당되기 때문에
- Heap Area는 처음 설계될 때 2가지를 전제로 설계됨
1. 대부분의 객체는 금방 접근 불가능한 상태(Unreachable)이 됨
2. 오래된 객체에서 새로운 객체로의 참조는 아주 적게 존재
-> 즉, 객체의 대부분은 '일회성', 메모리에 오래 남아있는 경우가 드묾
### 2.1.1 Yong Generation
- 새롭게 생성된 객체가 할당(Allocation)되는 영역
- 대부분의 객체가 금방 Unreachable 상태가 되기 때문에, 많은 객체가 Yong Generation에 생성되었다가 사라짐
- Minor GC : Yong Generation 영역에 대한 가비지 컬렉션

### 2.1.2 Old Generation
- Yong Generation에서 Reachable 상태를 유지하여 살아남은 객체가 복사되는 영역
- Yong Generation보다 크게 할당 -> 영역의 크기가 큰 만큼 가비지가 적게 발생 
- Major GC(Full GC) : Old Generation에 대한 가비지 컬렉션
- OG에서 Major GC가 일어날 경우, Stop-The-World 발생
### 2.1.3 Eden
![](https://velog.velcdn.com/images/emprimula/post/2f9ce32b-c395-46f7-8490-ed0f890e869e/image.png)
- Heap Area에서 더 효율적 GC를 위해 Yong Generation을 다시 3가지 영역으로 나눔 -> Eden, Survivor 0, Survivor 1
#### Eden
- new를 통해 새로 생성된 객체가 위치
- 정기적인 쓰레기 수집 후, 살아남은 객체들은 Survivor 영역으로 이동
#### Survivor 0/Survivor 1
- 최소 1번 이상 GC 이상 살아남은 객체가 존재하는 곳
- Survivor엔 특별한 규칙 존재 -> Survivor 0 or Survivor 1 둘 중 하나는 '꼭 비어있어야' 함

>[Java 8에서의 Permanent]
![](https://velog.velcdn.com/images/emprimula/post/9282d767-a978-47f2-836f-113e8c59e139/image.png)
- Permanent : 영구적인 세대, 생성된 객체들의 정보 주소값이 저장된 공간
- 클래스 로더에 의해 load되는 Class, Method 등에 대한 Meta 정보가 저장되는 영역, JVM에 의해 사용
- Java 7까진 Heap Area에 존재, Java 8 버전 이후부터 Native Method Stack에 편입
(클래스 로더가 뭐지??)

## 2.2 Minor GC
![](https://velog.velcdn.com/images/emprimula/post/81605cc9-cf76-4317-a12d-8526a9d5e667/image.png)
- Young Generation은 짧게 살아남는 메모리들이 존재
- 모든 객체들은 처음에 Young Generation에 생성
=> 위에서 크기가 아주 큰 경우 Old Genration에 할당된다고 하여서, 검색해 봤는데, 일반적인 경우를 설명하는 듯함 (확신이 없어서 보류? 이긴 함)
- Young Generation 공간은 Old Generation에 비해 상대적으로 작기 때문에, 메모리 상의 객체를 찾아 제거할 때 적은 시간이 걸림 (원룸에서 물건 찾기가 쉬운 것처럼)
- 따라서, Young Generation에서 발생하는 GC를 Minor GC라고 부름
#### [과정]
1. 처음 생성된 객체는 Young Generation 영역의 Eden에 위치
![](https://velog.velcdn.com/images/emprimula/post/02d67839-0e2a-4700-89a2-c867d8c23a37/image.png)

2. 객체가 계속 생성 -> Eden 영역이 꽉 참 -> Minor CG 실행
![](https://velog.velcdn.com/images/emprimula/post/fc4165ea-2f35-482e-b184-b05d621ddb63/image.png)

3. Mark 동작을 통해 Reachable 객체 탐색
![](https://velog.velcdn.com/images/emprimula/post/902bf4c7-3a7a-4317-bfcc-17847731d68a/image.png)

4. Eden에서 살아남은 객체 -> Survivor로 이동
![](https://velog.velcdn.com/images/emprimula/post/847776c6-ef1e-4beb-a7a2-2daae8af1efc/image.png)

5. Eden에서 사용되지 않는 객체 Unreachable 메모리 해제(sweep)
![](https://velog.velcdn.com/images/emprimula/post/ea7d9dc3-bd93-434e-9583-d8cb4b2ee4f3/image.png)

6. 살아남은 모든 객체들은 age값 1 증가
![](https://velog.velcdn.com/images/emprimula/post/e50c0c51-7825-4573-88c6-d85e5f035689/image.png)


>age값?
- Survivor 영역에서 객체가 살아남은 횟수를 의미(Object Header에 기록)
- age값이 임계값에 다다를 경우 Promotion(OG 이동) 여부 결정
- JVM 중 가장 일반적인 HotSpot JVM의 경우, age의 기본 임계값 31
- 객체 헤더의 age를 기록하는 부분이 6 bit로 되어 있기 때문에
- Survivor 영역의 제한 조건으로, Survivor 영역 중 반드시 1개 사용, 1개는 비어야 함
- 두 영역 모두에 데이터 존재 or 모두 사용량이 0이라면 -> 현재 시스템이 정상적인 상황 X

7. 위 과정을 반복

## 2.3 Major GC
![](https://velog.velcdn.com/images/emprimula/post/b56b0dd4-9411-418d-832a-a0abcdc90756/image.png)
- Old Generation은 길게 살아남는 메모리들이 존재하는 공간
- GC 과정 중 제거되지 않은 메모리가 age 임계값이 차게 되어 이동
- Majot GC는 객체들이 계속 Promotion이 되어 OG 영역의 메모리가 부족해질 경우 발생

#### [과정]

1. 객체의 age가 임계값에 도달했을 경우
![](https://velog.velcdn.com/images/emprimula/post/11067c25-35e7-472f-ae1f-ec96f3103047/image.png)
2. 이 객체들은 Old Generation에 이동 = Promotion
![](https://velog.velcdn.com/images/emprimula/post/fb1df8e1-a633-4fa7-aa2f-127105d52db5/image.png)
3. 이 과정이 반복되어 OG 공간(메모리)가 부족해짐 => Major GC 발생
![](https://velog.velcdn.com/images/emprimula/post/25abf2ef-70d0-4903-a228-dbe978169dab/image.png)
- OG에 할당된 메모리 허용치가 넘어갈 경우 -> OG 내에 있는 모든 객체들을 검사하고, 참조되지 않은 객체들을 한꺼번에 삭제하는 Major GC 실행
- OG는 YG에 비해 큰 공간을 가지고 있어, 메모리 상 객체 제거에 많은 시간을 사용
- Major GC는 Minor GC보다 시간이 훨씬 오래 걸려 => Stop-The-World 문제 발생
- Major GC 발생 => Thread 정지, Mark and Sweep 작업 실행 => CPU 부하 => 멈추거나 버벅이는 현상 발생 (Minor GC에 비해 애플리케이션에 영향을 줌)
# 3. 가비지 컬렉션 알고리즘
- Stop-The-World, Heap 사이즈가 커지면서 두드러진 지연(Suspend) 현상 등으로 최적화하기 위한 다양한 Garbage Collection 알고리즘이 개발
- 상황에 따라 필요한 GC 방식 설정 사용 : GC 알고리즘은 모두 설정을 통해 Java에 적용 가능
## 3.1 Serial GC
- 서버의 CPU 코어가 1개일 때 사용하기 위해 개발된 가장 단순한 GC
- GC를 처리하는 스레드가 1개(싱글 스레드) -> 가장 Stop-The-World 시간이 길다
- Minor GC : Mark-Sweep / Major GC : Mark-Sweep-Compact 사용
- 보통 실무에서 사용 X (디바이스 성능이 안 좋아 CPU 코어가 1개일 때만 사용)
>- 실행 명령어 : -XX:+UseSerialGC
## 3.2 Parallel GC
- Java 8의 디폴트 GC
- Serial GC와 기본 알고리즘 동일, Young Generation의 Minor GC를 멀티 스레드로 수행 (Old Generation은 싱글 스레드)
- Serial GC보단 Stop-The-World 시간 감소

>- 실행 명령어 : -XX:+UseParallelGC
- CG 스레드는 기본적으로 CPU 개수만큼 할당
- 옵션을 통해 GC를 수행할 스레드의 갯수 설정 가능

## 3.3 Parallel Old GC
- Parallel GC를 개선한 버전
- YG, OG 모두 멀티 스레드로 GC 수행
- 새로운 가비지 컬렉션 청소 방식인 Mark-Summary-Compact 방식 이용 (Old Generation도 멀티 스레드 처리)
> - 실행 명령어 : -XX:+UseParallelOldGC
## 3.4 CMS GC
- 애플리케이션의 스레드와 GC 스레드가 동시 실행 => Stop-The-World 시간을 최대한 줄이기 위해 만들어진 GC
- GC 과정이 복잡해짐
- GC 대상을 파악하는 과정이 복잡한 여러 단계로 수행 -> 다른 GC 대비 CPU 사용량이 높음
- Parallec GC와의 차이점은 Compaction 작업의 유무
- 메모리 파편화 문제 (이건 뭐지?)
- CMS GC는 Java 9버전부터 deprecated되었고, Java 14에선 사용 중지
>-실행 명령어 : -XX:+UseConcMarkSweepGC

> 메모리 파편화 : 메모리 공간이 조각조각 나서 공간 자체는 충분히 존재하는데, 할당이 불가능한 상태
Compaction : 메모리 공간에서 사용하지 않는 빈 공간이 없도록 옮겨 메모리 분산을 제거하는 작업

## 3.5 G1 GC (Garbage First)
- CMS GC를 대체하기 위한 jdk 7 버전에서 최초로 release된 GC
- Java 9+ 버전 디폴트 GC
- 4GB 이상의 Heap 메모리, Stop-The-World 시간이 0.5초 정도 필요한 상황에 사용 (Heap이 너무 작을 경우 미사용 권장)
- 기존 GC 알고리즘에서는 Heap 영역을 물리적으로 고정된 YG/OG로 나누어 사용하였지만,
- G1 GC의 경우, 이 개념을 뒤엎는 Region이라는 개념을 새로 도임
- 전체 Heap Area를 Region이라는 영역으로 체스같이 불할 -> 상황에 따라 Eden, Survivor, Old 등 역할을 고정 X, 동적으로 부여
- Garbage로 가득 찬 영역을 빠르게 회수하여 빈 공간 확보-> 결국 GC 빈도가 줄어드는 효과를 얻는 원리
![](https://velog.velcdn.com/images/emprimula/post/7ea78026-54e5-4d0a-bd7f-9100c7a12115/image.png)
> - 실행 명령어 : -XX:+UseG1GC
## 3.6 Shenandoah GC
- Java 12에서 release
- 레드 햇 개발 GC
- 기존 CMS가 가진 단편화, G1이 가진 pause 해결
- 강력한 Concurrency와 가벼운 GC 로직으로 Heap 사이즈 영향 X -> 일정한 pause 시간 소요가 특정
![](https://velog.velcdn.com/images/emprimula/post/f5189aed-abae-48f8-b285-366575975d6f/image.png)
> - 실행 명령어 : -XX:+UseShenandoahGC
## 3.7 ZGC (Z Garbage Collector)
- Java 15에 release
- 대량의 메모리(8MB ~ 16TB)를 low-latency로 잘 처리하기 위해 디자인된 GC
- ZGC는 G1의 Region처럼 ZPage라는 영역 사용
- Region은 크기가 고정이지만, ZPage는 2mb 배수로 동적으로 운영 (큰 객체가 들어오면 2^로 영역을 구성해 처리)
- Heap 크기가 증가하더라도 절대 Stop-The-World 시간이 10ms를 넘지 않는다는 게 장점
> - 실행 명령어 : -XX:+UnlockExperimentalVMOptions



[참고]
1. https://inpa.tistory.com/entry/JAVA-%E2%98%95-%EA%B0%80%EB%B9%84%EC%A7%80-%EC%BB%AC%EB%A0%89%EC%85%98GC-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC#%EA%B0%80%EB%B9%84%EC%A7%80_%EC%BB%AC%EB%A0%89%EC%85%98_%EB%8C%80%EC%83%81
2. https://mxruhxn.tistory.com/entry/Java-Garbage-Collection#GC%20%EB%8F%99%EC%9E%91%20%EA%B3%BC%EC%A0%95-1
3. https://coding-factory.tistory.com/829
4. https://s-y-130.tistory.com/111
5. https://velog.io/@salgu1998/JVM-Garbage-Collection-GC
6. https://thinkground.studio/2020/11/07/%EC%9D%BC%EB%B0%98%EC%A0%81%EC%9D%B8-gc-%EB%82%B4%EC%9A%A9%EA%B3%BC-g1gc-garbage-first-garbage-collector-%EB%82%B4%EC%9A%A9/