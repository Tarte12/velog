---
title: 'BOJ 단계별 : 저번에 못 풀었던 거'
slug: BOJ-단계별-저번에-못-풀었던-거
date: 2025-05-19T11:08:26.178Z
tags: []
---
# 10810
## 내 코드
```
N, M = map(int, input().split())

ball = [i for i in range(1, N + 1)]

for k in range(M):

	i, j = map(int, input().split())

	t = 0
	t = ball[i-1]
	ball[i-1] = ball[j-1]
	ball[j-1] = t

print(" ".join(map(str, ball)))
```

## 정리
=> 로직은 거의 맞는데 문법에서 아직도 덤벙거려서 바로 맞지 않는 게 문제인 듯 (gpt한테 그동안 내가 공부했던 거 중에 틀리는 문법 정리해 달라고 해야겟다)

# 10810
내 코드
```
N, M = map(int, input().split())

ball = [0]*N #초기화 필요

for s in range(M):

	i, j, k = map(int, input().split())


	for t in range(i-1, j):
		ball[t] = k

print(" ".join(map(str, ball)))
```