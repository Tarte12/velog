---
title: 'Pro) Lv3 양과 늑대'
slug: Pro-Lv3-양과-늑대
date: 2025-10-05T07:22:16.989Z
tags: []
---
> Git: https://github.com/Tarte12/CodingTest_KUT/commit/ee7ba6428a2e7d7ea94e07e8eb2b02fac6514a01

**문제 설계 **
1. edges 내용을 기반으로 인접 리스트를 통한 그래프 구현
2. 그래프를 토대로 탐색 가능한 DFS 구현
3. visited 방식 X -> 한 번 간 경로도 다시 갈 수 있으므로 갈 수 있는 후보를 체크하는 방식으로 

**왜 `visited`는 안될까?**
- 해당 문제는 **현재까지 모은 양/늑대 수 + 지금까지 열어둔 후보 노드 집합**에 의해 다음 이동 결정
- 어떤 노드는 A 경로에선 위험(늑대 >= 양)이라 막혔지만, **다른 경로에선 양이 더 많아져 유효한 가능성 가능**
- 전역 `visited[n] = True`로 막아버리면 **경로별 상태 차이 무시**하는 경우 발생

**후보 집합 기반 DFS**
- `visited` 대신 **현재 방문 가능 후보 노드 집합**을 들고 다니기
- 한번에 자식만 가는 게 아니라 **지금까지 방문한 모든 노드들의 자식 중 미방문 노드** 포함 선택

**상태**
- `sheep`, `wolf` (현재 수)
- `candidates` (다음에 갈 수 있는 노드들의 집합/리스트)
- `taken_mask` => 비트마스크로 방문 노드 집합 기록
	- 비트마스크: 방문 기록을 0과 1로 저장하는 메모장
- 메모이제이션 `taken_mask, sheep, wolf)` or `(taken_mask, sheep)`으로 가지치기
	- 메모이제이션 = 이미 계산한 상태는 또 하지 말자

**핵심 아이디어 요약**
| 개념         | 설명                                                            |
| ---------- | ------------------------------------------------------------- |
| **그래프 구성** | `edges`를 이용해서 `graph[parent].append(child)` 형태로 인접 리스트 만듦     |
| **DFS 탐색** | 현재 노드 방문 시, `양` 또는 `늑대` 개수 증가                                 |
| **가지치기**   | 늑대 수가 양 수 이상이 되는 순간 더 이상 진행 불가                                |
| **다음 상태**  | 단순히 자식만 가는 게 아니라, “지금까지 방문한 노드들의 자식 중 아직 방문 안 한 애들”도 모두 탐색 가능 |
| **백트래킹**   | 각 DFS 호출 후 원상복구(상태를 복사하거나 리스트 관리)                             |

#### 코드
```python
from collections import deque
import sys
sys.setrecursionlimit(10**6)

def solution(info, edges):
    # 1) 그래프 구성
    n = len(info)
    graph = [[] for _ in range(n)]
    for parent, child in edges:
        graph[parent].append(child)

    answer = 0

    # 2) DFS: 후보 집합 기반
    def dfs(sheep, wolf, candidates, taken_mask):
        nonlocal answer
        # 현재 양 수로 정답 후보 갱신
        if sheep > answer:
            answer = sheep

        # 후보가 없으면 끝
        if not candidates:
            return

        # 후보 중 하나를 선택해서 진행
        for node in list(candidates):
            # 다음 상태 계산
            ns, nw = sheep, wolf
            if info[node] == 0:
                ns += 1
            else:
                nw += 1

            # 가지치기: 늑대가 양 이상이면 진행 불가
            if ns <= nw:
                continue

            # 다음 후보 집합 만들기
            next_candidates = set(candidates)
            next_candidates.remove(node)
            # node의 자식들을 후보에 추가
            for child in graph[node]:
                if not (taken_mask & (1 << child)):  # 이미 뽑은 노드는 제외
                    next_candidates.add(child)

            # 방문 마스크 갱신
            next_mask = taken_mask | (1 << node)

            # [선택] 메모이제이션/가지치기 추가할 자리 (TODO)
            # ex) seen[(next_mask, ns, nw)] 등으로 상태 컷

            dfs(ns, nw, next_candidates, next_mask)

    # 3) 시작 상태 설정
    # 후보: {0}, 아직 어떤 노드도 뽑지 않음
    start_candidates = {0}
    start_mask = 0

    # 보통은 0을 후보로 둔 뒤, 재귀 안에서 0을 '선택'하는 흐름으로 통일
    dfs(0, 0, start_candidates, start_mask)

    return answer

```