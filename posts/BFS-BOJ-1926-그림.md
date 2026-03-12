---
title: 'BFS) BOJ 1926 그림'
slug: BFS-BOJ-1926-그림
date: 2025-07-22T09:07:12.738Z
tags: []
---
## 정답 코드
```python
from collections import deque

# 입력
n, m = map(int, input().split())
graph = [list(map(int, input().split())) for _ in range(n)]

# 방향 (상하좌우)
dx = [0, 0, -1, 1]
dy = [1, -1, 0, 0]

# 방문 체크 배열
visited = [[False] * m for _ in range(n)]

def bfs(x, y):
    queue = deque([(x, y)])  # ✅ deque는 함수니까 소괄호
    visited[x][y] = True
    pic = 1  # 넓이

    while queue:
        x, y = queue.popleft()

        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]

            # ✅ 범위 체크 수정 (0 <= ny)
            if 0 <= nx < n and 0 <= ny < m:
                if not visited[nx][ny] and graph[nx][ny] == 1:
                    visited[nx][ny] = True
                    queue.append((nx, ny))
                    pic += 1

    return pic

# 전체 그림 탐색
count = 0
max_pic = 0

for i in range(n):
    for j in range(m):
        if not visited[i][j] and graph[i][j] == 1:
            pic = bfs(i, j)
            count += 1
            max_pic = max(max_pic, pic)

print(count)
print(max_pic)

```