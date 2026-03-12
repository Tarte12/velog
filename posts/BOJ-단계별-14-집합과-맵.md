---
title: 'BOJ 단계별 (14) : 집합과 맵'
slug: BOJ-단계별-14-집합과-맵
date: 2025-05-16T09:09:20.377Z
tags: []
---
# 10815
## 코드
```
# 상근이가 가지고 있는 숫자 카드 개수
N = int(input())
# 상근이의 숫자 카드 목록 (집합으로 저장)
s_nums = set(map(int, input().split()))

# 확인할 숫자 카드 개수
M = int(input())
# 확인할 숫자 카드 목록 (리스트로 저장)
m_nums = list(map(int, input().split()))

# 결과 출력
for num in m_nums:  # M_nums가 아닌 m_nums 사용
    if num in s_nums:  # s_numss가 아닌 s_nums 사용
        print(1, end=' ')
    else:
        print(0, end=' ')
```
## 정리
```
1. Set
**특징**
- 중복 허용 X
- 순서 없음
- 수정 가능
- 다양한 자료형 저장

**문법**
- 빈 집합 생성
empty_set = set()
- 값 포함
my_set = {1, 2, 3}
- 리스트 변환
lst_set = set([1, 2, 3])
- 문자열 변환
str_set = set("hello")
- map 변환
nums = "1 2 3 4 5"
nums_set = set(map(int, nums.split())

**메서드/연산**
s = set()
s.add(4)
s.update([5, 6])
s.remove(4)
s.discard(7)
s.pop()
s.clear()
```
# 14425
## 내 코드
```
N, M = map(int, input().split())

S = set()
count = 0

for i in range(N):
	S.add(input())

for i in range(M):

	if input() in S:
		count += 1
	
print(count) 
```
## 정리
```
# 패턴: 입력을 바로 집합에서 검사
if input() in 집합:
    # 집합에 있는 경우 처리

# 자바 스타일 vs 파이썬 스타일
# 자바 스타일
value = input()
if set.contains(value):
    count++

# 파이썬 스타일
if input() in set:
    count += 1
```
# 7785
## 내 코드
```
n = int(input())
person = set()
for i in range(n):
    name, status = input().split()
    if status == "enter":
        person.add(name)
    else:
        person.remove(name)

# 수정된 부분: sorted() 함수 사용
for name in sorted(person, reverse=True):  
    print(name)
```
## 정리
```
1. Set 특성
- 중복 허용 X
- 순서 X
- 요소 추가 add(), 제거 remove()
- 검색 속도 빠름: in 연산 O(1)
- sort() 사용 X => sorted() 사용
```
# 1620 (문제가 너무 길어서 읽기 싫어...)
# 10816 (보류)
# 1764 (보류)
# 1269
## 내 코드
```
A_num, B_num = map(int, input().split())
A = set(map(int, input().split()))
B = set(map(int, input().split()))

# 대칭 차집합: A-B 합 B-A
result = A ^ B  # 또는 (A - B) | (B - A)

print(len(result))

```
## 정리
1. Set 연산
- A & B 교집합
- 'A
- A - B 차집합
- A ^ B 대칭합집합
# 11478 (보류)