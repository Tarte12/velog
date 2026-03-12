---
title: 'Study) 1회차 Daily'
slug: Week-1
date: 2025-05-20T12:22:33.264Z
tags: ['1주차', '코테스터디', '프로그래머스입문100문제']
---
**5/20**
# 코딩테스트 입문 1~22번
## 조건문 오류 정리
- 실수: `if angle > 0 AND angle < 90 :`
- 정답: `if angle > 0 and angle < 90:`
- 파이썬은 논리 연산자에 소문자 `and`만 사용
## for문 문법 차이
```
#Python
for i in range(1, n+1) #1부터 n까지
for x in numbers: # 리스트 순회

#Java
for (int i = 1, i <= n; i++) #range와 유사
for (int x : numbers) #리스트 순회와 같음
```
- 파이썬에서 `range`는 인덱스 기반 반복, 리스트는 직접 요소 순회
## 문자열 포함 여부
```
#Python
if str2 in str1:
	return 1
else:
	return 2

#Java
if(str.contains(str2)){
	return 1;
}
else {
	return 2;
}
```
## 리스트 뒤집기 & 문자열 뒤집기
`[::-1]`: 리스트, 문자열 모두 뒤집기 가능
- 시퀀스 자료형(문자열, 리스트, 튜플 등) 모두 슬라이싱 가능

## 제곱수 판별 개선
```
#기존
if i in range(1, n+1):
	if i*i == n:
    	retur 1
return 2

#개선
import math
if math.isqrt(n)**2 == n:
	return 1
else:
	return 2
```
- `math.isqurt()` 사용하면 **정수 제곱근** 구할 수 있음 => 속도 향상

## 특정 문자 제거
- `replace()` 사용
```
return my_string.replace(letter, '')
#my_string 문자열에서 letter(라는 글자를) ''으로 대체한다 => 제거
```
## 문자열 반복과 결합
### 문자열 반복
```
"hello" * 3 => hellohellohello
```
### 문자열 누적 결합
```
res = ''
for i in my_string:
	res += i * n
```
### join()으로 반복 문자열 결합
```
''.join(i * n for i my_string)
```