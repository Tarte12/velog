---
title: 'Study) 1회차) 발표 문제 BOJ 2751, Programmers - k번째 수 (Python)'
slug: WEEK-1-발표-문제-BOJ-2751-Programmers-k번째-수-Python
date: 2025-05-29T09:20:54.859Z
tags: []
---
# BOJ 2751

## 문제 

### 문제 요약
- 정수 N개가 주어졌을 때, 오름차순 정렬한 후 출력하는 문제
- N의 최대값이 1,000,000개라는 조건 존재 => **입출력 처리 속도가 중요**

### 설계
- 정수 N개를 입력 받고 -> int(input())
- 정렬하면 된다고 생각 -> sort()
### 코드
```
#초기 코드
N = int(input()) #파이썬은 입력을 문자열로 받아 변환 필요

lst = [] #리스트 선언

for i in range(N): #0부터 N-1이니까 N번 돌아서 상관 ㄴㄴ
	num = int(input())
	lst.append(num)


lst.sort()

for n in lst:
	print(n)

```

-> 시간 초과? => input() 문제 같아서 sys.stdin.readline 이용하는 걸로 방향 바꿈

```
#최종 코드
import sys # sys.stdin.readline() 쓰기 위해 코드 추가

#여러 줄 입력 받을 땐 반드시 sys.stdin.readline() 사용

N = int(sys.stdin.readline())

lst = [] #리스트 선언

for i in range(N): #0부터 N-1이니까 N번 돌아서 상관 ㄴㄴ
	num = int(sys.stdin.readline())
	lst.append(num)

lst.sort() #리스트 오름차순 정렬 함수 sort()

for n in lst:
	print(n)

```

## 알아야 할 개념
### sys.stdin.readline() 사용법

#### sys.stdin.readline()를 왜 써야 할까?
- `input()`은 한 줄 입력을 받을 때마다 내부적으로 여러 동작이 일어나서 느림
- `sys.stdin.readline()`은 버퍼에서 한번에 읽어와서 빠름
- 대신 개행문자가 포함되므로 `.strip()`이나 `int()` 변환 필요

#### 출력도 대체제가 있음
- 입력이 아닌 출력의 경우도 `print()` 대신 `sys.stdout.write()` 고려
- 빠른 출력
```
import sys
sys.stdout.write('\n'.join(map(str, lst)))
```
#### 한 개의 정수 입력받기
```
import sys
a = int(sys.stdin.readline())
```
** a = sys.stdin.readline은 왜 안 될까? **
- 한줄 단위로 입력받아 개행문자가 포함됨 => 개행 문자 제거 필요
- 변수가 문자열 형태(str)로 저장됨 => 형 변환 필요

#### 정해진 개수의 정수를 한줄에 입력받기
```
import sys
a, b, c = map(int, sys.stdin.readline().split())
```
- `map()`: 반복 가능한 객체에 대해 각각의 요소들을 지정된 함수로 처리
- 공백 기준으로 잘라서(split()), 읽어서(sys.stdin~), 반복 가능한 객체에 대해 형 변환(int) 함수로 처리
#### 임의의 개수의 정수를 한줄 입력받아 리스트에 저장하기
```
import sys
data = list(map(int, sys.stdin.readline().split())
```
- `split()`: 문자를 나누는 함수
- 특정값을 넣으면 그 값을 기준으로 문자열을 나누고, 값을 넣지 않으면 공백 기준으로 나눔
- `list()': 자료형을 리스트로 변환하는 함수
- `map()`을 리스트로 바꿔 주기 위해서 `list()`로 형 변환
#### 임의의 개수의 정수를 n줄 입력받아 2차원 리스트에 저장하기
```
import sys
data = []
n = int(sys.stdin.readline())
for i in range(n):
    data.append(list(map(int,sys.stdin.readline().split())))
```
**동작 구조**
```
#예제 입력
3
10 20
30 40
50 60

#코드
data = []
n = 3
for i in range(n):
    row = list(map(int, sys.stdin.readline().split()))
    data.append(row)
```
- list(map(int, input().split())) -> 리스트 한 줄을 만든다 [10, 20]
- 이걸 다시 data에 넣으면(append) 저게 통으로 들어감 [[10, 20]]
**더 간결한 코드**
```
data = [list(map(int, sys.stdin.readline().split()] for _ in range(n)
```
#### 문자열 n줄을 입력받아 리스트에 저장하기
```
import sys
n = int(sys.stdin.readline())
data = [sys.stdin.readline().strip() for _ in range(n)]
```
- strip()은 문자열의 앞뒤 공백 문자를 제거함

### 정렬 함수: sort() VS sorted()
#### sort()
-`lst.sort()`: lst라는 `list`를 오름차순 정렬하는 함수
- 원본값 직접 수정
- `lst.sort(reverse = True)`: 내림차순 정렬

#### sorted()
- `lst_2 = sorted(lst_1)`: 재선언 형태로 사용해야 함
- 원본값을 그대로 유지하고 정렬값을 반환함
- 기본적으로 오름차순
-`lst_2 = sorted(lst_1, reverse = True)`: 내림차순 정렬

#### 코테에서 왜 구분해서 써야 할까?
**1. 원본이 바뀌면 안 될 때 or 원본을 사용해야 할 때**
- 원본이 살아있는 `sorted()` 사용
**2. 리스트가 아닌 자료형(문자열, 튜플)을 정렬해야 할 때**
- `sort()`는 리스트 정렬만 가능
- `sorted()` 사용해야 함

### 코딩테스트에서 자주 나오는 정렬 응용
- 좌표 정렬: `(x, y) 쌍 정렬` -> `sorted(arr, key=lambda x:(x[0], x[1]))`
- 문자열 정렬: `sorted(string)`
- 사용자 정의 정렬: `key=` 매개변수 활용
- 정렬 후 중복 제거:`sorted(set(lst))`

### ADT(추상 자료형)

#### List(리스트, 배열)
| 항목     | 설명                                                     |
| ------ | ------------------------------------------------------ |
| ADT 정의 | **순서가 있는 데이터 집합**, 중복 O                                |
| 주요 연산  | `append`, `index`, `sort`, `len`, 슬라이싱 등               |
| 시간복잡도  | `append`: O(1), `index`/`in`: O(n), `sort`: O(n log n) |
| 사용 이유  | - 입력 데이터를 순서대로 저장<br>- 정렬 가능<br>- 순회하며 출력하기 쉬움         |

#### Set
| 항목     | 설명                                                  |
| ------ | --------------------------------------------------- |
| ADT 정의 | **중복이 없는 데이터 집합**, 순서 X                             |
| 연산     | `add`, `remove`, `in`, `set()`                      |
| 관련성    | 만약 **중복 제거 + 정렬** 문제가 나왔다면 `set` → `sorted()` 조합 활용 |

#### Queue
| 항목  | 설명                                                                                       |
| --- | ---------------------------------------------------------------------------------------- |
| 개념  | 선입선출 구조 (FIFO)                                                                           |
| 관련성 | 입출력이 많을 때, `deque`나 `sys.stdin.readline()`으로 **입력 버퍼 처리**하는 건 **큐와 비슷한 구조의 활용**으로 볼 수 있음 |

# 프로그래머스 - K번째 수
https://school.programmers.co.kr/learn/courses/30/lessons/42748

## 문제 

### 문제 요약
- 주어진 배열을 2차원 배열인 commands에서 주어진 [i, j, k]를 기준으로 i번째부터 j번째까지 잘라 정렬한 후, k번째의 수를 반환하라는 문제

### 설계
- commands에서 [i, j, k]를 뽑아내서 이것으로 array를 슬라이싱하면 될 것이라 생각함
### 코드
```
# 초기 코드
def solution(array, commands):
    
    lst = []
    answer = []
    for n in commands:
        
        i = commands[[n][0]]
        j = commands[[n][1]]
        k = commands[[n][2]]
        
        lst = array[i-1:j]
        
        answer.append(lst[k-1])
    
    return answer
```

-> 문제 설계는 맞는 것 같은데 문법 문제 같음
-> commands[[0][1]] -> 그냥 n = [i, j, k]를 의미하므로 n[0], n[1], n[2]로 작성하면 됨
-> 정렬하라는 설명을 못 봄 -> 슬라이싱 후 lst.sort()로 정렬
```
# 최종 코드
def solution(array, commands):
    
    lst = []
    answer = []
    for n in commands:
        
        i = n[0]
        j = n[1]
        k = n[2]
        
        lst = array[i-1:j]
        lst.sort()
        
        answer.append(lst[k-1])
    
    return answer
```
## 알아야 할 개념

>내가 부족하거나 헷갈린다고 생각했던 포인트
> - 파이썬 슬라이싱
> - for문에서 리스트 순회 방식(1차원 VS 2차원)
> - 자바와의 차이
> - 2차원 리스트에서 헷갈리기 쉬운 구조

### 파이썬 슬라이싱
```
lst = [10, 20, 30, 40, 50]
print(lst[1:4])  # [20, 30, 40]

```
| 표현          | 의미                  |
| ----------- | ------------------- |
| `lst[a:b]`  | a번 인덱스부터 b-1번까지 자른다 |
| `lst[:b]`   | 처음부터 b-1번까지         |
| `lst[a:]`   | a번부터 끝까지            |
| `lst[::-1]` | 전체 역순               |

### for문과 리스트 순회(1차원 VS 2차원)

#### 1차원 리스트
```
lst = [10, 20, 30]

for i in lst:
    print(i)  # 요소 값 출력: 10, 20, 30

```
- `for i in lst`에서 `i`는  **인덱스 숫자가 아닌 리스트 요소값**
- 자바에서 쓰려면 `for(int i : lst)` 같은 향상된 for문을 사용해야

#### 2차원 리스트

```
lst2 = [[1, 2], [3, 4], [5, 6]]

for row in lst2:
    print(row)  # 각각의 리스트: [1, 2], [3, 4], ...
    

#내부 루프를 돌고 싶다면?
for row in lst2:
    for val in row:
        print(val)  # 1, 2, 3, 4, 5, 6

```
| 대상                | 설명                            |
| ----------------- | ----------------------------- |
| `for row in lst2` | \*\*2차원 리스트의 각 행(리스트)\*\*를 순회 |
| `for val in row`  | 각 행의 요소들을 순회                  |

### 자바와 파이썬 사고방식 차이
| 자바 사고방식                   | 파이썬 실제 동작                   |
|-------------------------------|----------------------------------|
| `i`는 보통 인덱스             | `for i in arr`에서 `i`는 요소값   |
| `arr[i]` 중심                 | 요소 자체를 직접 순회             |
| `for (i = 0; i < n; i++)` 기본 | `for x in arr`가 기본 구조         |
-> 자바로 접근을 하게 되니까 자꾸 `i = 인덱스`로 생각하게 되고, `for i in arr` 안에서 `arr[i]`로 쓰려고 한다. 이 부분을 주의해야 할 거 같다




**참고**
1. https://velog.io/@yeseolee/Python-%ED%8C%8C%EC%9D%B4%EC%8D%AC-%EC%9E%85%EB%A0%A5-%EC%A0%95%EB%A6%ACsys.stdin.readline