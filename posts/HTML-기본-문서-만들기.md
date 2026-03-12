---
title: 'HTML 기본 문서 만들기'
slug: HTML-기본-문서-만들기
date: 2024-12-19T13:29:45.123Z
tags: ['CSS', 'JavaScript', 'TIL', 'html', '학교']
---
## HTML5 개요
### HTML5 페이지 기본
#### HTML5 문서의 기본 구조
```
<!DOCTYPE html>
<!--이 부분은 주석문입니다. 웹 브라우저는 주석을 화면에 출력하지 않습니다.-->
<html>
<head>
문서제목, 자바스크립트 코드, CSS 스타일 정의, 메타데이터정의
</head>
<body>
문서의 본문 텍스트, 이미지, 테이블, 자바스크립트 코드, 동영상 등
</body>
</html>

- <!DOCTYPE html> - HTML5 문서임을 알리는 지시어
-> **반드시 문서의 최상단에 작성.** HTML 태그가 아니다. 

- 헤드부분(<head>와 </head>로 둘러싸인 부분)
-> 문서의 제목, 본문을 설명하는 메타 태그들, 자바스크립트 코드, CSS 등을 포함
-> 문서의 본문은 포함되지 않음

- 바디부분(<body>와 </body>로 둘러싸인 부분)
-> 문서의 내용을 표현하는 부분
-> 자바스크립트 코드를 포함할 수 있다. 

**- 헤드와 바디 사이에는 아무것도 들어갈 수 없다.**

- HTML문서의 구성 원소는 태그

- HTML5 페이지의 필수 태그
-> <html>, <head>, <title>, <body> 태그는 HTML5 문서의 필수 태그
```
### HTML 태그의 특징
#### HTML 태그 구성
- 태그 이름과 여러 속성들로 구성
- 하나의 속성 = 속성 이름 + 값
![](https://velog.velcdn.com/images/emprimula/post/4853e201-7382-4a78-99a1-700557d25258/image.PNG)

## HTML5 기본 문서 만들기 (1)
```
<!DOCTYPE html>
<html>
    <head>
        <title>첫 타이틀</title>
    </head>
    <body>
        <H1 title="h1 태그로 작성하였습니다.">1장 홈페이지 만들기</h1>
        <h2 title="h2 태그로 작성된 부분">1절 HTML 언어</H2>
        <h3>1. 웹</h3>
        <h4>1.1 인터넷</h4>
        <h5>1.1.1 네트워크</h5>
        <h6>1.1.1.1. 통신</h6>
        글자들의 크기 비교
        <hr>
        <p>
            HTML 문서도 본문을 여러 단락으로 <br>
            나눌 수 있다. CSS 스타일을 사용하면 <br>
            단락 단위로 내어 쓰기와 들여 쓰기가 가능하다.</p>
        <hr>
            <p>
        여러 개의 빈 칸은 하나로 취급되며, 
        엔터 키 역시 하나의 빈 칸으로 처리된다.</p>
        <p>
            <pre>   동해물과 백두산이 마르고 닳도록
                            대한사람 대한으로 길이 보전하세~ </pre>        
        </p>
        <hr>
        종료태그 &lt;/hr&gt;를 사용하지 않는다. 
        &copy;copyright ~ <br>
        &sum;누적합계를 구한다. <br>
        <hr>
        텍스트 꾸미기
        <hr>
        <p>
            <b>진하게</b><br>
            <strong>중요한</strong><br>
            <em>강조</em><br>
            <i>이탤릭으로 강조</i><br>
            <b><i>진하게 이탤릭으로 강조</i></b><br>
            보통 문자 <small>한 단계 작은 문자</small><br>
            <del>삭제</del><br>
            <ins>추가</ins><br>
            보통문자의 <sup>윗첨자</sup><br>
            보통문자의 <sub>아래첨자</sub><br>
            <mark>하이라이팅</mark><br>
            </p>
            </body>
    </body>
</html>
```
## HTML5 기본 문서 만들기 (2)
```
<!DOCTYPE html>
<html>
    <head>
        <title>&lt;div&gt;블록과&lt;span&gt;인라인      </title>
        <style>
            span{color: red}
        </style>
    </head>
    <body>
        <h3>사랑</h3>
        <hr>
        <div style="background-color:skyblue; padding:20px;">
            내가 사람의 방언과 천사의 말을 할지라도
            <span>사랑</span>이 없으면
            소리 나는 구리와 울리는 꽹과리가 되고, 
            <span>사랑</span>이 없으면 아무
            것도 아니라. 
        </div>
        <p>
        ~우리 서로 사랑하며 살아요~
        </p>
    </body>
    </html>
```
### 메타 데이터 삽입
#### 메타 데이터 : 데이터를 설명하는 데이터
- 사진 데이터의 메타 데이터 : 사진 찍은 장소, 시간
- 오디오 데이터의 메타 데이터 : 재생 시간, 채널 수
- 이미지 데이터의 메타 데이터 : 이미지의 폭, 높이, 컬러 해상도
#### HTML에서의 메타 정보를 표현하는 태그
```
<base>, <link>, <script>, <style>, <title>, <meta>

- 메타 데이터들은 <head> 태그 안에 작성
ex
<head>
<base href="http://www.mysite.com/score/">
</head>
- <script> 태그는 <body> 태그 내에서 작성 가능
```
## HTML5 고급 문서 만들기
```
- 이미지 삽입 : <img> 태그
<img src="이미지 파일의 url"
	 alt="문자열"
     width="이미지 폭"
     height="이미지 높이">
```
```
- 리스트 사용
<!DOCTYPE html>
<html>
<head>
<title>ZZZ 파티 구성</title>
</head>
<body>
<h3> 미야비 </h3>
<hr>
<img src="imags/miyabi.png"
     alt="미야비"
     width="300"
     height="500">
<hr>
<ul>
    <li>파티 포지션 조합
        <ul>
            <li> 강공 + 격파 + 지원
            <li> 이상 + 방어 + 지원
            <li> 이상 + 이상 + 지원
        </ul>
    <li> 임시 에이전트 조합
        <ol type="1">
            <li> 미야비 + 콜레다 + 벤
            <li> 미야비 + 소우카쿠 + 하루마사
            <li> 미야비 + 엔비(콜레다) + 하루마사
        </ol>
        <li> 1.5버전에 아스트라 데려오기 : 서폿
        <li> 미야비 추가 능력 활성화 조건 : 지원 특성
    </body>
</html>
```
-> 배운 걸로 직접 응용해 본 코드
- 결과물 (리스트만 이용)
![](https://velog.velcdn.com/images/emprimula/post/57e484aa-c02f-40f9-80b4-a9096696fe14/image.PNG)
```
<!DOCTYPE html>
<html>
<head>
<title>ZZZ 파티 구성</title>
</head>
<body>
<h3> 미야비 </h3>
<hr>
<img src="imags/miyabi.png"
     alt="미야비"
     width="300"
     height="500">
<hr>
<ul>
    <li>파티 포지션 조합
        <ul>
            <dt> <strong>강공 + 격파 + 지원</strong>
            <dd> 격파캐로 그로기 -> 콤보 스킬 발동 -> 지원캐로 마무리 -> 강공캐가 그로기 때 딜링
            <dt><strong>이상 + 방어 + 지원</strong> 
            <dd> 방어캐로 실드/버프 -> 지원캐 버프 -> 이상캐가 온필드 딜링
            <dt><strong>이상 + 이상 + 지원</strong>
            <dd> 둘 이상의 속성 이상 중첩인 <strong>'혼돈'</strong>반응을 이용, 이상캐 둘을 계속 교체하여 속성 이상을 쌓음
        </ul>
    <li> 임시 에이전트 조합
        <ol type="1">
            <li> 미야비 + 콜레다 + 벤
            <li> 미야비 + 소우카쿠 + 하루마사
            <li> 미야비 + 엔비(콜레다) + 하루마사
        </ol>
        <li> 1.5버전에 아스트라 데려오기 : 서폿
        <li> 미야비 추가 능력 활성화 조건 : 지원 특성
    </body>
</html>
```
- 결과물(정의 리스트 추가)
![](https://velog.velcdn.com/images/emprimula/post/eec01839-e746-4ce3-ab8e-7a88b83e0656/image.PNG)





