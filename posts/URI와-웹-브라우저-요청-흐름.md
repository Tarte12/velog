---
title: 'URI와 웹 브라우저 요청 흐름'
slug: URI와-웹-브라우저-요청-흐름
date: 2025-03-03T09:09:30.085Z
tags: []
---
## URL

### URI(Uniform Resource Identifier)

**URI? URL? URN?**
- "URI는 로케이터(locator), 이름(name) 또는 둘 다 추가로 분류될 수 있다"

![](https://velog.velcdn.com/images/emprimula/post/b12128c9-2b6d-4689-92b0-5a7ea8b3c243/image.png)

![](https://velog.velcdn.com/images/emprimula/post/a6926cd9-830a-4cee-a694-282a048edb47/image.png)

### URI 단어 뜻
- Uniform : 리소스 식별하는 통일된 방식
- Resource : 자원, URI로 식별할 수 있는 모든 것(제한 없음)
- Identifier : 다른 항목과 구분하는데 필요한 정보

- URL : Uniform Resource Locator
- URN : Uniform Resource Name

### URL, URN 단어 뜻
- URL-Locator : 리소스가 있는 위치를 지정
- URN - Name : 리소스에 이름 부여
- 위치는 변할 수 있지만, 이름은 변하지 않음
- urn:isbn:8960777331 (어떤 책의 isbn URN)
- URN 이름만으로 실제 리소스를 찾을 수 있는 방법이 보편화되지 않음
** - 앞으로 URI를 URL과 같은 의미로 얘기하겠음 **

### URL 전체 문법
![](https://velog.velcdn.com/images/emprimula/post/51b78d91-0830-4a69-86c8-09423ff0ad59/image.png)

#### scheme
- 주로 프로토콜 사용
- 프로토콜 : 어떤 방식으로 자원에 접근할 것인가 하는 약속 규칙
=> ex) http, https, ftp 등등
- http는 80 포트, https는 443 포트 주로 사용, 포트 생략 가능
- https는 http에 보안 추가(HTTP Secure)

#### userinfo
- URL에 사용자 정보를 포함해서 인증
- 거의 사용하지 않음

#### host
- 호스트명
- 도메인명 or IP 주소 직접 사용 가능

#### PORT
- 포트(PORT)
- 접속 포트
- 일반적으로 생략, 생략 시 http는 80, https는 443

#### path
- 리소스 경로(path), 게층적 구조
- ex) /home/file1.jpg, /members, /members/100

#### query
- key=value 형태
- ?로 시작, &로 추가 가능, ?keyA=valueA&keyB=valueB
- query parameter, query string 등으로 불림, 웹 서버에서 제공하는 파라미터, 문자 형태

#### fragment
- html 내부 북마크 등에 사용
- 서버에 전송하는 정보 X



## 웹 브라우저 요청 흐름