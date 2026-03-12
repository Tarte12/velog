---
title: 'HTTP 0.9부터 HTTP 3.0까지 버전별 차이'
slug: HTTP-0.9부터-HTTP-3.0까지-버전별-차이
date: 2025-09-01T13:09:47.201Z
tags: []
---
# 0. HTTP?
- **정의**: HTTP(Hypertext Transfer Protocol)은 인터넷에서 **HTML 문서와 같은 리소스들을 가져올 수 있게 해 주는 프로토콜**
- ** 특징**
  1. **무상태성(Stateless)**: 서버가 클라이언트의 상태를 보존하지 않음 => 각각의 요청이 독립적
  2. **비연결성(Connectionless)**: 연결을 주고받은 이후 요청이 끝나면 연결을 끊음 => 연결 유지 비용 감소
  3. **클라이언트-서버 프로토콜**: 클라이언트가 서버에 요청(request)을 보내면, 서버가 그에 대한 응답(response)를 반환

>- **프로토콜(Protocol)**: 데이터 전송을 위한 규칙을 말하며, `HTML`,`이미지`,`동영상`,`음성` 같은 파일도 전송 가능함
>- **클라이언트-서버 프로토콜:** (보통 웹 브라우저) 수신자 측에 의해 요청이 초기화 되는 프로토콜을 의미

# 1. HTTP/0.9(One-Line Protocol)
- HTTP 초기 버전을 구분하기 위해 부르는 버전
- 요청은 단일 라인으로 구성, 리소스에 대한 유일한 메서드는 `GET`
- HTTP 헤더가 존재하지 않아, HTML 파일 내용 자체로 구성
- 상태 or 오류 코드도 없음

```HTML
요청(request)
GET /mypage.html

응답(response)
<HTML>
	My Page
</HTML>
```

# 2. HTTP/1.0
- 요청/응답에 **헤더** 도입 => Meta data 전송을 허용하여 프로토콜을 유연하고 확장 가능하도록 하게 됨
- 헤더의 **Content-Type** 속성으로 HTML 문서 외에 **다양한 문서들**을 주고받을 수 있게 됨
- 응답(response) 시작 부분에 **상태 코드** 라인 추가 => 브라우저의 **성공/실패 파악** 가능
	- 해당 결과에 대한 로컬 캐시 갱신 등의 사용 가능
- 버전 정보와 요청 method가 함께 전송되기 시작
- `POST` 메서드 추가

```HTML
요청(request)
GET /mypage.html HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

응답(response)
200 OK
Date: Tue, 15 Nov 1994 08:12:31 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/html
<HTML>
A page with an image
  <IMG SRC="/myimage.gif">
</HTML>
```
> **한계**
> **기본 비지속 연결** => 링크를 클릭할 때마다(요청 시마다) **새로운** TCP의 handshake 연결이 이뤄짐 
- 커넥션 하나당 요청 하나와 응답 하나만 처리 가능 
- 이 부분이 매우 비효율적
- 서버 부하의 문제

# 3. HTTP/1.1(표준 프로토콜)
> HTTP/1.1은 **지속 연결** => 서버는 응답을 보낸 후 TCP 연결을 그대로 유지
- 전체 웹 페이지를 **하나의 지속 TCP 연결을 통해** 보낼 수 있음
- **파이프라이닝**을 이용한 **지속 연결**을 사용

- HTML의 첫 번째 표준 버전
- **청크된 응답지원**: 응답을 한번에 보내지 않고 청크 단위로 나눠서 전송
- **Keep-Alive 옵션**을 통한 **연결 재사용**: 지정한 옵션(타임아웃) 동안 커넥션을 유지하여 TCP handshacke 비용을 줄일 수 있음
- HTTP **파이프라이닝을 통한 연속적인 요청** 가능: 요청에 대한 **응답을 기다리지 않고**, 여러 요청을 연속적으로 보낸 후 순서대로 응답을 받는 방식

```HTML

요청(request)
GET /en-US/docs/Glossary/Simple_header HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header

응답(response)
200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Wed, 20 Jul 2016 10:55:30 GMT
Etag: "547fa7e369ef56031dd3bff2ace9fc0832eb251a"
Keep-Alive: timeout=5, max=1000
Last-Modified: Tue, 19 Jul 2016 00:59:33 GMT
Server: Apache
Transfer-Encoding: chunked
Vary: Cookie, Accept-Encoding

(content)

```
> **한계**
> **HTTP의 Head Of Line Blocking(HOL)** <= 파이프라이닝의 문제점
- 멀티플렉싱이 아닌 **응답 처리를 미루는 방식** => 응답의 처리를 순차적으로 진행하기 때문에, 결국 **후순위의 응답은 지연될 수밖에 없음**
- 영상 같은 거 받으면 뒤에 데이터 한참 대기해야 함(Blocking)
>
> **Round Trip Time(RTT)**
- 하나의 Connection에 하나의 요청을 처리하는 특성 때문에 latency 증가
>
> **Fat message headers**
- HTTP/1.1 헤더에는 많은 Meta data 존재
- 매 요청 시 중복된 헤더값을 전송하게 되며(별도의 domain sharding을 하지 않았을 경우), 또한 해당 domain에 설정된 cookie 정보도 매 요청 시 헤더에 포함되어 전송함
>
>**Limited priorities**: 우선순위 없음
>**Client-driven Transission**: 정보 요청을 해야만 통신 가능

# 4. HTTP/2.0
>- HTTP/2.0은 **Multiplexed Stream** 적용 => **병렬 처리**로 **HOL 해결**
> - HTTP/2.0은 **Binary frame으로 인코딩**되어 전송 
	- HTTP/1.1은 **일반 텍스트 형식**으로 메시지 전송


- HTTP 메서드 자체는 변경하지 않고, 클라이언트-서버 간 **데이터 포맷 방법과 전송 방법을 변경**한 버전

## Binary frame
- HTTP/1.1까지는 body를 일반 문자열 형태로 전송
- HTTP/2.0부터는 TCP/IP 계층 내 응용 계층에 **바이너리 프레이밍** 추가
- 요청과 응답을 **프레임**이라는 가장 작은 단위로 나누고, 해당 프레임을 평문이 아닌 **바이너리 데이터 형태**로 전송
- 스트림은 여러 개의 프레임(메시지)로 이뤄질 수 있음

## Multiplexed Stream
- **병렬 요청(request)**이 이뤄지는 다중화 프로토콜(Multiplexed Streams)
- **Why?**: HTTP/2.0가 멀티 플렉싱이 가능한 이유는 패킷을 **프레임(Frame) 단위로 세분화해서 순서에 상관없이 받는 쪽에서 조립하도록 설계**했으니까 (프레이밍)
=> **각 메시지를 작은 프레임으로 나누고** => 같은 TCP 연결에서의 요청과 응답 메시지를 인터리빙함

## Stream Prioritization
- 리소스의 우선순위를 설정하는 기능 => **Stream에 우선순위를 부여**해서 인터리빙하고 전달하는 것이 가능
- 이를 용이하게 하기 위해 HTTP/2.0 표준에서는 클라이언트가 요청한 각 스트림이 연관된 **가중치(1~256)와 종속성을 갖도록 허용함**
## Flow Control
- 흐름 제어를 구현하기 위한 특정 알고리즘 지정 X, 개발자가 직접 구현하여 리소스 사용과 할당 제어 가능
- 홉 방식(Hop-by-Hop)이라 proxy 같은 중개자의 흐름 제어 가능
(인데 아직 먼 말인지 모르겠음)

## Server Push
- 단일 클라이언트 요청에 여러 응답을 보낼 수 있는 특징을 통해 => 서버에서 클라이언트에게 필요한 추가적인 리소스를 push하는 기능
## Header Compression
- 연속된 요청의 경우 많은 중복된 헤더의 전송으로 오버헤드 과다 발생 
- 이것을 요청과 응답 헤더 Meta data를 압축해서 오버헤드 감소


# 5. HTTP/3.0(QUIC)
- UDP 기반의 **QUIC 프로토콜**을 사용
- **향상된 멀티플렉싱 스트림 제공**
	- 스트림을 **독립된 식별자**로 구분 => 특정 스트림에 오류 발생 시 **해당 스트림만 중단**되도록 하고, 해당 패킷 수정(다른 스트림에는 영향 X)
    - TCP는 특정 스트림에 오류가 발생하면 해결될 때까지 다음 요청들도 대기
>**QUIC**
>- Quick UDP Internet Connections
>- **TCP를 대체**하는 범용 목적의 전송 계층(Transport Layer) 통신 프로토콜로 구글에서 만들었음
>- TCP의 Stream은 하나의 chain으로 연결되지만, QUIC는 각 Stream당 독립된 Stream chain을 구성하여 TCP HOL Bloking을 해결
>- UDP와 동일하게 Transport Layer에서 구동되지만, **UDP 위에 새로운 계층을 추가함으로써 신뢰성** 확보
>- 추가된 계층은 TCP에 존재하는 패킷 재전송, 혼잡 제어, 속도 조정 및 다른 기능 제공

# 추가
## 멀티플렉싱
### HTTP/1.0 브라우저 => 여러 개 병렬 TCP 열자
- **여러 개의 병렬 TCP 연결을 열어서 HOL 블로킹 문제 해결** 
- 같은 웹 페이지에 있는 객체들은 **브라우저로 병렬적으로 전송**되어 왔고, 작은 객체들이 훨씬 빠르게 전달 되면서 **사용자의 지연 감소**
- 대부분의 **HTTP/1.1은 6까지 병렬 TCP 연결**을 열 수 있으며, **HOL 블로킹을 막을뿐만 아니라 더 많은 대역폭을 사용할 수 있게 함**
### HTTP/2.0 => 병렬 TCP를 줄이자
- 서버에서 열고 유지될 때 **필요한 소켓의 수를 줄일 뿐만 아니라**, **목표한 대로 TCP 혼잡 제어를 제어할 수 있게**하는 게 HTTP/2.0의 주요 목적
- 오직 하나의 TCP 연결만을 사용할 경우 => **HOL 블로킹을 피하기 위해 신중하게 구현된 메커니즘**이 필요

**[참고]**
1. https://csj000714.tistory.com/733
2. https://guiyomi.tistory.com/105