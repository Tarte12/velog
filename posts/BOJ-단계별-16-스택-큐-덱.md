---
title: 'BOJ 단계별 (16) : 스택, 큐, 덱'
slug: BOJ-단계별-16-스택-큐-덱
date: 2025-05-16T09:16:40.879Z
tags: []
---
# 28278(보류 -> 스택 구현)
# 10773
## 내 풀이
```
K = int(input())
stack = []

for _ in range(K):
    num = int(input())

    if num == 0:
        if stack:
            stack.pop()
    else:
        stack.append(num)  # ← 들여쓰기 고침

print(sum(stack))

```
# 9012 (보류)
## 내 풀이

# 12789
# 18258
# 2164
## 내 풀이
```
from collections import deque

N = int(input())

dq = deque(range(1, N + 1))

for i in range(N-1):
	dq.popleft()
	#1 2 3 4
	#-> 1부터 버린다는 소리잖아
	num = dq[0]
	#->그리고 2를 오른쪽에 삽입
	dq.popleft()
	dq.append(num)

print(dq[0])
```

## 정리
### 몰랐거나 틀린 부분
```
1. 카드 번호 직접 입력받으려 함 => 입력할 번호 안 줬음
2. 입력이 없는데 input() 사용 => EOFError 
3. popleft()를 두 번 쓰고 따로 저장 => dq.append(dq.popleft())쓰면 해결
```
#### 큐(Queue)
- 파이썬에서 collections.deque
```
from collections import deque

dq = deque()

dq.append(x)      # 오른쪽에 삽입
dq.popleft()      # 왼쪽에서 제거
dq.appendleft(x)  # 왼쪽에 삽입
dq.pop()          # 오른쪽에서 제거
dq[0]             # 맨 앞 원소 확인

```
# 11866 (아직 아리까리...한 듯?)
## 내 코드
```
from collections import deque

N, K = map(int, input().split())
dq = deque(range(1, N + 1))

result = []

while dq:
    dq.rotate(-K + 1)        # K-1명 앞으로 밀고
    result.append(dq.popleft())  # K번째 제거

print("<" + ", ".join(map(str, result)) + ">")

```
## 정리
### 문제점
```
1. lst 초기화 없었음 => lst = list(range(1, N + 1))
2. lst[K] 접근
3. 원형 순환 처리 X
```
### 몰랐던 개념
1. 원형 순환 => 리스트가 원인 것처럼
- N번째 요소 뒤는 다시 1번째로
- 끝에 도달하면 다시 세기
2. mod 연산(%)
- 리스트의 길이가 줄어들기 때문에 인덱스를 계속 0 ~ 길이-1 사이로 유지 필요
index = (index + K -1) % len(lst)
3. deque와 rotate 활용
rotate(n) : 오른쪽으로 n칸 회전
# 28279 (덱 공부를 해 보고 풀기)
# 2346 (덱)
# 24511