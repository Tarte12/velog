---
title: 'BOJ 단계별 (17) : 조합론'
slug: BOJ-단계별-17-조합
date: 2025-05-16T10:52:23.299Z
tags: []
---
# 15439
```
N = int(input())

if N == 1:
	print(0)
else:
	print(N*(N - 1))
```
# 24723
```
N = int(input())
print(2 ** N)
```
# 10872
```
N = int(input())
res = 1

for i in range(1, N+1):

	res *= i

print(res)
```
# 11050
> 일부러 combination 안 썼음
```
N, K = map(int, input().split())


def fac(num):

	res = 1

	for i in range(1, num+1):

		res *= i

	return res

N_f = fac(N)
K_f = fac(K)
NK_f = fac(N-K)

print(N_f // (K_f*NK_f))
```
# 1010
```
def fac(num):
    res = 1
    for i in range(1, num + 1):
        res *= i
    return res

T = int(input())

for _ in range(T):
    N, M = map(int, input().split())
    M_f = fac(M)
    N_f = fac(N)
    MN_f = fac(M - N)
    print(M_f // (N_f * MN_f))

```