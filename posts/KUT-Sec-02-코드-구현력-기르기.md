---
title: '[KUT] Sec 02 코드 구현력 기르기'
slug: KUT-Sec-02-코드-구현력-기르기
date: 2025-08-29T02:20:08.817Z
tags: []
---
# 1. K번째 약수
- 자연수 N과 K가 주어졌을 때 N의 약수들 중 K번째로 작은 수 출력
- 만약 약수의 개수가 K개보다 적으면 -1 출력
```
n, k = map(int, input().split())
cnt = 0
for i in range(1, n+1):
    if n % i == 0:  
        cnt += 1
    if cnt == k:    
        print(i)
        break
else:
    print(-1)
```
# 2. K번째 수
- N개의 숫자 주어짐
- s번째부터 e번째까지 잘라서 오름차순 정렬
- k번째 오는 수 출력
```
T = int(input())
for t in range(T):
    n, s, e, k = map(int, input().split())
    a = list(map(int, input().split()))
    b = a[s-1:e]
    b.sort()
    print(f"#{t+1} {b[k-1]}")
```
# 3. K번째 큰 수
- 카드 N장 주어질 때
- 서로 다른 3장을 뽑아 합한 값 모두 기록
- 이 합들 중 K번째로 큰 수 출력
```
n, k = map(int, input().split())
a = list(map(int, input().split()))

res = set()
for i in range(n):
    for j in range(i+1, n):
        for m in range(j+1, n):
            res.add(a[i] + a[j] + a[m])

res = sorted(list(res), reverse=True)
print(res[k-1])
```
# 4. 대표값 구하기
- 자연수 N과 K가 주어짐
- N의 약수들 중 K번째로 작은 수 출력
- 만약 약수의 개수가 K개보다 적으면 -1 출력
```
n, k = map(int, input().split())
cnt = 0
for i in range(1, n+1):
    if n % i == 0:  
        cnt += 1
    if cnt == k:   
        print(i)
        break
else:
    print(-1)
```
# 5. 정다면체
- 정N면체와 정M면체 주사위를 던짐
- 합이 가장 많이 나오는 숫자 출력
```
n, m = map(int, input().split())
cnt = [0] * (n+m+1)
max_val = 0

for i in range(1, n+1):
    for j in range(1, m+1):
        cnt[i+j] += 1

for i in range(n+m+1):
    if cnt[i] > max_val:
        max_val = cnt[i]

for i in range(n+m+1):
    if cnt[i] == max_val:
        print(i, end=' ')
```
# 6. 자릿수의 합
- 주어진 자연수들의 자릿수 합 구하기
- 그 합이 최대인 수 출력
- 여러 개면 입력순으로 먼저인 수
```
n = int(input())
a = list(map(int, input().split()))

def digit_sum(x):
    return sum(int(ch) for ch in str(x))

max_val = -1
for x in a:
    tot = digit_sum(x)
    if tot > max_val:
        max_val = tot
        res = x
print(res)
```
# 7. 소수 (에라토스테네스 체)
- 1부터 N까지의 소수의 개수 출력
```
n = int(input())
ch = [0] * (n+1)
cnt = 0

for i in range(2, n+1):
    if ch[i] == 0:
        cnt += 1
        for j in range(i, n+1, i):
            ch[j] = 1
print(cnt)
```
# 8. 뒤집은 소수
- 주어진 수를 뒤집어서 소수면 출력
```
n = int(input())
a = list(map(int, input().split()))

def reverse(x):
    return int(str(x)[::-1])

def isPrime(x):
    if x < 2: return False
    for i in range(2, int(x**0.5)+1):
        if x % i == 0:
            return False
    return True

for x in a:
    tmp = reverse(x)
    if isPrime(tmp):
        print(tmp, end=' ')
```
# 9. 주사위 게임
- 주사위 3개 던져서 규칙에 따라 상금 계산
- N명이 게임에 참여했을 때 가장 많은 상금 출력
```
n = int(input())
res = 0
for _ in range(n):
    a, b, c = sorted(map(int, input().split()))
    if a == b == c:
        money = 10000 + a * 1000
    elif a == b or a == c:
        money = 1000 + a * 100
    elif b == c:
        money = 1000 + b * 100
    else:
        money = c * 100
    res = max(res, money)
print(res)
```
# 10. 점수 계산 (OX 문제)
- OX 시험 결과가 주어질 때 연속 정답은 가산점으로 계산
```
n = int(input())
a = list(map(int, input().split()))
score = 0
cnt = 0
for x in a:
    if x == 1:
        cnt += 1
        score += cnt
    else:
        cnt = 0
print(score)
```