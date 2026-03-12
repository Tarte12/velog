---
title: '3회차) DFS, BFS, Stack, Queue'
slug: 3회차-DFS-BFS-Stack-Queue-1w4gle3r
date: 2025-06-25T10:43:04.725Z
tags: []
---
# 1. 공통 문제(DFS, BFS)
- BFS는 왜 Queue로 푸는 걸까?
- DFS는 왜 Stack으로 푸는 걸까?

## Q1) BOJ 1260
- 문제: https://www.acmicpc.net/problem/1260
- 설명: 주어진 간선, 정점, 시작 위치를 보고 그래프를 만들어서 dfs/dfs로 탐색하는 문제

### 코드
```python
#파이썬은 양방향 큐인 deque를 사용
from collections import deque

#정점 갯수 N, 간선 갯수 M, 탐색 시작 정점 번호 V
N, M, V = map(int, input().split())

#DFS -> Stack or 재귀함수

visited = [False] * (N + 1)
#방문 안 한 기본값이 False
#방문해야 하는 정점 갯수 만큼 길이

sol_dfs = []


def dfs(v):
  visited[v] = True  #v를 true로 바꿔서 방문 처리
  sol_dfs.append(v)
  for i in graph[v]:  #그래프 전체를 순회하겠다
    if not visited[i]:  #방문 처리가 안 된 곳이면
      dfs(i)  #재귀함수 호출


#BFS -> Queue
sol_bfs = []


#리스트를 이용해서 큐를 만들 수 있지만
#pop(0) 연산이 O(N)만큼 걸리기 때문에 느려서 그냥
#deque 사용하는 게 나음 (양방향 큐)
#list.pop(0) => O(N)
#deque.popleft() => O(1)
def bfs(v):
  queue = deque()  #큐 생성
  queue = deque([v])  #시작 정점을 큐에 삽입
  visited[v] = True  #여기까진 방문 처리라 dfs랑 동일

  while queue:  #큐가 빌 때까지 반복
    v = queue.popleft()  #큐에서 원소 하나 뽑아내기
    sol_bfs.append(v)
    #이미 위에서 시작점을 방문 처리 했기 때문에 빼야 함
    for i in graph[v]:  #그래프 전체를 순회하겠다
      if not visited[i]:  #방문 처리가 안 된 곳이면
        queue.append(i)  #큐에 넣어주기
        visited[i] = True


#그래프 => 인접 리스트 아이디어
# (N+1)만큼 만들어서 정점 갯수만큼 리스트를 만들고
# 이 내용을 다 모은 리스트를 만들어서 그래프라고 하겠
graph = [[] for _ in range(N + 1)]

for i in range(M):
  #간선 정보 <- 간선이 연결한 정점의 번호
  #a 정점의 인접한 정점으로 b를 넣겠다
  a, b = map(int, input().split())
  graph[a].append(b)
  graph[b].append(a)  #무방향 그래프만
#여기까지 그래프 생성 완료
for i in range(1, N + 1):
  graph[i].sort()

#그러면 이걸 탐색하는 게 DFS/BFS
#위에서 함수를 정의하고 아래에서 호출

dfs(V)  #위에서 시작하기로 한 V에서 시작하는 dfs 호출
visited = [False] * (N + 1)  #초기화
bfs(V)  #위에서 시작하기로 한 V에서 시작하는 bfs 호출
print(*sol_dfs)
print(*sol_bfs)

```
### 관련 개념
#### DFS
![](https://velog.velcdn.com/images/emprimula/post/0d557ced-7196-46e1-b253-c8fe66912c1c/image.png)

- **ADT 구조**: 스택 기반 탐색(LIFO)
	- 한 방향으로 끝까지 들어갔다가 막히면 돌아옴
    - 실제 DFS 문제에서는 **재귀 호출 스택** 활용
- **DFS 구현 아이디어**:
	- 방문한 노드는 `visited = True`
    - 재귀 함수 사용(내부적으로 스택 구조)
    - 인접 노트를 하나씩 순회하여 깊게 들어감
    
#### BFS
![](https://velog.velcdn.com/images/emprimula/post/8b12f8d8-a01a-4345-91fa-dd6ca31b221a/image.png)
- **ADT 구조**: 큐 기반 탐색(FIFO)
	- 가까운 노드부터 넓게 퍼져나가는 탐색
    - **순서 보장을 위해 큐 사용**
- **BFS 구현 아이디어**:
	- 방문한 노드는 `visited = True`
    - 파이썬에서는 양방향 큐인 덱 사용
    	- 기본 `list.pop(0)` => O(N) 느림
        - `collections.deque.popleft(0)` => O(1) 빠름
        
#### 그래프 생성
- 그래프 생성 이유: DFS/BFS는 노드 간 연결 정보를 알아야 작동 가능
- 표현 방식: 인접 리스트
	- 각 정점마다 연결된 정점을 **리스트**로 저장
```python
graph = [[] for _ in range(N + 1)]
graph[a].append(b)
graph[b].append(a)  # 무방향일 경우
```

-`graph[1] = [2, 3]` -> 1번 정점이 2, 3이랑 연결됨
- 2차원 배열 형태(`정점별로 리스트로 연결된 정점을 저장하고, 이걸 다시 그래프라는 리스트 안에 넣음`)

### 문제 풀이 
- 구현 포인트
	- DFS는 재귀, BFS는 deque로 구현
    - `visited` 배열은 DFS에서 사용하고 BFS에서 다시 초기화해서 사용
    - 탐색 순서 보장을 위해 **인접 리스트 정렬 필요**
    
#### 실수 & 피드백

| 실수                         | 내용                      | 해결                                |
| -------------------------- | ----------------------- | --------------------------------- |
| `graph[i].sort()` 누락       | 작은 노드부터 방문 보장 실패        | 간선 입력 후 정렬                        |
| `sol_bfs.append(v)` 잘못된 위치 | 중복 방문 추가됨               | `popleft()` 직후 한 번만 추가            |
| `visited` 재활용              | DFS→BFS로 이어지면 방문 상태 공유됨 | BFS 전에 `visited` 재초기화             |
| `print(list)` 사용           | `[1, 2, 3]` 형태 출력       | `print(*list)` 또는 `' '.join()` 사용 |

   
## Q2) BOJ 11724
- 문제: https://www.acmicpc.net/problem/11724
- 설명: 연결 요소의 개수를 dfs/bfs를 사용하여 카운팅하는 문제

### 코드(DFS/BFS 둘 다 만들어 놓음)
```python
from collections import deque
import sys
sys.setrecursionlimit(10**6)
input = sys.stdin.readline
#DFS 쓰면 재귀 깊이 제한 걸림
#따라서 재귀 깊이 제한을 늘려줘야 함


#from collections import deque
#BFS 구현을 위해 deque 사용 <- 오류 때문에

N, M = map(int, input().split())
#정점 갯수 N, 간선 갯수 M
#u와 v 연결되어 있음 => 인접 리스트로 구현
graph =[[] for _ in range(N+1)]

for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u) #무방향 그래프 해당

#새로 안 개념: 연결 요소(Connected Component))
#그래프에서 서로 연결된 노드들의 묶음(덩어리)
#한 묶음을 DFS/BFS 탐색 1번으로 다 탐색 가능
#서로 연결되지 않은 노드는 다른 연결 요소

#아이디어: 시작점에서 한 바퀴를 돌고
#돌지 않은 시작점을 찾아서 다시 한 바퀴를 돌고
#이 과정을 반복?

#먼저 DFS 구현
visited = [False] * (N+1) #방문 체크용 리스트

def dfs(v):
  visited[v] = True #방문 체크
  for i in graph[v]: #그래프 전체를 순회
    if not visited[i]: #방문하지 않은 노드라면
      dfs(i)

def bfs(v):
  queue = deque([v])
  visited[v] = True

  while queue:
    v = queue.popleft() #방문한 노드 제거
    for i in graph[v]: #그래프 전체 순회
      if not visited[i]: #방문하지 않은 노드라면
         queue.append(i) #방문
         visited[i] = True
  
count = 0 #연결 요소 갯수

#노드 번호를 순회하면서 if 노드 방문 x => dfs(i) + count += 1
for i in range(1, N+1):
  if not visited[i]:
    dfs(i)
    #bfs(i)
    count += 1

print(count)
```

### 새로 알게 된 개념
- **연결 요소(Connected Component)**
- **그래프에서 서로 연결된 노드들의 한 묶음**
- DFS/BFS를 한 번 돌리고 끝내면 그 한 탐색이 한 묶음
- **방문하지 않은 정점은 새로운 연결 요소**

### 문제 풀이
#### 1. 처음에 DFS로 구현
- DFS 구현이 편해서 => 재귀로 간단 구현
- **문제점**: 입력이 많을 때 `RecursionError` 발생
	-파이썬은 **재귀 깊이 제한이 1000**
#### 2. 해결책
**방법 1: 재귀 깊이 한도 늘리기 => 근데 입력이 얼마일 줄 알고? 비효율적**
```python
import sys
sys.setrecursionlimit(10**6)
```
**방법 2: DFS -> BFS**
```python
from collections import deque
def bfs(v):
    queue = deque([v])
    visited[v] = True
    while queue:
        v = queue.popleft()
        for i in graph[v]:
            if not visited[i]:
                queue.append(i)
                visited[i] = True

```
- **BFS는 반복문 기반이라 재귀 한도 문제 없음**
- deque를 사용해 popleft()가 O(1)

> DFS/BFS 문제는 BFS 쓸 수 있으면 그냥 BFS 쓰자

# 2. 추가 문제
> 기본 구현 연습

## Q3) BOJ 10828 스택
- 문제: https://www.acmicpc.net/problem/10828
- 설명: 스택의 기능인 push, pop, size, empty. top을 구현하는 문제

### 코드
```python
#N개의 정수 입력 받기
N = int(input())

#입력받은 정수를 리스트에 저
lst = []

#스택 구현
stack_lst = [] 

def pushX(X):
  stack_lst.append(int(X))

def pop():
  if len(stack_lst) == 0:
    return -1
  sol = stack_lst[-1]
  del stack_lst[-1]
  return sol

def size():
  return len(stack_lst)

def empty():
  if len(stack_lst) == 0:
    return 1
  else:
    return 0

def top():
  if len(stack_lst) == 0:
    return -1
  else:
    return stack_lst[-1]

for i in range(N):
    lst.append(input().split())

for i in lst:
  if i[0] =='push':
    pushX(i[1])
  elif i[0] == 'pop':
    print(pop())
  elif i[0] == 'size':
    print(size())
  elif i[0] == 'empty':
    print(empty())
  else:
    print(top())
```
## Q4) BOJ 10845 큐
- 문제: https://www.acmicpc.net/problem/10845
- 설명: 큐의 기능인 push, pop, size, empty. front, back을 구현하는 문제
- 아이디어: 스택 코드에서 기능만 추가하면 되는 문제

### 코드
```python
N = int(input())

#정수 저장 리스트
N_lst = []

#큐 기능할 리스트
queue = []

def push(X):
    queue.append(int(X))

def pop():
  if len(queue) == 0:
    return -1
  else:
    return queue.pop(0)

def size():
  return len(queue)

def empty():
  if len(queue) == 0:
    return 1
  else:
    return 0

def front():
  if len(queue) == 0:
    return -1
  else:
    return queue[0]

def back():
  if len(queue) == 0:
    return -1
  else:
    return queue[-1]

for i in range(N):
  N_lst.append(input().split())
  
for i in N_lst:

  if len(i) == 2:
    push(i[1])
  elif i[0] == 'pop':
    print(pop())
  elif i[0] == 'size':
    print(size())
  elif i[0] == 'empty':
    print(empty())
  elif i[0] == 'front':  
    print(front())  
  else:
      print(back())


```
## Q5) BOJ 4963: 섬의 개수
- 문제: https://www.acmicpc.net/problem/4963?utm_source=chatgpt.com
- 설명: 정사각형으로 이뤄진 섬과 바다 지도에서 섬의 개수를 세는 프로그램 짜기

### 1. 초기 코드
#### 아이디어
- **지도를 그래프로 보고, 섬 하나를 bfs 1회로 탐색**하자는 아이디어
- 지도 상에서 `1`을 발견하면 거기에서 bfs를 진입 => bfs 내에서 **상하좌우 + 대각선**을 모두 탐색해서 섬 하나를 탐색하겠다
- **bfs를 한 번 돌 때 섬 1개 count**

#### 풀이 흐름
1. 입력: w x h 크기의 2차원 지도 형태. 여러 테스트 케이스가 주어짐. 0 0 입력이면 종료
2. 지도는 0은 바다, 1은 땅.
3. 문제 목표: 서로 연결된 땅(1)들을 하나의 **"섬"**으로 보고, 섬이 몇 개인지 구하기
4. map_lst[i][j] == 1인 좌표를 찾으면, 그 지점을 시작으로 BFS를 실행
5. BFS 내부에서는 상하좌우 + 대각선 방향을 모두 검사
6. 방문한 좌표는 다시 탐색하지 않도록 visited 체크
7. BFS가 끝나면 count += 1 (섬 하나 탐색 완료)
```python
from collections import deque
#입력이 여러 개의 테스트 케이스 -> while

#내 생각에는 bfs 한 사이클이 섬 한 개임
#그러니까 일단 bfd를 만들어야 함
#이제 보니까 그래프 모양이네 지도

def bfs(v):
  visited = [False] * (w*h)
  visited[v] = True
  queue = deque([v])
  while queue:
    v = queue.popleft()
    #상하좌우체크 
    #첫 번째 아이디어: if로 상하좌우대각선케이스나누기
    for i in map_lst[v]:
      #for문 => 지도의 가로로 순회하겠다
      #그러면 상하좌우대각선 체크는 어떻게?
      #1.상하좌우
      if i == 1: #상하좌우 체크
        #상
        if map_lst[v - 1][i] == 1:
          queue.append(map_lst[v - 1][i])
          visited[i] = True
        #하
        elif map_lst[v + 1][i] == 1:
          queue.append(map_lst[v + 1][i])
          visited[i] = True
        #좌
        elif map_lst[v][i-1] == 1:
          queue.append(map_lst[v][i-1])
          visited[i] = True
        #우
        elif map_lst[v][i+1] == 1:
          queue.append(map_lst[v][i+1])
          visited[i] = True
        #대각선
        elif map_lst[v-1][i-1] == 1:
          queue.append(map_lst[v-1][i-1])
          visited[i] = True
        elif map_lst[v-1][i+1] == 1:
          queue.append(map_lst[v-1][i+1])
          visited[i] = True
        elif map_lst[v+1][i-1] == 1:
          queue.append(map_lst[v+1][i-1])
          visited[i] = True
        elif map_lst[v+1][i+1] == 1
          queue.append(map_lst[v+1][i+1])
          visited[i] = True
  
count = 0 #섬 갯수 체크

while (True):
  w, h = map(int, input().split())
  if w == 0 and h == 0:
    break #테스트 케이스 다 받아서 탈출 조건

  for i in range(h): #지도 1개 당 체크
    #h줄에 지도가 주어짐 -> 2차원 배열
    map_lst = [[] for _ in range(h)]
    #1줄에 w개의 정수 구조가 h개 있는 구조
    map_lst[i] = list(map(int, input().split()))
    #숫자 담기
# [[0,1], [0,1]] <- 이런 구조
#그러면 0이면 스킵 1이면 bfs 돌리기
#그러면 bfs 내에서 상하좌우/대각선을 체크해야 하나?
#일단 그럼 첫 번째 줄부터 1을 찾으면 dfs 진입 코드 필요
    for i in map_lst: #0이랑 1을 체크하겠다
      if i == 1:
        bfs(i)
        count += 1
        #bfs가 돌면 섬 1개 체크 -> 상하좌우대각선은
        #bfs 내에서 체크


print(count)


```

#### 문제점
**1. 그래프가 1차원**
- `visited = [False] * (w * h)` 처럼 1차원 리스트로 선언했는데, 지도는 사실상 2차원
- 따라서 `map_lst[v - 1][i], map_lst[v][i+1]` 이런 표현은 정확한 좌표 X
- BFS 내부에서 `v`를 단일 인덱스로만 쓰기 때문에 `x, y` 좌표 기준 탐색 불가
**2. 탐색 대상이 잘못된 방식으로 구성**
- `for i in map_lst[v]:`로 탐색하고, 그 안에서 또 인덱싱 하려다 보니 좌표가 꼬임
- 상하좌우대각선 체크도 if문으로 하려 했지만, 위치 정보가 정확히 지정되지 않아 `IndexError` 또는 논리 오류 발생 가능

#### 해결하기 위한 새 개념
#### 1. 2차원 그래프 탐색을 위한 좌표 기반 탐색
#### 2. 방향 벡터(방향 리스트) 도입
- 2차원 배열에서 상하좌우/대각선을 탐색해야 할때
- if문으로 8가지 방향 쓰는 대신 
	=> **방향 리스트(`dx`,`dy`)를 정의**
    => 그리고 이걸 `for`문으로 순회해서 간단하게 탐색
```python
#4방향
dx = [-1, 1, 0, 0]  # 위, 아래
dy = [0, 0, -1, 1]  # 왼, 오른쪽

# (x, y) 좌표에서 4방향 탐색
for i in range(4):
    nx = x + dx[i]
    ny = y + dy[i]
    
#대각선 포함 8방향
dx = [-1, 1, 0, 0, -1, -1, 1, 1]
dy = [0, 0, -1, 1, -1, 1, -1, 1]

# (x, y) 좌표에서 8방향 탐색
for i in range(8):
    nx = x + dx[i]
    ny = y + dy[i]
```
**실전 적용 팁**
**1.**
- `nx`,`ny`는 **탐색하려는 다음 좌표**
**2.** 항상 `범위 조건` 체크
```python
if 0 <= nx < h and 0 <= ny < w:
    # 유효한 범위 내의 좌표
```
**3.** `graph[nx][ny]`가 유효한 값인지 확인하고, `visited[nx][ny]`로 방문 여부를 체크하며 동작

> **"2차원 그래프 탐색은 방향 리스트와 좌표 갱신으로 풀어라.
범위 체크 + 조건문 + 방문 처리 = DFS/BFS 3종 세트."**

### 최종 코드
```python
from collections import deque
#입력이 여러 개의 테스트 케이스 -> while

#내 생각에는 bfs 한 사이클이 섬 한 개임
#그러니까 일단 bfd를 만들어야 함
#이제 보니까 그래프 모양이네 지도

#방향 탐색(상/하/좌/우/좌상/우상/좌하/우하)
dx = [-1, 1, 0, 0, -1, -1, 1, 1]
dy = [0, 0, -1, 1, -1, 1, -1, 1]
count = 0 #섬 갯수 체크

def bfs(x, y):
  #bfs를 위한 큐 생성
  #방문처리 위한 2차원 배열
  queue = deque()
  queue.append((x, y)) #시작점
  visited[x][y] = True #시작점 방문 처리

  while queue: #queue가 빌 때까지
    x, y = queue.popleft()
    for i in range(8): #8방향 탐색
      nx = x + dx[i] #체크할 값의 위치 x
      ny = y + dy[i] #체크할 값의 위치 y

      if 0 <= nx < h and 0 <= ny < w: #범위 체크
        #8방향 범위 안에 들어갔을 때
        if not visited[nx][ny] and map_lst[nx][ny]== 1: #방문하지 않았고 1에 해당하면
          visited[nx][ny] = True
          queue.append((nx, ny))


while True:
  w, h = map(int, input().split())
  if w == 0 and h == 0:
      break

  map_lst = [list(map(int, input().split())) for _ in range(h)]
  visited = [[False] * w for _ in range(h)]
  count = 0

  for i in range(h):
      for j in range(w):
          if map_lst[i][j] == 1 and not visited[i][j]:
              bfs(i, j)
              count += 1

  print(count)

```
#### 풀이 아이디어
- BFS 한 번 = 섬 하나
- 방문 여부를 체크하는 visited 배열 사용
- 8방향 탐색을 위한 dx, dy 방향 리스트 사용
- 좌표 범위 체크 (0 ≤ nx < h, 0 ≤ ny < w)
- 방문하지 않은 1을 만나면 bfs() 호출 → count += 1

## Q6) BOJ 2606: 바이러스
- 문제: https://www.acmicpc.net/problem/2606?utm_source=chatgpt.com

### 문제 설명
> 네트워크 상에서 1번 컴퓨터가 바이러스에 감염되었을 때, **1번 컴퓨터를 통해 바이러스에 감염되는 컴퓨터의 수**를 구하는 문제.
컴퓨터 간 연결 상태가 주어지며, 연결된 컴퓨터끼리는 바이러스가 퍼질 수 있음.
- 입력: 컴퓨터 수, 연결 정보
- 출력: **감염된 컴퓨터 수** (1번 컴퓨터 제외)

### 문제 풀이 아이디어
#### 1. 그래프 탐색 문제
- 각 컴퓨터를 노드, 연결 정보를 간선
- 전체 구조는 무방향 그래프
#### 2. BFS or DFS 사용
- 1번 노드에서 시작하여 연결된 모든 컴퓨터 탐색
- 방문한 컴퓨터 수 - 1 = 감염된 컴퓨터 수
	- (1번 컴퓨터는 이미 감염되어 시작점이므로 제외)
#### 3. 자료구조 설계
- 'com_graph': 인접 리스트 방식으로 연결 정보 저장
- 'visited': 감염 여부를 확인할 리스트 (중복 방지)
- 'queue': BFS 탐색을 위한 큐
- 'count': 감염된 컴퓨터 수 (1번은 제외하고 +1씩 증가)

### 코드
```python
from collections import deque
#BFS 쓸 거니까 일단 붙이고

def bfs(v):
  global count #웜 바이러스 카운팅
  queue = deque([v])
  visited[v] = True #여긴 1번 컴퓨터라 카운팅 x
  while queue:
    v = queue.popleft()
    for i in com_graph[v]:
      if not visited[i]:
        queue.append(i)
        visited[i] = True #큐에 넣을 때 방문 체크
        count += 1

#먼저 입력 코드부터 짠다
com = int(input()) #컴퓨터의 수(정점 수)
com_net = int(input()) #연결된 컴퓨터 쌍의 수(간선 수)

#그래프부터 짠다
com_graph = [[] for _ in range(com+1)] #컴퓨터 수 만큼 인접 리스트 생성

for i in range(com_net): #이어진 간선 수 만큼 반복
  #여기에서 인접 리스트 만들어야 함
  a, b = map(int, input().split()) #연결된 컴퓨터 쌍 입력
  com_graph[a].append(b)
  com_graph[b].append(a)

#무조건 1번 컴퓨터가 웜바이러스라 1번 컴퓨터가 V
#연결되어 있으면 다 웜바이러스 
#한 사이클 내에 있으면 다 웜바이러스

visited = [False]*(com+1) #방문 여부 체크
count = 0

bfs(1)
print(count)

```
### 틀린 부분 & 개념 정리

| 문제/실수                           | 설명                                                             |
| ------------------------------- | -------------------------------------------------------------- |
| `com_graph[a].append(input(b))` | `input(b)`는 사용자 입력을 또 받겠다는 의미 → `append(b)`로 수정해야 함            |
| `bfs(com_graph[1])`             | `bfs(1)`이 맞음. `com_graph[1]`은 **리스트**(1번 컴퓨터와 연결된 노드 목록)라서 잘못됨 |
| `visited[v] = True` 위치          | 큐에 넣을 때 방문 처리를 해야 중복 탐색 방지 가능                                  |
| `global count` 위치               | 전역 변수 `count`를 함수 안에서 변경할 수 있도록 해야 함                           |
| **노드 번호 자체로 탐색**                | `bfs(1)` → 숫자 1은 **노드 번호**, 이걸 기반으로 탐색                         |

## Q7) BOJ 24479: 알고리즘 수업-DFS 1
- 문제: https://www.acmicpc.net/problem/24479

### 문제 설명
> N개의 정점과 M개의 간선으로 이루어진 무방향 그래프가 주어짐
시작 정점 R에서 DFS로 그래프를 탐색할 때, **각 정점이 몇 번째로 방문되었는지** 출력

- 정점 번호: 1번부터 N번까지 존재
- 방문할 수 없는 정점은 방문 순서를 0으로 출력
- DFS는 인접 정점을 오름차순으로 방문해야 한다

### 문제 풀이 아이디어
1. DFS로 탐색하면서 방문 순서를 1부터 증가시켜 기록
2. 방문 순서는 정점 번호 → 방문 순서로 매핑돼야 함
3. DFS는 재귀로 구현
4. 인접 리스트를 오름차순 정렬한 뒤 탐색해야 문제 조건에 부합함

### 자료구조 설계
| 변수 이름     | 설명                                                |
| --------- | ------------------------------------------------- |
| `graph`   | 각 정점의 인접 정점을 저장한 리스트 (`graph[i] = [j1, j2, ...]`) |
| `visited` | 정점의 방문 여부를 저장하는 리스트 (`True/False`)                |
| `sol`     | 정점 별 방문 순서를 저장하는 리스트 (`sol[i] = i번째 정점의 방문 순서`)   |
| `count`   | 방문 순서를 기록하기 위한 전역 변수                              |


### 코드
```python
import sys
sys.setrecursionlimit(10**6)
input = sys.stdin.readline

N, M, R = map(int, input().split())

graph = [[] for _ in range(N+1)]
visited = [False] * (N+1)
sol = [0] * (N+1)
count = 1  # 방문 순서 시작은 1

def dfs(v): 
    global count
    visited[v] = True
    sol[v] = count
    for i in graph[v]:
        if not visited[i]:
            count += 1
            dfs(i)

for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N+1):
    graph[i].sort()

dfs(R)

for i in range(1, N+1):
    print(sol[i])

```

### 틀린 부분 & 개념 정리
| 실수 또는 의문                         | 원인                                | 해결 방법                                               |
| -------------------------------- | --------------------------------- | --------------------------------------------------- |
| `sol = []`인데 `sol[v] = count` 사용 | 인덱스 접근 불가 (`IndexError`)          | `sol = [0] * (N+1)`로 미리 크기 확보                       |
| `count += 1`에서 오류                | 함수 내부에서 전역 변수 수정 시 `global` 선언 필요 | `global count` 선언 추가                                |
| `graph.sort()` 사용                | 전체 리스트 정렬은 의미 없음                  | `for i in range(1, N+1): graph[i].sort()`로 각 정점별 정렬 |
| 출력 루프 `range(N)` 사용              | 0번 정점은 없음. 1번부터 N번까지 출력해야 함       | `range(1, N+1)`로 수정                                 |

## Q8) BOJ 1012: 유기농 배추
- 문제: https://www.acmicpc.net/problem/1012

### 문제 설명
>- N x M 크기의 배추밭에서, 배추가 심어진 위치만 주어짐
- 배추는 상하좌우로 연결되어 있을 경우 하나의 배추 군집으로 간주
=> **한 배추 군집마다 배추흰지렁이 한 마리를 심어야 하므로,
필요한 지렁이 수 = 총 군집의 개수를 구하기**

- 테스트케이스 T개
- 각 테스트케이스마다 M x N 밭, 배추의 개수 K개, 배추 위치 K개가 주어짐
### 문제 풀이 아이디어
- 배추가 심어진 위치만 1, 나머지는 0으로 처리
- 2차원 리스트에서 상하좌우로 연결된 1들을 하나의 군집으로 봄
- DFS/BFS를 통해 연결된 영역을 탐색하면서 방문 처리
- 아직 방문하지 않은 배추를 만나면, 그 지점부터 BFS/DFS를 돌고 군집 수 +1

### 자료구조 설계
| 변수              | 설명                       |
| --------------- | ------------------------ |
| `field[N][M]`   | 배추밭 상태 (0: 없음, 1: 배추 있음) |
| `visited[N][M]` | 방문 여부 기록 배열              |
| `dx, dy`        | 방향 리스트 (상, 하, 좌, 우)      |
| `queue`         | BFS 탐색을 위한 좌표 저장         |
| `count`         | 배추 군집 수 (= 배추흰지렁이 수)     |


### 코드
```python
from collections import deque

#입력 받는 조건
T = int(input())


#방향 리스트 => 상하좌우
dx = [0, 0, -1, 1]
dy = [-1, 1, 0, 0]

#2차원부터는 좌표로 체크?
def bfs(x, y, N, M):
  queue = deque()
  queue.append((x, y))
  visited[y][x] = True #시작점 방문 처리

  while queue: 
    x, y = queue.popleft()
    for i in range(4):
      nx = x + dx[i]
      ny = y + dy[i]

      if nx < 0 or nx >= N or ny < 0 or ny >= M:
        continue
      if not visited[ny][nx] and field[ny][nx] == 1:
          visited[ny][nx] = True
          queue.append((nx, ny))
  

#테스트 조건 만큼 체크해야 함
for _ in range(T):
  M, N, K = map(int, input().split())
  #배추밭 가로길이 M, 세로 길이 N, 배추 개수 K
  #배추밭 생성 + 아직 배추 없다고 생각하고 0으로 초기화
  field = [[0] * M for _ in range(N)]

  visited = [[False] * M for _ in range(N)]

  #베추 위치 <- K개
  for _ in range(K):
    x, y = map(int, input().split())
    #배추 좌표 입력
    field[y][x] = 1 #배추 심었음 -> 1인 부분만 배추라고 판단해야 하니까

  #인접한 배추 한 뭉치  => bfs 한 사이클
  #한 사이클 count => 배추흰지렁이 마릿수

  count = 0 #배추흰지렁이 마릿수

  for i in range(N):  # 세로줄 순회 (위에서 아래로)
   for j in range(M):  # 가로줄 순회 (왼→오)
      if field[i][j] == 1 and not visited[i][j]:
          bfs(j, i, M, N)  # bfs(x, y)
          count += 1  # 새로운 무더기 발견
  
  print(count)
```

### 틀린 부분 & 개념 정리
| 실수                  | 원인                            | 해결                            |
| ------------------- | ----------------------------- | ----------------------------- |
| `visited[x][y]`로 접근 | 2차원 리스트에서 x는 열, y는 행인데 순서 착각  | → `visited[y][x]`로 수정         |
| `M, N`을 함수 안에서 사용   | 지역변수인데 전역처럼 사용해서 `IndexError` | → `bfs(x, y, N, M)`로 명시적으로 전달 |
| `print(count)` 위치   | 테스트케이스 루프 바깥에서 출력             | → 각 테스트케이스마다 출력하도록 루프 안으로 이동  |

### 파이썬 2차원 배열에서 행/열 개념 정리
- `list[y][x]` 형태로 접근
- **행(row)** = 세로 방향 = `y` = **첫 번째 인덱스**
- **열(col)** = 가로 방향 = 'x' = **두 번째 인덱스**

#### 예시
```
grid = [
    [1, 2, 3],  # 0행
    [4, 5, 6],  # 1행
    [7, 8, 9]   # 2행
]
```
- `grid[1][2]` → 1행 2열 → 값은 6
- 즉, `grid[y][x]`로 생각하면 됨

#### 반복문 구조
```python
for y in range(N):      # 행 (세로)
    for x in range(M):  # 열 (가로)
        grid[y][x]
```

> **파이썬 2차원 배열은 `list[세로][가로]` -> `list[y][x]` 순서로 접근한다**

## Q9) BOJ 24480: 알고리즘 수업 - 깊이 우선 탐색 2
- 문제: https://www.acmicpc.net/problem/24480

### 처음 코드
```python
N, M, R = map(int, input().split())
graph = [[] for _ in range(N+1)]
visted = [0] * (N+1)

count = 1

def dfs(v):
    visted[v] = 1
    for i in graph[v]:
        if visted[i] == 0:
            dfs(i)

for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N+1):
    graph[i].sort(reverse=True)

dfs(R)

```

#### 문제점

| 문제                             | 설명                                   |
| ------------------------------ | ------------------------------------ |
| 방문 순서를 저장하지 않음                 | `visted[v] = 1`만 저장 → 모두 방문 순서 1로 찍힘 |
| 방문 순서 카운팅 변수 `count`를 증가시키지 않음 | `count += 1`이 없음                     |
| `global count` 선언 누락           | `dfs()` 내부에서 전역 변수 수정 시 `global` 필요  |
| `RecursionError` 발생            | 입력 크기가 커서 재귀 깊이 초과 발생                |
| 출력 코드 없음                       | 방문 순서를 출력하지 않아 오답                    |
#### 해결
- `visted[v] = count`로 방문 순서 저장
- `count 전역 변수` 선언 후 DFS마다 증가
- `global count` 사용해 함수 내에서도 전역 변수 수정 가능하게
- `sys.setrecursionlimit(10**6)`로 재귀 깊이 확장
- DFS 종료 후 `visited` 리스트를 출력

### 최종 코드
```python
import sys
sys.setrecursionlimit(10**6)  # 🔥 이거 없으면 RecursionError 뜰 수 있음

N, M, R = map(int, sys.stdin.readline().split())
graph = [[] for _ in range(N + 1)]
visited = [0] * (N + 1)
count = 1

def dfs(v):
    global count
    visited[v] = count
    count += 1
    for i in graph[v]:
        if visited[i] == 0:
            dfs(i)

for _ in range(M):
    u, v = map(int, sys.stdin.readline().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort(reverse=True)

dfs(R)

for i in range(1, N + 1):
    print(visited[i])

```

#### 정리

| 문제          | 해결                                |
| ----------- | --------------------------------- |
| 방문 순서 저장 누락 | `visited[v] = count`로 변경          |
| 순서 누적 안 됨   | `count += 1` 추가                   |
| 전역 변수 오류    | `global count` 선언                 |
| 재귀 깊이 초과    | `sys.setrecursionlimit(10**6)` 추가 |
| 출력 누락       | DFS 이후 for문으로 출력 추가               |


## Q10) BOJ 24444: 알고리즘 수업: 너비 우선 탐색 1 (BFS)
- 문제: https://www.acmicpc.net/problem/24444

### 문제 설명
> - 정점의 수 𝑁, 간선의 수 시작 정점 
𝑅
- 무방향 그래프에서 BFS를 수행하며 방문한 순서를 각 정점별로 출력해야 
- 인접 정점은 오름차순으로 방문해야 하며, 방문하지 않은 정점은 0으로 출력

### 해결 아이디어
#### 기본 흐름
1. 인접 리스트로 그래프 구성 (`graph = [[] for _ in range(N+1)]`)
2. BFS에서는 큐(`deque`)를 사용해 탐색
3. 방문 순서는 `visited[v]` = 순서 형태로 저장
4. 탐색 순서를 보장하기 위해 인접 리스트를 오름차순 정렬
(`graph[i].sort())`

#### 핵심 구현 로직
```python
from collections import deque

def bfs(start):
    global count
    visited[start] = count
    q = deque([start])

    while q:
        v = q.popleft()
        for i in graph[v]:
            if visited[i] == 0:
                count += 1
                visited[i] = count
                q.append(i)

```

### 피드백

| 항목 | 내용 | 해결 방법 |
|------|------|------------|
| 직전 DFS 코드 기반으로 사고함 | DFS 구조에 익숙해져서 BFS에서도 `for i in graph[v]`만 반복함 | `deque`에서 꺼낸 값을 기준으로 반복해야 함 (`v = q.popleft()`) |
| BFS 흐름 이해 부족 | 큐에서 꺼낸 값을 갱신하지 않아서 시작 정점만 무한 반복 | `v = q.popleft()` 사용으로 매 탐색마다 기준 노드 갱신 |
| 방문 순서 저장 방식 착오 | 방문만 체크하고 순서(count)를 증가시키지 않음 | `visited[i] = count`, `count += 1` 구조로 수정 |
| 인접 노드 정렬 누락 | 문제 조건: 오름차순으로 방문해야 함을 간과함 | `graph[i].sort()` 추가 |
| 시간 초과 발생 | `input()` 함수 사용으로 대용량 입력 처리에 느림 | `sys.stdin.readline()`으로 변경 |

### 코드
```python
from collections import deque
import sys
N, M, R = map(int, input().split())
input = sys.stdin.readline

graph = [[] for _ in range(N+1)]
visited =  [0] * (N+1)
count = 1

def bfs(v):
  global count
  visited[v] = count
  q = deque([v])

  while q:
    v = q.popleft()
    for i in graph[v]:
      if visited[i] == 0: #방문 안 했으면
        count += 1
        visited[i] = count
        q.append(i)
      
  
for i in range(M):
  u, v = map(int, input().split())
  graph[u].append(v)
  graph[v].append(u) #무방향 그래프

for i in range(1, N+1):
  graph[i].sort() #오름차순 정렬


bfs(R)

for i in range(1, N+1):
  print(visited[i])
```