---
title: 'BOJ 단계별 (5) : 문자열'
slug: BOJ-단계별-17-조합론
date: 2025-05-19T10:25:02.567Z
tags: []
---
# 11654
## 코드
```
c = input()
print(ord(c))
```
## 정리
1. ord(): 문자 1개를 입력받아서, 그 문자를 아스키 코드값(정수)로 반환하는 함수
2.chr(): 아스키 코드(정수)를 입력받아서, 해당하는 문자를 반환

# 10809 (보류)
=> s.find()함수 사용 (나중에 다시 풀기)

# 2675 (보류)
=> 자바랑 파이썬이랑 헷갈려서 왜 안 되나 한참 고민하고 있음 (근데 자바면... 삼중루프가 떠오르지 않나???)
=> 자바랑 비교해서 정리해 놓고 문제는 나중에 다시 풀기 (좀 까먹어야 됨)

## 코드
## 정리
```
T = int(input())

for _ in range(T):
    R, S = input().split()
    R = int(R)

    for ch in S:
        print(ch * R, end='')
    print()

```
1. for ch in S:
- 파이썬의 문자열은 반복 가능(iterable) 객체
- "ABC" => 내부적으로 ['A', 'B','C']처럼 동작
- 따라서 문자열을 문자 단위로 for 루프로 순회 가능
```
java
String S = "ABC";
for(int i=0; i < S.length(); i++)
	char ch = S.charAt(i);
```

2. ch * R?
```
파이썬
'A' * 3 => 'AAA'
java
for(int i=0; i < R; i++)
	System.out.print(ch)
```

# 1152
## 코드
```
str = list(input().split())

print(len(str))
```

# 2908

## 코드
```
A, B = input().split() #문자열로 숫자 입력 받음

re_A = int(A[::-1])
re_B = int(B[::-1])

if re_A >= re_B:
	print(re_A)

else:
	print(re_B)
```

## 정리

1. [::-1]
- 시퀀스(문자열, 리스트 등)를 뒤집어서 반환
```
s = "hello"
print(s[::-1])  # → 'olleh'

```
2. 슬라이싱 구조
```
s[start:stop:step]

- start: 시작 인덱스(생략 가능)
- stop: 끝 인덱스(생략 가능)
- step: 증가량(음수면 역방향)

[::-1]
- 처음부터
- 끝까지
- step = -1 => 역순으로 하나씩 이동
```

3. 문자열 [::-1] 가능?
- 파이썬 문자열은 불변(immutable)
- 슬라이싱으로 새로운 문자열 반환 가능
```
word = "python"
reversed_word = word[::-1]
print(reversed_word)  # 'nohtyp'
```

4. 리스트 [::-1] 가능?
```
lst = [1, 2, 3, 4]
print(lst[::-1])  # [4, 3, 2, 1]
```

# 5622 (뭔가 안 읽혀서 보류)

# 11718 (몇 줄 입력하는 건지 모르는데??)

