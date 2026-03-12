---
title: '99클럽 코테 스터디 4일차 TIL + 문자열 탐색, replace() (ing)'
slug: 99클럽-코테-스터디-4일차-TIL-문자열-탐색-replace-ing
date: 2024-10-31T12:01:11.442Z
tags: []
---
## 키워드
1. 문자열에서 특정 문자열 치환 : replace()
2. 문자열을 숫자로 변환 : Integer.parInt()
## 놓친 개념
1. replace() : 문자열의 일부를 다른 문자열로 바꾸는 메서드
> String s = "one23four";
s = s.replace("one", 1);
	 .replace("four", 4);
     -> 결과 : 1234 나옴
2. Integer.parInt() : 문자열을 정수로 변환
- int형으로 반환하여야 하는 부분을 못 읽고 처음에 문자열 형태로 반환함
- 저번 문제와 다르게 범위 내의 값이므로 사용해도 문제없음
