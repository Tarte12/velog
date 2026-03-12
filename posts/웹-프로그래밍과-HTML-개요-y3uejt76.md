---
title: '웹 프로그래밍과 HTML 개요'
slug: 웹-프로그래밍과-HTML-개요-y3uejt76
date: 2024-12-17T11:49:27.743Z
tags: ['JavaScript', 'html', '학교']
---
**<계절학기 과목>**

## 웹 개요

### 웹 사이트의 구축
- 웹 서버로 사용할 컴퓨터에 웹 서버 SW 설치
- 웹 페이지, 동영상, 이미지 저장, DB 설치
- 웹 서버 응용 프로그램 개발 및 설치

### 웹 서버 소프트웨어
#### 웹 서버 소프트웨어 기능
- 웹 브라우저로부터 요청 해석
- 필요한 웹 서버 응용 프로그램 작동
- 웹 서버 응용 프로그램의 실행 결과를 웹 브라우저로 전송
#### 웹 서버 소프트웨어 종류
- Apache -> Apache
- MS -> IIS
- NGINX -> nginx

### 웹 서버 응용 프로그램
#### - 사용자에게 제공하는 다양한 서비스를 제공해 주도록 하는 프로그램
#### - 웹 사이트 목적을 이행하는 서버 측 소프트웨어 
EX) 번역 사이트 -> 번역 웹 서버 응용 프로그램 필요
#### 웹 서버 응용 프로그램 개발 언어
- 서버용 JS : Node.js
- JSP : java의 스크립트 언어
- java 서블릿

### 웹 문서 VS 전자 문서
#### 전자문서(Electronic Document)
- 워드, 한글, 메모장으로 작성하는 문서
- 하나의 문서는 하나의 파일
- 페이지 별로 파일 저장 X
#### 웹 문서(Web Document, HTML Document)
- HTML 언어로 작성/웹 브라우저로 보기
- 웹 문서는 페이지 단위로 파일에 분할하여 저장
- 웹 페이지 : 텍스트만 저장, 웹 페이지에 이미지/그래픽/동영상 파일의 이름으로 연결
- 웹 페이지들의 연결 : 하이퍼링크 이용
**하이퍼링크 : 다른 웹 페이지의 주소를 가진 텍스트 정보
- 웹 문서 읽는 순서는 사용자가 결정

### 웹 페이지의 주소, URL(Uniform Resource Locator)
 < http://www.oracle.com:80/technetwork/java/index.html >
- http: -> 프로토콜 : HTTP, https, file, ftp, telnet, mailto, news 등
- www.oracle.com -> 서버 주소 : 웹 페이지를 가진 컴퓨터의 인터넷 주소, IP 주소
- :80 -> TCP/IP 포트 번호 : 서버가 브라우저로부터 접속을 기다리는 TCP/IP 포트 번호
- technetwork/java -> 웹 서버 내 웹 페이지 파일의 폴더 경로
- index.html -> 웹 페이지의 HTML 파일 이름

### 웹 브라우저와 웹 서버 사이의 통신, HTTP
#### 웹 페이지, 이미지 등의 자원을 HTTP를 통해 송수신
-> HTTP 통신은 웹 브라우저가 요청 => 웹 서버가 응답하는 방식
### 웹의 성공
- 만들기 쉬운 웹 문서
- 효율적인 HTTP 통신
- 웹 서버와 웹 브라우저의 작업 분담

## 웹 페이지 구성
### 웹 페이지 구성 3요소
#### - 웹 페이지의 구조와 내용 : HTML 
-> 제목, 본문, 장, 절 등의 구조와 각 내용은 HTML 태그로 작성
#### - 웹 페이지의 모양 : CSS(Cascading Style Sheet)
-> 웹 페이지가 브라우저에 출력되는 모양을 CSS로 선언하여 적용 가능
#### - 웹 페이지의 행동 및 응용 프로그램 : Javascript
->사용자의 마우스 클릭, 키 입력 등을 처리하는 코드 작성
-> 계산, 차트 생성, 게임, 그래픽 등의 다양한 종류의 응용 프로그램 작성
#### - 웹 페이지는 구성 3요소를 분리하여 작성해야 함
-> 문서의 구조와 내용을 바꾸지 않고 출력 모양을 바꾸거나 기능만 변경하여 쉽게 변화를 주는 것이 가능하기 때문

## HTML, CSS, Javacript로 분리된 웹 페이지 만들기
```
<!DOCTYPE html>
<html>
<head>
<title>웹 페이지의 구성요소</title>
<style>
	body { background-color : linen; color : green; margin-left : 40px;
	margin-right : 40px;}
	h3 {text-align : center; color : darkred;}
	hr { height : 5px; border : solid grey; background-color : grey }
	span { color : blue; font-size : 20px;}
</style>
<script>
	function show() { // <img>에 이미지 달기
	document.getElementById("fig").src="Elvis.png";
	}
	function hide() { // <img>에 이미지 제거
	document.getElementById("fig").src="";
	}
</script>
</head>
<body>
<h3 onmouseover="show()" onmouseout="hide()">Elvis Presley</h3>
<hr>
<div><img id="fig" src=""></div>
He was an American singer and actor. In November 1956, he
made his film debut in <span>Love Me Tender</span>. He is
often reffered to as "<span>the King of Rock and Roll</span>".
</body>
</html>
```



## HTML5
### HTML
- 표준화된 태그로 웹 페이지를 작성하는 언어
### HTML5 기능
#### HTML5 전체 기능은 크게 두 부분으로 구분
1. 웹 문서 작성을 위한 HTML 태그 셋
2. 웹 애플리케이션 작성을 위한 API
#### HTML5 세부 기능 (1)
1. 웹 폼 : 사용자로부터 입력을 위한 다양한 태그와 속성 제공
2. 오디오, 비디오
- 오디오/비디오 재생 HTML 태그 지원
- 별도의 플러그인 설치 없이 재생 가능
- 자바스크립트 코드로 오디오, 비디오의 재생, 중지 등의 제어 가능
3. Canvas
- canvas 태그와 자바스크립트를 이용하여, 웹 브라우저 상에서 동적으로 2,3차원 그래픽을 그릴 수 있는 API
- 차트 생성, 애니메이션 생성, 게임 등 GUI 기반의 웹 애플리케이션 생성 가능
 4. SVG : XML로 표현하는 2차원 벡터 그래픽 API

 5. 웹 스토리지
 - 웹 브라우저가 실행되는 로컬 컴퓨터에 데이터 저장을 가능하게 해 주는 API
 - 쇼핑몰, 게임 등에서 발생하는 데이터를 사용자의 컴퓨터에 저장
 6. 웹 SQL 데이터베이스 : 로컬 컴퓨터에 DB를 두고 표준 SQL로 활용할 수 있는 API
 7. 인덱스 데이터베이스
 - 로컬 컴퓨터에 대용량 데이터를 저장, 인덱스를 이용하여 검색하는 API
 - 데이터를 다루는 광범위한 웹 애플리케이션 구현 가능
 8. 파일 입출력
 9. 위치 정보 API
 10. 웹 워커 : 백그라운드 작업을 만들 수 있는 API
 11. 웹 소켓 : 웹 애플리케이션이 웹 서버에서 실행되는 응용 프로그램과 직접 통신할 수 있도록 지원하는 API
 12. 오프라인 웹 애플리케이션
###  HTML5 문서 편집
- 텍스트 편집기
- WYSIWYG 편집기
- 문서 편집기 -> VS Code 쓸 것 같음




