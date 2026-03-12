---
title: '채팅 기능 도입 고민: Long Polling VS WebSocket, Java VS node, RabbitMQ VS Kafka'
slug: 채팅-기능-도입-고민-Long-Polling-VS-WebSocket-Java-VS-node-RabbitMQ-VS-Kafka
date: 2026-02-24T06:05:22.618Z
tags: []
---
> **결론**: 채팅 서버(Node.js)와 기본 서버(Spring)를 분리.  
> 모든 채팅(WebSocket + Long Polling)은 Node.js 채팅 서버에서 처리,  
> 채팅 메시지 저장은 RabbitMQ를 통해 Spring에 비동기로 위임,  
> 유저 인증/채팅방 조회 등 비즈니스 로직은 Spring HTTP API 호출

---

## 0. 왜 이 구조인가 — 채팅 종류와 서버 간 통신 설계

### 채팅 종류 구분

이 프로젝트의 채팅은 **성격이 다른 두 가지**로 나뉜다.

| 채팅 종류 | 상황 | 요구사항 |
|---|---|---|
| **화상 채팅 내 텍스트 채팅** | 화상 회의 진행 중 실시간으로 주고받는 채팅 | ms 단위의 실시간성, 화상/음성 스트리밍과 동기화 |
| **미팅 예약/조율 채팅** | 화상 회의 전후로 미팅 일정을 잡는 채팅 | 실시간성보다 안정성, 메시지 빈도 낮고 간헐적 |

이 차이가 **WebSocket vs Long Polling** 선택의 근거가 된다.

---

### 서버 간 통신 설계

Node.js 채팅 서버와 Spring 기본 서버가 분리된 MSA 구조에서, 두 서버 간 통신은 **데이터 성격에 따라 방식을 구분**한다.

| 통신 종류 | 방식 | 이유 |
|---|---|---|
| **채팅 메시지 저장** | RabbitMQ (비동기) | 응답을 기다릴 필요 없음. Spring이 잠시 다운돼도 큐에 쌓였다가 재시작 후 처리. 채팅 흐름에 영향 없음 |
| **유저 인증 / 채팅방 조회** | HTTP (동기) | 응답값이 필요한 요청-응답 구조. MQ로 구현하면 불필요하게 복잡해짐 |

**MSA에서 DB를 직접 공유하지 않는 이유**: 각 서비스가 자신의 DB를 소유하는 것이 MSA 원칙이다. Node.js가 PostgreSQL에 직접 접근하면 Spring과 DB를 공유하게 되어 서비스 간 결합도가 높아진다. RabbitMQ를 통해 Spring에 저장을 위임함으로써 이 원칙을 지킨다.

```
[클라이언트]
    │
    ├─ WebSocket / Long Polling (채팅)
    │
    ▼
[Node.js 채팅 서버]
    │                        │
    │ RabbitMQ publish       │ HTTP 요청
    │ (메시지 저장, 비동기)    │ (유저 인증, 채팅방 조회, 동기)
    ▼                        ▼
[RabbitMQ]            [Spring 기본 서버]
    │                        │
    │ 구독                    │
    ▼                        ▼
[Spring 기본 서버] ──▶ [PostgreSQL]
```

---

## 1. 언어 선택: Java VS Node.js

### Java: WebFlux (Reactive Programming)

**WebFlux**는 Spring 5에서 도입된 Reactive Programming 모델이다.

- **정체**: 적은 수의 스레드로 수만 개의 요청을 처리하기 위해 만든 **이벤트 루프(Event Loop)** 기반 프레임워크. Node.js의 방식과 유사하다.
- **어디에 쓰는가**: 대규모 트래픽이 몰리는 Gateway 서버, 채팅처럼 수많은 연결을 유지해야 하는 서버.
- **단점**:
  - **학습 곡선**: `Mono`, `Flux` 같은 생소한 객체를 써야 하며, 코드가 매우 파편화된다.
  - **라이브러리 제약**: JDBC 같은 Blocking DB 드라이버를 쓰면 성능이 폭락하므로 R2DBC 같은 비동기 드라이버만 써야 한다.

---

### Java: 가상 스레드 (Virtual Threads - Project Loom)

Java 21에서 정식 도입된 가상 스레드는 WebFlux의 복잡함을 해결하기 위해 나왔다.

- **정체**: 실제 OS 스레드 위에 떠 있는 **경량화된 가짜 스레드**. 기존 스레드가 1MB를 차지했다면, 가상 스레드는 수십 바이트 수준이다.
- **Pinning 문제**: `synchronized` 키워드를 만나면 가상 스레드가 OS 스레드에 고정(pin)되어 비동기의 이점을 잃는 문제가 있었다. **Java 24에서 대부분 해결**되어, JPA 등 기존 동기식 코드를 그대로 써도 수백만 개의 가상 스레드를 돌릴 수 있게 됐다.
- **WebFlux 대신 쓰는 이유**:
  1. **가독성**: `Flux` 없이 평범한 Java 코드인데 성능은 비동기.
  2. **디버깅**: 스택 트레이스가 끊기지 않아 에러 잡기가 훨씬 쉽다.

---

### Node.js: 채팅 서버로 선택한 이유

#### ① 이벤트 기반(Event-Driven) I/O

채팅은 CPU 계산이 많은 작업이 아니라, 메시지를 **"기다렸다가(Wait) 전달(Transfer)"** 하는 I/O 중심 작업이다. Node.js는 단일 스레드 이벤트 루프가 이 대기 작업을 효율적으로 처리한다.

- Java가 가상 스레드를 통해 "스레드 비용을 줄이는 법"을 고민할 때, Node.js는 처음부터 "스레드 없이 가볍게 돌리는 법"을 완성했다.

> **비유: 단일 스레드 이벤트 루프**  
> 점원(Event Loop)이 딱 한 명인데, 이 점원은 기다리지 않는다.  
> 주문을 받자마자 주방에 전달하고 다음 손님에게 달려간다.  
> 요리가 완료되면 벨이 울리고, 그때 서빙(Callback)한다.  
> 점원이 한 명이라 Context Switching이 없고, 메모리 소비가 극도로 적다.

#### ② JSON의 원어민(Native)

채팅 메시지는 99% JSON이다. Node.js에서 JSON은 곧 JavaScript 객체로, 파싱 비용이 거의 없다. Java는 모든 메시지를 `Class`로 만들고 역직렬화하는 과정에서 리소스를 추가로 소모한다.

#### ③ Socket.io의 완성도

채팅 서버에서 가장 어려운 건 **"연결이 끊겼을 때의 처리"** 다. `Socket.io`는 지난 10년간 이 문제를 해결해 왔고, 브라우저 호환성, 자동 재연결, 룸(Room) 관리 등을 안정적으로 제공한다.

---

### ⚠️ Node.js 선택의 현실적인 단점

| 단점 | 설명 |
|---|---|
| **팀 스택 분리 비용** | Java/Spring 팀에서 Node.js 서버를 별도 관리하면 배포 파이프라인, 모니터링, 로그 수집 등 운영 오버헤드가 두 배가 된다 |
| **CPU-intensive 작업 취약** | 이미지 처리, 암호화 등 CPU를 많이 쓰는 작업이 끼면 싱글 스레드 특성상 이벤트 루프 전체가 블로킹된다 |
| **Java 가상 스레드와 실제 성능 차이** | I/O bound 채팅 서버에서 Java 가상 스레드 vs Node.js의 실제 처리량 차이는 생각보다 크지 않다. Java 스택을 이미 쓰고 있다면 굳이 전환할 필요가 없을 수도 있다 |

---

## 2. 채팅 구현 방식: Long Polling VS WebSocket

### 방식 비교

| 방식 | 특징 | 장점 | 단점 |
|---|---|---|---|
| Polling | 주기적으로 HTTP 요청을 보냄 | 구현이 매우 단순함 | 무의미한 요청/응답으로 인한 서버 부하 |
| Long Polling | 서버에 요청을 보내고 이벤트 발생 시까지 대기 | Polling보다 실시간성이 높고 자원 낭비가 적음 | 연결이 끊기면 다시 연결해야 하는 오버헤드 |
| WebSocket | 한 번의 핸드셰이크 후 양방향 전이중 통신 | 가장 높은 실시간성, 헤더 오버헤드 최소화 | Stateful한 연결 관리 부담 |

---

### 화상 회의 내 텍스트 채팅: WebSocket + Socket.io

화상 회의 내 채팅은 **밀리초 단위의 실시간성**이 핵심이다.

**Socket.io를 쓰는 이유**: 순수 WebSocket은 연결 끊김 처리, 재연결, 브라우저 호환성 등을 직접 구현해야 한다. Socket.io는 이 모든 것을 추상화하고, Room 기반의 브로드캐스팅을 간단하게 처리할 수 있다.

- **극대화된 실시간성 및 안정적 연결**: 화상 회의는 ms 단위의 지연도 UX를 크게 저해한다. Socket.io는 WebSocket을 우선 사용하되, 네트워크 환경에 따라 HTTP Long Polling으로 자동 전환(Fallback)하는 기능을 제공한다.
- **프로토콜 오버헤드 최소화**: Typing Indicator, 읽음 처리 등의 이벤트가 초당 수십 번 발생할 수 있다. 매번 거대한 HTTP 헤더 대신 가벼운 패킷 단위로 통신하여 전송 효율을 극대화한다.
- **Room 기반 브로드캐스팅**: 특정 회의실 단위의 격리된 통신이 필수적이다. Socket.io의 Room 기능을 활용하면 특정 참가자들에게만 메시지를 즉시 푸시할 수 있다.

**메시지 흐름**:
```
유저 A → send_message 이벤트
  → Socket.io Room 브로드캐스트 (즉시, 유저 B 수신)
  → RabbitMQ publish (비동기, DB 저장 위임)
```

---

### 미팅 예약/조율용 채팅: Long Polling

예약 관련 대화는 전송 빈도가 낮고 간헐적이다. 이벤트가 없는 유휴 시간에도 서버 자원을 점유하는 WebSocket 대신, **데이터가 있을 때만 응답을 전달하는 Long Polling**이 리소스 관리 측면에서 유리하다.

**Long Polling vs SSE 차이**:

| 방법 | 특징 | 용도 |
|---|---|---|
| **Long Polling** | 응답 후 연결 끊김 → 클라이언트가 재요청 | 예약 채팅처럼 메시지 빈도가 낮은 경우 |
| **SSE (Server-Sent Events)** | 연결 유지하며 서버 → 클라이언트 단방향 스트림 | 실시간 알림, 피드 |

> **Long Polling ≠ SSE**  
> SSE는 연결을 계속 유지하며 서버가 여러 번 데이터를 밀어보낸다. Long Polling은 응답 한 번에 연결이 끊기고 클라이언트가 재요청한다.

- **Sparse Data 전송 모델**: 유휴 시간에도 서버 자원을 점유하는 WebSocket 대신, 데이터가 있을 때만 응답을 전달하여 리소스를 절약한다.
- **네트워크 인프라의 견고성**: HTTP 기반이라 표준 방화벽(Port 80/443) 통과가 용이하고, L7 로드밸런서와의 호환성이 뛰어나다.
- **타임아웃 처리**: 새 메시지가 없으면 30초 후 빈 배열로 응답 → 클라이언트가 즉시 재요청하여 사실상 연결이 유지된다.

**메시지 흐름**:
```
클라이언트 → GET /api/chat/poll/{roomId}     (응답 대기, 최대 30초)
새 메시지 도착 → 즉시 응답
클라이언트 → 수신 즉시 재요청
           또는 타임아웃(30초) → 빈 배열 수신 → 재요청

메시지 전송:
클라이언트 → POST /api/chat/send/{roomId}
  → 대기 중인 클라이언트에게 즉시 응답
  → RabbitMQ publish (비동기, DB 저장 위임)
```

---

## 3. 메시지 큐: RabbitMQ VS Kafka

### 비교

| 구분 | RabbitMQ | Kafka |
|---|---|---|
| **핵심 모델** | 메시지 브로커 (Push 방식) | 이벤트 스트리밍 플랫폼 (Pull 방식) |
| **데이터 보존** | 소비 완료 시 메시지 즉시 삭제 | 설정 기간 동안 디스크에 로그로 저장 (영속성) |
| **운영 난이도** | 낮음 (설치 및 관리 직관적) | 매우 높음 (브로커, 파티션, 복제 설정 복잡) |
| **주요 장점** | 유연한 라우팅, 우선순위 큐 지원 | 대용량 처리, 메시지 재처리(Replay) 가능 |

---

### [현재] 채팅 메시지 저장 파이프라인: RabbitMQ

현재 RabbitMQ의 역할은 **Node.js가 수신한 채팅 메시지를 Spring에 비동기로 전달하여 PostgreSQL에 저장**하는 것이다.

- **서비스 간 느슨한 결합**: Node.js는 메시지를 큐에 던지고 즉시 다음 처리로 넘어간다. Spring이 잠시 다운돼도 채팅 서버는 영향을 받지 않으며, 재시작되면 큐에 쌓인 메시지를 순서대로 처리한다.
- **메시지 유실 방지**: `durable` 큐와 `persistent` 메시지 옵션으로 RabbitMQ 재시작 시에도 메시지가 유지된다. Spring 컨슈머에서 저장 실패 시 Dead Letter Queue(DLQ)로 보내 재처리할 수 있다.
- **DB 직접 공유 방지**: Node.js가 PostgreSQL에 직접 접근하면 Spring과 DB를 공유하게 되어 MSA 원칙에 위배된다. RabbitMQ를 통해 Spring에 저장을 위임함으로써 각 서비스가 자신의 DB를 소유하는 원칙을 지킨다.
- **인프라 운영 리소스 최적화**: Kafka는 고가용성 보장을 위해 최소 3대 이상의 브로커와 주키퍼(또는 KRaft) 관리가 필수다. 별도 운영 조직이 없는 현재 단계에서 Kafka 도입은 Over-Engineering이다.

---

### [추후] 결제 및 복합 도메인 확장: Kafka로의 전환

결제 시스템 도입 및 데이터 분석 요구사항이 발생하는 시점에 Kafka로 점진적 전환을 고려한다.

- **결제 도메인의 데이터 영속성 보장**: 결제 이벤트는 유실되어서는 안 되며, 장애 발생 시 특정 시점부터 다시 읽어 처리하는 **메시지 재처리(Replay)** 기능이 필수다. Kafka의 로그 기반 저장 방식이 이를 완벽히 충족한다.
- **멀티 컨슈머(Fan-out) 구조**: 결제 완료 시 알림, 포인트 적립, 매출 집계 등 수많은 서비스가 동일한 이벤트를 각자 소비해야 한다. Kafka는 하나의 토픽을 여러 컨슈머 그룹이 독립적으로 소비할 수 있어 확장성이 뛰어나다.
- **점진적 마이그레이션**: 초기에는 RabbitMQ로 처리하고, 시스템 복잡도가 임계치를 넘어서는 시점에 Kafka를 도입하여 Event-Driven Architecture로 고도화한다.

---

## 4. 최종 아키텍처 정리

```
[클라이언트]
    │
    ├─ WebSocket (화상 채팅 내 텍스트 채팅)
    │       Socket.io Room 브로드캐스트
    │
    └─ HTTP Long Polling (예약/조율 채팅)
            GET  /api/chat/poll/{roomId}  → 응답 보류 (최대 30초)
            POST /api/chat/send/{roomId} → 즉시 응답 + MQ 발행
    │
    ▼
[Node.js 채팅 서버]  ← 단일 인스턴스, 모든 채팅 처리
    │                        │
    │ RabbitMQ publish       │ HTTP
    │ (채팅 메시지 저장)       │ (유저 인증, 채팅방 조회)
    ▼                        │
[RabbitMQ]                    │
    │                        │
    │ 구독                    ▼
    └──────────▶ [Spring 기본 서버] ──▶ [PostgreSQL]
```

| 통신 종류 | 방식 | 흐름 |
|---|---|---|
| **화상 채팅 내 텍스트 채팅** | WebSocket (Socket.io) | 클라이언트 → Node.js → Socket.io Room 브로드캐스트 → RabbitMQ → Spring → PostgreSQL |
| **미팅 예약/조율 채팅** | Long Polling | 클라이언트 → Node.js → 대기 중인 클라이언트 즉시 응답 → RabbitMQ → Spring → PostgreSQL |
| **유저 인증 / 채팅방 조회** | HTTP (동기) | Node.js → Spring → PostgreSQL |

**서비스 역할 분리 원칙**:
- **Node.js 채팅 서버**: 소켓/폴링 연결 유지, 실시간 메시지 전달. PostgreSQL에 직접 접근하지 않는다.
- **RabbitMQ**: 채팅 메시지를 Node.js에서 Spring으로 비동기 전달. 두 서버를 느슨하게 결합시킨다.
- **Spring 기본 서버**: 채팅 메시지 영속화 + 유저 인증/인가, 채팅방 생성/조회 등 비즈니스 로직 전담.

---

## 참고 링크

- [Node.js 공식 — 이벤트 루프 이해하기](https://nodejs.org/ko/docs/guides/event-loop-timers-and-nexttick/)
- [Socket.io 공식 가이드](https://socket.io/docs/v4/server-initialization/)
- [Socket.io — Rooms](https://socket.io/docs/v4/rooms/)
- [amqplib (Node.js RabbitMQ 클라이언트)](https://amqp-node.github.io/amqplib/)
- [RabbitMQ 공식 Tutorials (JavaScript)](https://www.rabbitmq.com/tutorials/tutorial-one-javascript)
- [Java Project Loom (Virtual Threads)](https://openjdk.org/projects/loom/)