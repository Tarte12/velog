---
title: 'BOJ 단계별 (12) : 브루트 포스 (오류로 저장 날아감)'
slug: BOJ-단계별-12-브루트-포스
date: 2025-05-15T09:42:23.123Z
tags: []
---
> 오류로 임시 저장까지 싹 날아감 ^^
## 2798
### 내 풀이
```
from itertools import combinations

N, M = map(int, input().split())
lst = list(map(int, input().split()))

max_sum = 0

#lst 중 3개 뽑는 조합을 하나씩 꺼내는 역할
#for을 써서 모든 조합을 꺼내는 과정 필요
for selection in combinations(lst, 3):

	#조합 하나씩 꺼내서 3개 더하는 거임
	sum_sel = sum(selection)

	#M보다 안 클 경우만
	if sum_sel <= M:
		#max_sum과 sum_sel 중 비교하여 큰 값을 max_sum에 저장
		#그러면 조합으로 구한 값 하나씩 돌면서 비교
		max_sum = max(max_sum, sum_sel)

print(max_sum)

```
### 정리
#### 설계
- 조합 같아서 조합으로 모든 경우의 수를 구함
- 그 합이 M이 넘지 않는 경우만 최댓값
#### 몰랐거나 틀렸던 포인트
```
1. 순차적으로 가장 큰 3장의 카드를 고르면 안 됨
- 처음엔 내림차순 정렬하고 세 개를 더했는데, 순차적으로 세 개를 고르지 않아도 최댓값이 나오는 경우가 있음
- 그러니까 이 논리 자체가 틀림

2. 조합(combinations) 함수 이해 부족
- 조합으로 풀 수 있을 것 같긴 한데 파이썬 내장 함수로 안 써 봐서 개념을 몰랐음
- from itertools import combinations 필요
- combination(lst, 3)은 lst에서 중복 없이 3개를 뽑아 튜플로 반환하는 이터레이터 <= 모든 조합을 "하나씩" 꺼내서 쓰는 느낌
- 따라서 다 꺼낼 거면 for문으로 다 돌아서 꺼내 줘야 함

3. max() 함수
```

#### 추가로 궁금한 거?
**부르트 포스(완전 탐색) 직접 구현**
```
1. 논리
- 첫 번째 루프: 전체 n개 중 첫 번째 카드 하나 뽑고(인덱스 i)
- 두 번째 루프: i 다음부터 남은 n-1개 중에서 중 두 번째 카드 하나 뽑고(인덱스 j>i)
- 세 번째 루프: j 다음부터 남은 n-2개 중에서 중 세 번째 카드 하나 뽑고(인덱스 k>j)

for i in range(n):          # 첫 번째 카드 선택
    for j in range(i+1, n):  # i 다음 카드부터 선택
        for k in range(j+1, n):  # j 다음 카드부터 선택
            sum_cards = lst[i] + lst[j] + lst[k]
            # 조건에 따라 처리

```

**내장 함수 안 쓰고 조합 함수 자체를 구현**
```
def factorial(x):
    result = 1
    for i in range(1, x + 1):
        result *= i
    return result

def comb(n, r):
    return factorial(n) // (factorial(r) * factorial(n - r))

```

## 2231 (보류)
### 내 풀이
### 정리
#### 설계
#### 몰랐거나 틀렸던 포인트
## 19532
### 내 풀이
```
a, b, c, d, e, f = map(int, input().split())

for x in range(-999, 1000):
    for y in range(-999, 1000):
        if a*x + b*y == c and d*x + e*y == f:
            print(x, y)
            exit()
```
### 정리
#### 설계
#### 몰랐거나 틀렸던 포인트
```
1. 브루트 포스 문제는 모든 경우의 수를 탐색하는 느낌
=> 그냥 어렵게 생각하지 말고 루프문에서 시작하자
```
## 1018 (보류)
### 내 풀이
### 정리
#### 설계
#### 몰랐거나 틀렸던 포인트
## 1436
### 내 풀이
```
N = int(input())

num = 666
count = 0


while True:
    if '666' in str(num):
        count += 1
    
    if count == N:
        print(num)
        break 
    
    num += 1
```
### 정리
#### 설계
#### 몰랐거나 틀렸던 포인트
## 2839
### 내 풀이
```
N = int(input())

total = 0

while N >= 0:
    if N % 5 == 0:
        total = total + (N //5)
        print(total)
        break 
    N = N - 3 #(3kg 봉투를 하나 쓰겠다)
    total = total + 1

else:
    print(-1)
    
```
### 정리
#### 설계
#### 몰랐거나 틀렸던 포인트