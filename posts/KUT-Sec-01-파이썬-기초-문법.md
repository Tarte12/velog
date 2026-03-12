---
title: '[KUT] Sec 01 파이썬 기초 문법'
slug: KUT-Sec-01-파이썬-기초-문법
date: 2025-08-22T06:07:27.023Z
tags: []
---
# 1. 반복문을 이용한 문제 풀이
## 예제 문제
### 1. 1부터 N까지 홀수 출력하기
```python
n = int(input())
for i in range(1, n+1):
	if i % 2 == 1:
    	pirnt(i)
```
### 2. 1부터 N까지 합 구하기
```python
n = int(input())
sum = 0
for i in range(1, n+1):
	sum += i
print(i)
```
### 3. N의 약수 출력하기
```python
sol = []
n = int(input())
for i in range(1, int(n**(1/2))+1):
	if n % i == 0:
    	sol.append(i)
return sol
```

# 2. 문자열과 내장함수
- `변수.upper()`: 모든 문자열 -> **대문자**
- `변수.lower()`: 모든 문자열 -> **소문자**
- `변수.find('a')`: 'a'의 **인덱스 번호** 찾는 함수
- `변수.count('a')`: 해당 문자열에 **'a'가 몇 개 있는지** 세는 함수
- `변수[:2]`: 0부터 2까지 자르는 함수 (**슬라이스**)
- `len(문자열)`: 문자열 **길이** 구하는 함수
- `isalpha()`: 알파벳인지 판별하는 함수
- `isupper()`, '`islower()`: 대문자인지, 소문자인지
- `ord('A')`: 아스키 -> 숫자
- `char(65)`: 숫자 -> 아스키

# 3. 리스트와 내장함수
- `a=[]` or `a=list()`: 빈 리스트 
- `a.append(값)`: 추가
- `a.insert(인덱스, 값)`: 삽입
- `a.pop()`, `a.pop(인덱스)`, `a.remove(값)`: 삭제
- `c=a+b`: 합치기
- `a.sort()`: 오름차순 정렬
- `a.sort(reverse=True)`: 내림차순 정렬
- `a.clear()`: 비우기
- `a[:3]`: 인덱스 0, 1, 2 해당값 출력

#### 인덱스, 값 같이 출력(튜플)
```python
for x in enumerate(a):
	print(x)

for x in enumerate(a):
	print(x[0], x[1])
    
for index, value in enumerate(a):
	print(indax, value)
```
- 튜플은 생성한 후 값 변경 X

#### 조건: all, any
- all = 조건이 모두 참이면 true, 하나라도 틀리면 false
- any = 조건이 하나라도 참이면 true
```python
# all
if all(60>x for x in a): 
	print("YES")
else:
	printt("NO")

# any
if any(60>x for x in a): 
	print("YES")
else:
	printt("NO")

```
# 4. 2차원 리스트 생성과 접근
- `a=[[0]]*3 for _ in range(3)]`
	- `[[0, 0, 0], [0, 0, 0], [0, 0, 0]]`
    - **행 -> 열** 순서로 탐색
    - 알고리즘 문제에서 **표(행렬)**로 생각하는 게 좋음
    
# 5. 함수 만들기
## 소수 판별하는 함수 만들기
- `math.sqrt(x)`: x의 제곱근을 반환하는 함수 (반환형 float)
```python
import math
def is_prime(x):
 if x < 2:
 	return false
 for i in range(2, int(math.x)) + 1):
	if x % i == 0:
    	return false
 return true
```
# 6. 람다함수
- 익명 함수 or 람다 표현식이라고도 부름
```python
# 일반 함수
def plus_one(x):
	return x + 1
print(plus_one(1))

# 람다 함수 
plus_one = lambda x: x + 1

#람다 함수는 표현식!
a = [1, 2, 3]
print(list(map(plus_one, a)))

print(list(map(lambda x: x+1, a)))
```