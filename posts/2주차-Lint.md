---
title: '[2주차] Lint'
slug: 2주차-Lint
date: 2025-12-28T08:45:27.123Z
tags: []
---
> 추가적으로 궁금하지만 정리하지 않은 것들은 ✨ 표시를 해 놓았다.

이번 프로젝트에서는 본격적으로 작업을 들어가기 이전에 각종 컨벤션 규칙 등을 세세하게 결정하는 회의를 진행하였고, 이 과정에서 코딩 컨벤션을 위한 Lint 도입을 결정하게 되었다.

하지만 코드 컨벤션 자체도 처음이고, Lint는 더더욱 처음이기 때문에 코드 컨벤션을 위한 도구인 Lint에 대해 알아보자.

## 1. 코드 컨벤션이란?
프로그래밍 언어로 작성된 각 측면에 대한 프로그래밍 스타일, 관행 및 방법을 권장하는 규칙으로, 일반적으로 <span style="background-color: #fbdea2">들여쓰기, 주석, 선언, 문장, 공백, 명명 규칙, 프로그래밍 관행, 프로그래밍 원칙, 프로그래밍 경험 법칙, 아키텍처 모범 사례</span> 등을 다룬다. 이를 통해 소프트웨어 구조적 품질을 지키는 것을 지향한다.

일관적인 코딩 컨벤션을 가지면 가독성이 올라가고 안티패턴을 방지할 수 있으며, 그 결과로 버그가 줄고 유지보수성이 향상된다. 그리고 더욱 편리하게 이 코딩 컨벤션을 지키기 위해 사용하는 정적 분석 도구들이 있는데, 이것들을 Lint라고 보면 된다. 이러한 도구들을 활용하면 사람이 직접 관여하지 않아도 많은 부분들을 기계적으로 잡아낼 수 있다.

우리 팀 프로젝트의 경우 FE는 ESLint + Prettier 조합으로, BE는 Checkstyle를 사용할 것이기 때문에 특정 툴에 대한 이해도도 필요하다.

> ✨ FE의 경우 ESLint를 많이 사용하는 것 같은데, BE의 경우 왜 Checkstyle을 채택했는지 궁금했다. 아래 링크만 봐도 해당 내용에 대한 의문이 풀려 첨부한다.
**[코드분석도구]# 3 SonarLint, SonarQube**: https://jiwondev.tistory.com/160
**Checkstyle vs SonarQube**: https://stackshare.io/stackups/checkstyle-vs-sonarqube

> ✨ 코드 컨벤션의 필요성을 잘 정리한 글이 있어 첨부하는데, 시간이 남는다면 코드 컨벤션에 대한 정리도 작성하면 좋을 것 같다.
**주니어 개발자가 코드 컨벤션을 처음 시작할 때**: https://code-kirin.me/blog/code-guide/convention/

## 2. ESLint
FE 툴인 ESLint는 생태계 내 다양한 플러그인을 통해 넓은 범위의 코딩 컨벤션을 커버할 수 있다. 하지만 기존에 정해진 규칙만으로는 다양한 조직에 맞는 적절한 규칙을 다 커버할 수 없으며, 사내 라이브러리 내 사용 방식에 의한 컨벤션을 정의하거나, 조직 내 컨벤션과 커뮤니티 통용 컨벤션의 간극이 존재할 수 있다. 따라서 ESLint는 직접 규칙을 정의할 수 있는 방법을 제공한다.

### 2.1 ESLint는 어떻게 규칙을 적용할까?
ESLint는 <span style="background-color: #fbdea2">Abstract Syntax Tree(AST)</span>를 이용해서 규칙을 정의하고 적용한다. AST는 소스 코드를 읽은 뒤 각 코드에서 구문 정보를 정리해 나타낸 트리 형태의 자료 구조로,  보통 AST Explorer라는 도구를 사용하면 소스 코드를 넣었을 때 어떤 AST가 나오는지 쉽게 확인할 수 있다.

### 2.2 ESLint에서 사용할 규칙은 어떻게 직접 정의할까?
ESLint는 espree라고 하는 파서를 통해 소스 코드를 파싱하고, 이 결과를 각 플러그인에서 순회하며 규칙을 실행한다. 원하는 규칙을 플러그인을 통해 정의하면 실행할 수 있다.

Espree AST를 읽을 수 있다면 ESLint 규칙도 쉽게 만들 수 있고, 작성된 규칙을 ESLint에 추가하면 컨벤션 규칙에 맞지 않는 코드를 작성했을 때 알려줄 수 있다.

### 2.3 ESLint 플러그인은 어떻게 생성할까?
공식 문서를 확인해 보자.
**플러그인 생성**: https://eslint.org/docs/latest/extend/plugins

### 2.4 추가 ESLint 관련 글들
**ESLint와 AST로 코드 퀄리티 높이기**: https://toss.tech/article/improving-code-quality-via-eslint-and-ast
**eslint-plugin-unicorn**: https://www.npmjs.com/package/eslint-plugin-unicorn

## 3. Prettier
정해진 규칙에 따라 코드를 검사 및 수정해 주는 것은 포매터가 하고, 코드의 구조를 검사해서 정적 분석해 주는 것은 린터가 해 주는데, Prettier는 코드 포맷터 기능을 하는 JS 자이브러리다. 보통 실제 프로젝트에서는 Prettier를 ESLint 같은 린터와 통합해서 사용한다.

Prettier를 사용하기 위한 자세한 설명은 아래 링크를 참고하면 될 것 같다.
(정리할 필요성은 모르겠고 사용할 때 참고해서 사용하면 될 것 같다.)
**코드 포맷팅은 그냥 Prettier에게 맡기세요**: https://www.daleseo.com/js-prettier/
**포매터와 린터**: https://velog.io/@jeris/%ED%8F%AC%EB%A7%A4%ED%84%B0%EC%99%80-%EB%A6%B0%ED%84%B0

## 4. Checkstyle
흠... 왜 자바 린터 얘기 찾기가 어렵지??? 왤까...

확실한 건 아니지만 FE에서 Prettier + ESLint 조합을 쓰는 것처럼 Code style + Checkstyle 조합을 쓰는 듯한데 필수인 건지는 찾아봐야 할  것 같다.

내용은 추가적으로 보지 않아도 될 것 같고 사용 방법만 참고하면 될 듯하다.
**[Intellij]CheckStyle, Code Style(Formatter) 설정**: https://blog.naver.com/hj_kim97/223527495273
