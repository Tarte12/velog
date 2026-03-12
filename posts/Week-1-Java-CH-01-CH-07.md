---
title: '[Java] Week 1 Java CH 01 ~ CH 05'
slug: Week-1-Java-CH-01-CH-07
date: 2025-05-20T13:30:53.636Z
tags: ['Java', '이것이자바다', '자바스터디']
---
>이것이 자바다 메인으로 참고

** 5/20 **

**CH 01 자바 시작하기**
# CH O1 자바는 어떻게 실행되는가? - JDK부터 JVM까지

## 1. JDK, JRE, JVM
> 자바를 처음 설치하면 C:\Program Files\Java 폴더 안에 JDK, JRE가 설치된다
> JDK, JRE가 뭘까?

### JDK(Java Development Kit)
- 자바 개발 키트의 약자 
- **개발자들이 자바로 개발**하는 데에 사용되는 **SDK** 키트
- 개발 도구 + JRE
- 그래서 JDK 안에 자바를 개발할 때 필요한 라이브러리, javac, javadoc 등의 개발 도구가 포함되어 있고
- 개발을 하려면 **자바 프로그램 실행**도 시켜 줘야 하기 때문에 **JRE(Java Runtiome Environment)**도 포함되어 있음

>SDK = Software Development Kit
>- 하드웨어 플랫폼, 운영체제, 프로그래밍 언어 제작사가 제공하는 툴

#### JDK 구성
![](https://velog.velcdn.com/images/emprimula/post/d01241d3-4d75-483d-b22e-e350175bd783/image.png)

#### JDK 디렉토리 구성 요소
1. bin: 자바 개발, 실행에 필요한 도구와 유틸리티 명령
2. include: 네이티브 코드 프로그래밍에 필요한 C언어 헤더 파일
3. lib: 실행 시간에 필요한 라이브러리 클래스들

#### bin 디렉터리에 들어있는 개발 프로그램
1. javac: 자바 컴파일러 => 자바 소스를 바이트 코드로 컴파일
2. java: 자바 인터프리터 => 컴파일러가 생성한 바이트 코드를 해석하고 실행
3. javadoc: 자바 소스로부터 HTML 형식의 API 도큐먼트 생성
4. jar: 자바 클래스 파일을 압축한 잡 아카이브 파일(.jar) 생성/관리하는 압축 프로그램 (like zip)
5. jmod: 자바의 모듈 파일(.jmd)을 만들거나 모듈 파일 내용 출력
6. jlink: 응용 프로그램에 맞춘 맞춤형 JRE 생성
7. jdb: 자바 응용 프로글매의 실행 중 오류 찾는 데에 사용하는 디버거
8. javap: 역어셈블리어 => 컴파일된 클래스 파일을 원래 소스로 변환

### JRE(Java Runtiome Environment)
- 자바 실행 환경의 약자
- JVM과 **자바 프로그램을 실행(동작)**시킬 때 필요한 라이브러리 API를 함께 묶어서 배포되는 패키지
- JRE = JVM + 라이브러리
- 자바 런타임 환경에 사용하는 프로퍼티 세팅, 리소스 파일(jar 파일)도 가짐
- JDK에 JRE가 기본으로 포함되어 있어, JDK를 설치하면 함께 설치됨

> **정리**
> **Java로 프로그램을 직접 개발하려면? JDK**
> 컴파일된 **Java 프로그램을 실행시키려면? JRE**

### JVM(Java Virtual Machine)
- 자바 가상 머신의 약자 => 자바를 실행하는 머신
- **걍 자바를 돌리는 프로그램** 정도로 이해
- 자바로 작성된 모든 프로그램은 JVM에서만 실행될 수 있으므로, 자바 프로그램을 실행하기 위해서는 JVM이 반드시 설치되어 있어야 함
- JVM은 JRE에 포함되어 있음 => 현재 사용하는 컴퓨터 운영체제에 맞는 자바 실행환경(JRE)가 설치되어 있다면 자바 가상 머신도 설치되어 있음


- JVM의 장점: **자바 프로그램을 모든 플랫폼에서 제약 없이 동작**시킬 수 있음

**WHY?**

#### 왜JVM이 필요한가?
- Java는 **OS에 종속적이지 않다는 특징** 가짐
- OS에 종속받지 않고 실행하기 위해
- OS 위에서 Java를 실행시킬 무언가가 필요
- 이게 **JVM**

#### Java의 실행(WORA)
- Java 언어로 작성한 소스파일은 직접 운영체제로 가서 실행 X
- ** JVM을 거쳐서 운영체제와 상호작용** 을 하게 됨
**=> 운영체제로부터 독립적으로 프로그램을 제약 없이 실행**할 수 있다라는 의미
- 컴파일된 코드와 하드웨어/OS 사이 중간에서, JVM이 하드웨어/OS 환경에 맞게 JVM이 Byte Code로 변환해 줌

** Java의 동작 과정 **
1. 자바 컴파일러가 java로 작성된 소스 코드 .java 파일을 .class 파일인 Byte code로 컴파일
2. Byte code를 기계어로 변환시키기 위한 가상 CPU가 필요 = **JVM**
3. JVM이 Byte code를 기계어(Binary Code)로 변환
4. 이렇게 JVM에 의해 컴파일된 기계어가 바로 CPU에서 실행되어 사용자에게 서비스 제공

- JAVA = WORA
- Write Once, Read Anywhere
- 재컴파일 X, 바로 기계가 읽고 실행할 수 있게 한다는 의미
- 따라서 Java는 **이식성이 높다***

**But, JVM은 OS에 종속적이므로 운영체제에 맞는 JVM 설치 필요**

**단점: JVM를 한 단계 더 거쳐야 하므로 상대적으로 실행 속도 느림**
**=> 이 속도 문제를 보완하기 위해 JIT 컴파일러 이용**
-필요한 부분만 기계어로 바꿔 성능 향상을 추구했으나, C언어 실행 속도를 따라잡을 수 X(이것 때문에 게임, 임베디드 계열은 C계열 언어를 사용함)


**5/21**
## JVM 메모리 구조 & 메모리 영역
>이 블로그를 메인으로 참조하여 공부
https://inpa.tistory.com/entry/JAVA-%E2%98%95-JVM-%EB%82%B4%EB%B6%80-%EA%B5%AC%EC%A1%B0-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%98%81%EC%97%AD-%EC%8B%AC%ED%99%94%ED%8E%B8

### Java 프로그램 실행 과정

![](https://velog.velcdn.com/images/emprimula/post/b33a3723-a93b-4b94-bd01-3c2a4cffd0db/image.jpg)

1. 소스 코드 작성
2. 컴파일러는 자바 소스 코드를 이용해 클래스 파일 생성, 컴파일된 클래스 파일은 JVM이 인식할 수 있는 바이트 코드 파일
3. JVM은 클래스 파일의 바이트 코드를 해석하여 바이너리 코드로 변환하고 프로그램 수행
4. 수행 결과가 컴퓨터에 반영

=> JVM 실행 부분은 컴파일된 .class 파일을 어떠한 처리를 거쳐 프로그램을 실행하는 과정

### JVM의 동작 방식
- JVM의 역할: 자바 애플리케이션을 클래스 로더를 통해 읽어 자바 API와 함께 실행하는 것

**자바 소스 파일을 어떤 동작으로 코드를 읽는지**
![](https://velog.velcdn.com/images/emprimula/post/6eb0f494-c5b4-4043-8d2a-89dc99268c1b/image.PNG)
1. 자바 프로그램 실행 -> JVM이 OS로부터 메모리를 할당받음
2. 자바 컴파일러(javac)가 자바 소스코드(.java)를 자바 바이트 코드(.class)로 컴파일
3. Class Loader는 동적 로딩을 통해 필요한 클래스들을 로딩 및 링크하여 Runtime Data Area(실질적인 메모리를 할당받아 관리하는 영역)에 올림
4. Runtime Data Area에 로딩된 바이트 코드는 Execution Engine을 통해 해석됨
5. 이 과정에서 Execution Engine에 의해 Garbage Collector의 작동과 Thread 동기화가 이뤄짐

### JVM의 구조
- Class Loader <-> Excution Engine <-> Runtime Data Area 부분을 더 상세화한 도식
![](https://velog.velcdn.com/images/emprimula/post/dd6d5d25-8ed2-479c-89ba-be40e4c59239/image.PNG)
**JVM 구성**
1. 클래스 로더(Class Loader)
2. 런타임 데이터 영역(Runtime Data Area)
- 메소드 영역
- 힙 영역
- PC Register
- 스택 영역
- 네이티브 메소드
3. 실행 엔진(Execution Engine)
- 인터프리터(Interpreter)
- JIT 컴파일러(Just-in-Time)
- 가비지 콜렉터(Garbage Collector)
4. JNI- 네이티브 메소드 인터페이스(Native Medthod Interface)
5. 네이티브 메소드 라이브러리(Native Method Library)

#### 클래스 로더(Class Loader)
- JVM 내로 클래스 파일(.class)을 동적으로 로드하고, 링크를 통해 배치하는 작업을 수행하는 모듈
- ** 로드된 바이트 코드(.class)들을 엮어서 JVM의 메모리 영역인 Runtime Data Area에 배치 **
- 로딩 기능: 클래스를 메모리에 올리는 것
- 로딩 기능은 애플리케이션에 필요한 경우 동적으로 메모리에 적재
- 클래스 파일의 로딩 순서: Loaging -> Linking -> Initialization
![](https://velog.velcdn.com/images/emprimula/post/03d770f6-707f-4f17-91b2-690525ba191f/image.PNG)
1. Loading: 클래스 파일을 가져와서 JVM의 메모리에 로드
2. Linking: 클래스 파일을 사용하기 위한 검증 과정
- Verifying(검증): 읽어들인 클래스가 JVM 명세에 명시된 대로 구성되어 있는지 검사
- Preparing(준비): 클래스가 필요로 하는 메모리 할당
- Resolving(분석): 클래스의 상수 풀 내 모든 심볼릭 레퍼런스를 다이렉트 레퍼런스로 변경
3.Initializtion(초기화): 클래스 변수들을 적절한 값으로 초기화
#### 런타임 데이터 영역(Runtime Data Area)
- JVM이 실행 중에 사용하는 메모리
|영역|설명|
|---|---|
|<모든 스레드에서 공유>|
|Mehode Area|JVM이 시작될 때 생성되는 공간으로 바이트 코드를 처음 메모리 공간에 올릴 때 초기화되는 대상을 저장하기 위한 메모리 공간, 프로그램이 종료될 때까지 저장|
|Heap|new 연산자로 생성되는 클래스와 인스턴스 변수, 배열 타입 등 Reference Type이 저장되는 공간|
|<각 스레드별로 생성>|
|Stack|기본 자료형을 생성할 때 저장하는 공간으로, 임시적으로 사용되는 변수, 정보들이 저장되는 공간|
|PC Register|스레드가 시작될 때 생성, 현재 수행 중인 JVM 명령어 주소 저장 공간|
|Native Method Stack|기계어로 작성된 프로그램을 실행시키는 영역, C언어 등 네이티브 메서드 실행을 위한 스택|
#### 실행 엔진(Execution Engine)
- 클래스 로더를 통해 런타임 데이터 영역에 배치된 바이트 코드를 명령어 단위로 읽어서 실행
- 인터프리터: 바이트코드를 한 줄씩 즉시 해석 후 실행
- JIT 컴파일러: 자주 사용되는 코드를 기계어로 변환해서 캐싱 => 속도 향상
#### JNI
- 자바가 아닌 코드와 상호작용할 때 사용
#### 네이티브 메소드 라이브러리(Native Method Library)
- OS에 맞는 라이브러리

# CH 02 변수와 타입