---
title: 'BOJ 단계별 (13) : 정렬'
slug: BOJ-단계별-13-정렬
date: 2025-05-15T15:52:01.164Z
tags: []
---

## 2750
### 풀이
```
N = int(input())

lst = []

for _ in range(N):
    
    num = int(input())
    lst.append(num)
    

lst.sort()

for i in lst:
    print(i)
```
## 2587
```

lst = []

for i in range(5):

	num = int(input())
	lst.append(num)

lst.sort()

print(sum(lst)//5)
print(lst[2])

```
## 25305
## 내 코드
```
N, k = map(int, input().split())


score = list(map(int, input().split()))

score.sort(reverse=True)

print(score[k-1])
```
## 오답노트

```
1. values = list(map(int, input().split()))
- 몇 개의 값이 들어올지 몰라도 list 형태로 값을 입력 받을 수 있음
- 처음에 for문을 작성하여 입력받으려 했으나 ValueError가 남
```
## 2751
### 내 풀이
```
#N = int(input())

import sys

N = int(sys.stdin.readline())

num_lst = []

for i in range(N):

	num = int(sys.stdin.readline())
	num_lst.append(num)

num_lst.sort()

for i in range(N):

	print(num_lst[i])
```
## 정리
```
1. for i in range(N) : 0부터 N-1까지 순회
=> 인덱스 [0]부터 순회할 거라 문제 없는데 착각해서 i-1 사용

2. sys.stdin.readline() 사용
- 입출력 많을 땐 input()이 시간이 오래 걸려서 시간 초과가 뜸
- input() = sys.stdin.readline()
- import sys 작성 필요
- print() = sys.stdout.write()
```
## 10989 (보류)
=> 메모리 초과 어떻게 해결해야 하는 건지 모르겠음
=> 계수 정렬에 대해 알아보기
## 1427
### 내 코드
```
nums = list(map(int, input()))

nums.sort(reverse=True)
print(''.join(map(str, nums)))
```
### 정리
```
1. ''.join(map(str, nums)))
- 출력 결과를 특정 형태로 만들어야 할 때 사용하기
- .join은 문자열만 연결가능
- map(str, nums)로 숫자 리스트 nums를 문자열로 변환
```

## 11650
### 내 코드
```
import sys 

N = int(input())

lst = []

for i in range(N):
	x, y = map(int, sys.stdin.readline().split())
	lst.append([x, y])

lst.sort()

for i in range(N):
	
	print(lst[i][0], lst[i][1])
```
### 정리
```
1. 2차원 배열 생성
lst = []
for i in range(N):
	x, y = map(int, input().split())
    lst.append([x, y]) #append는 하나의 인자만 받을 수 있어, 리스트로 묶어서 추가해야 함
=> lst(append((x, y)) 튜플 형태도 가능
```
## 11651
### 내 풀이
```
import sys 

N = int(input())

lst = []

for i in range(N):
	x, y = map(int, sys.stdin.readline().split())
	lst.append([y, x])

lst.sort()

for i in range(N):
	
	print(lst[i][1], lst[i][0])
```
### 정리
```
1. lambda 함수의 존재
- y 좌표 기준인 걸 못 봐서 누락함
- 정의: 이름 없는 익명 함수 만드는 방법
- 문법: lambda 인자: 표현식
- 예시: lambda coord: (coord[1], coord[0])

=> 한 줄로 해결은 람다
=> 복잡한 로직은 함수
```
## 1181
### 내 코드
```
import sys 

N = int(input())

words = []

#N개의 단어를 리스트에 추가

for i in range(N):

	word = sys.stdin.readline().strip()
	words.append(word)

words = list(set(words))
#set은 중복 취급 안 하고 순서가 없음

#정렬
def sort_words(word):
	#길이순
	#길이가 같으면 사전순

	return(len(word), word)

words.sort(key = sort_words)

for word in words:

	print(word)
```

### 정리
```
## Lambda 함수와 정렬 기준에 대한 이해

### 정렬 키 함수 설명
python
def sort_words(word):
    return (len(word), word)

이 함수는 정렬 시 두 가지 기준을 순차적으로 적용:
1. **1차 기준**: 단어의 길이(`len(word)`)
2. **2차 기준**: 단어 자체(`word`) - 사전순(알파벳순)

### 튜플 반환의 의미
- `(len(word), word)` 튜플을 반환하면 Python은 자동으로:
  - 먼저 튜플의 첫 번째 요소(단어 길이)로 정렬
  - 첫 번째 요소가 같은 경우에만 두 번째 요소(단어 자체)로 정렬

### Lambda 대신 일반 함수 사용
Lambda 함수 대신 일반 함수를 사용하는 이유:
- 코드가 더 명확하고 가독성이 좋음
- 함수에 설명(docstring)을 추가할 수 있음
- 디버깅이 더 쉬움
- 같은 정렬 기준을 여러 곳에서 재사용 가능
```
## 10814
### 내 코드
```
import sys 

N = int(input())

people = []

for i in range(N):

	age, name = input().split()
	people.append([int(age), name])

people.sort(key = lambda p: p[0])

for age, name in people:
	print(age, name)
```
### 오답노트
```
1. 자료형이 다른 원소 쌍 입력 받기
age, name = input().split()
people.append([int(age), name])

2. sort()
people.sort(key=lambda p: p[0])

3. Lambda()
- 이름 없는 일회용 함수
- key=lambda p: p[0]에서 p는 임의로 지정한 매개변수 이름
- sort()가 리스트의 요소를 p로 전달 (매개변수로 사용)

4. 안정 정렬
- sort()는 안정 정렬 알고리즘
- 정렬 키가 같은 요소들의 상대적 순서 유지
```
## 18870 (보류)