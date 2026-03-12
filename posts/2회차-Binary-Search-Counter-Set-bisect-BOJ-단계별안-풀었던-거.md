---
title: '2회차) Binary Search, Counter, Set, bisect, BOJ 단계별(안 풀었던 거)'
slug: 2회차-Binary-Search-Counter-Set-bisect-BOJ-단계별안-풀었던-거
date: 2025-05-31T10:52:25.943Z
tags: []
---
BOJ 단계별: 이분 탐색 https://www.acmicpc.net/step/29

# 공통 문제: **BOJ 1920, Programmers 가장 큰 수**

**06/02 화**
# 1. 🧩 BOJ 1920

-문제: https://www.acmicpc.net/problem/192

```python
import sys

N = int(sys.stdin.readline())
A = set(map(int, sys.stdin.readline().split()))
M = int(sys.stdin.readline())
B = list(map(int, sys.stdin.readline().split()))

for i in B:
    if i in A:
        print(1)
    else:
        print(0)

```
## 피드백
1. set을 떠올리지 못해서 못 푼 것일까?
- 파이썬에서는 bst가 없고, 이것을 대체하는 내장 함수를 사용함
- 값의 존재 여부만 따지는 경우 `set`이 적합
- 리스트로 풀면 시간 초과 (for문을 쓰면 이중으로 list를 돌기 때문에 시간복잡도가 O(N X M)이 됨)

2. bisect를 쓰지 않은 게 맞는 방향일까?
- 파이썬에서 bst 대신 bisect를 쓴다고 해서 써 보려고 하였으나, 값의 존재 유무만 판단할 때 쓰기 적절한 함수가 아니라고 판단
- bisect: 정렬된 리스트에서 위치를 찾거나 삽입 <= 이렇게 할 의무가 없음
- 또한 bisect는 **정렬된 리스트**를 기반으로 동작하고, 이진 탐색을 수행하므로 시간복잡도가 O(log N)
- set: **해시 테이블**을 사용함 => 값을 지정할 때 특정한 **해시 함수**를 통해 고유 인덱스를 계산
- 이 인덱스를 기반으로 바로 접근 => **탐색 속도 일정(평균(O(1))**
- key idea: 값을 저장할 때 어디에 저장할지 미리 계산 
=> 나중에 찾을 때 그 계산된 위치로 바로 감

# 2. 🧩 가장 큰 수 
- https://school.programmers.co.kr/learn/courses/30/lessons/42746

## 1. 초기 코드
```python
def solution(numbers):
    str_num = str(numbers)
    
    for i in str_num:
        if i > i+1:
            tmp = i+1
            i+1 = i
            i = tmp
            
    answer = str_num
    return answer

```
### 1.1 의도
- 문자열로 비교하면 사전순 정렬로 비교할 것이고,
- 숫자 비교라면 3 < 30이겠지만, 문자열 비교는 3 > 30일 것이라 유리하다고 생각해서 문자열 변환

### 1.2 문제점
- 문자열끼리 비교하고 위치를 바꾸려 함 => 문자열 요소끼리 swap 불가능
- `i + 1` 같은 표현은 문자열 인덱스 X
- 아예 str_num[i]와 str_num[i+1] 비교해서 swap 하는 아이디어 포기

## 2. 최종 코드
```python
def solution(numbers):
    
    str_num = list(map(str, numbers))
    
    str_num.sort(key=lambda x: x*3, reverse=True)
    
    answer = ''.join(str_num)
    return answer
```
### 2.1 아이디어 흐름
1. 문자열 변환
- 숫자로 비교하면 `3 < 30` -> `303`
- 문자열로 비교하면 `"3" > "30"` -> `330`
2. 예외 상황
- `3 > 34`가 문자열 기준으로도 True이기 때문에 `334`가 됨 -> `343`가 되어야 함
- 해결 방법: `3*2 -> 33`해서 `34*2 -> 3434` 하면 `33 < 34`가 되기 때문에 -> `34(34)3(3)` 가능
3. 왜 x*3알까?
- numbers의 최대 원소가 1000
- 따라서 999까지 -> 3자리까지만 체크하면 됨
4. 최종 정렬 방식
- `key=lambda x:x*3`: 문자열 비교를 기준으로 3번 반복한 상태로 설정
- `reverse=True`: 큰 수부터 나열
5.join()
- 문자열 리스트 하나의 문자열로 합침

## 3. 피드백
| 개념             | 설명                                            |
| -------------- | --------------------------------------------- |
| 문자열 비교         | `"3" > "30"` → 사전순 기준으로 판단함                   |
| 커스텀 정렬 key     | `lambda x: x*3`은 정렬 기준을 조작하는 핵심               |
| 정렬 방향          | 큰 숫자부터 이어붙이기 위해 `reverse=True` 사용             |
| 문자열 결합         | `''.join(list)`로 결합, `join()` 대상은 문자열 리스트여야 함 |
| 숫자 → 문자열       | 숫자를 비교하기 전에 `map(str, numbers)`로 변환 필요        |
| 문자열 → 숫자 → 문자열 | `"000"` → `int()` → `"0"` 으로 변환하여 결과값 보정      |


# Daily 문제 (18문제) 

# 3. 🧩 BOJ 10816
## 코드
```python
#초기 코드
for i in check:    
    for j in cards:
        if i == j:
            res = 1
            print(res)
            break
    print(res)

```
- 방향성: cards 리스트에서 check 리스트의 숫자가 몇 번 등장하려는지 세려고 함
- 실패 포인트
1. 이중 반복문 -> **시간복잡도가 O(N X M)** => **시간 초과**
2. 중첩 루프 안에서 break, print 위치를 제어하기 까탈스러움

```python
#중간 설계
count = [0 for i in range(M)]

for i in range(M):
    for j in cards:
        if j == check[i]:
            count[i] += 1

print(*count)

```
- 방향성: count 배열을 만들어 각 숫자의 갯수를 카운팅하려고 함
- 실패 포인트
1. 여전히 시간 복잡도의 문제 존재
```python
#최종 설계
import sys
from collections import Counter

N = int(sys.stdin.readline()) #상근이 숫자 카드 개수
cards = list(map(int, sys.stdin.readline().split())) #숫자 카드에 적힌 정수
M = int(sys.stdin.readline()) #M개 숫자
check = list(map(int, sys.stdin.readline().split()))
#상근이가 몇 개 가지고 있는지 체크해야 할 숫자

counter = Counter(cards) #몇 개 가지고 있는지 카운팅

for i in check:
    print(counter[i], end = ' ')
```
- 방향성:
1. collections.Counter로 카운팅해서 시간복잡도 문제 해결

## 피드백
### collections.Counter
- `Counter(cards)`: `cards` 안의 숫자 등장 횟수를 딕셔너리 형태로 저장
- 존재 여부 확인 및 갯수 출력: `counter[x]` -> 존재하면 갯수, 없으면 0 반환
- 시간 복잡도: O(N + M)

#### Counter란?
- `from collections import Counter`로 불러옴
- 리스트, 문자열, 튜플 등 **반복 가능한(iterable) 객체의 각 요소가 몇 번 나왔는지 카운팅해 주는 객체**
- 내부적으로 딕셔너리와 비슷한 구조
**예시**
```python
#기본 사용법
from collections import Counter

data = ['a', 'b', 'b', 'c', 'a', 'b']
counter = Counter(data)
print(counter)  # Counter({'b': 3, 'a': 2, 'c': 1})

```
- `counter['b']` -> 3
- `counter['z']` -> 0
```
#문자열 버전
text = "hello world"
counter = Counter(text)
print(counter)  # 각 알파벳이 몇 번 나왔는지

#딕셔너리처럼 동작
print(counter['l'])  # 3
print(counter.get('x', 0))  # 없는 키: 0

```
**자주 쓰이는 메서드**

| 메서드                  | 설명                          |
| -------------------- | --------------------------- |
| `most_common(n)`     | 가장 많이 등장한 요소 n개를 반환         |
| `elements()`         | 요소들을 원래 개수만큼 반복해 리턴 (이터레이터) |
| `update(iterable)`   | 요소 개수를 더함                   |
| `subtract(iterable)` | 요소 개수를 뺌                    |

**사용하면 좋을 때**
- 등장 횟수 셀 때
- 중복 요소 빠르게 파악
- 시간복잡도를 줄이기 위해 선처리를 할 때

### dict(딕셔너리)
- **자바의 Map이랑 거의 똑같고 이름만 다른 느낌**
- 데이터를 **"키(key): 값(value)"** 쌍으로 저장하는 구조
- ex) `"이름": "김철수"`, `"나이": 23`
```python
person = {
    "이름": "김철수",
    "나이": 23,
    "직업": "개발자"
}
```
#### 문법
```python
#1. 생성
person = {}  # 빈 딕셔너리
person = {"name": "Alice", "age": 30}

#2. 값 조회
print(person["name"])  # "Alice"

# 키가 없을 경우 오류 발생 -> 안전하게 쓰기 위해 get() 사용
print(person.get("height", "없음"))  # "없음"

#3. 값 추가 및 수정
person["age"] = 31  # 값 수정
person["job"] = "developer"  # 값 추가

# 삭제
del person["job"]

## 딕셔너리 반복문
for key in person:
    print(key, person[key])

for key, value in person.items():
    print(key, value)

```

### 왜 set보다 Counter가 적절할까?
- `set`: **존재 유무만 판단**하기 좋음
- `Counter`: **존재 유무 + 카운팅**

# 4. 🧩 구슬을 나누는 경우의 수
- 문제: https://school.programmers.co.kr/learn/courses/30/lessons/120840
- `combinations` 내장 함수 쓰면 될 것 같은데
- 직접 구현해 보는 방향으로
- 문제:

## 1. 조합 구현 코드

```python
def solution(balls, share):
    
    #조합 => nCr 하면 되는데 
    # n!/(n-r)!*r!
    # 1. 직접 계산하거나 2. combination 쓰거나
    
    # n!
    sol_n = 1
    for i in range(1, balls+1):
        
        sol_n *= i
    # n-r!
    sol_nr = 1
    for i in range(1, (balls-share)+1):
        
        sol_nr *= i
    # r!
    sol_r = 1
    for i in range(1, share+1):
        
        sol_r *= i
       
    answer = sol_n / (sol_nr * sol_r)
    return answer
```
## 2.1 초기 combinaions 코드

```python
from itertools import combinations

def solution(balls, share):
    
    comb = list(combinations(balls, share))
    
    answer = len(comb)
    return answer
```
- `balls`는 **정수** => `combinations(n, r)`에서 `n`은 **iterable(리스트)**여야 함
- `range(balls)`로 변환하면 체크 가능

## 2.2 최종 combinations 코드

```python
from itertools import combinations

def solution(balls, share):
    
    comb = list(combinations(balls, share))
    
    answer = len(comb)
    return answer
```

## 2.3 math.comb() 코드

```python
from math import comb

def solution(balls, share):
    return comb(balls, share)
```
- python 3.8+ 이상
- `itertools`는 **조합 자체를 생성** <- 처음에 틀린 이유
- `math.comb()` = **갯수만 계산**

## 3. 피드백

### 1. combinations()가 요구하는 것
- `combinations(iterable, r)` 에서 `iterable`은 반드시 **iterable(반복 가능 객체)**여야 함
- `iterable` = 문자열, 리스트, 튜플, range
- int는 해당 X -> `combinations(5, 2)` 같은 거 안 됨

#### combination()은 언제 쓸까?
- `combinations()`: **조합 결과를 실제로 꺼내서 활용하는 문제**에 적합
- `math.comb(n, r)`: **단순히 갯수 구하는 문제**에 적합

### 2. 왜 range()는 iterable?
- `balls` = 5
- `range(5)` = [0, 1, 2, 3, 4] 형태
- 리스트는 아니고, **파이썬 내장 클래스**
- `list` X, `range` **타입 자체**
- 하지만 리스트처럼 `for`문에 넣으면 하나씩 꺼낼 수 있음

#### list VS range
**공통점**
- 반복문에서 사용 가능(`for`)
- 인덱스 접근 가능(`range(5)[2]`)
- 길이 구할 수 있음(`len(range(5))`)
**차이점**
- **메모리를 아끼기 위해** 실제 값을 모두 저장하지 않음
-  값을 **필요로 할 떄 하나씩 꺼내는 객체(lazy evaluation)

# 5. 🧩 가장 큰 수 찾기
- 문제: https://school.programmers.co.kr/learn/courses/30/lessons/120899

## 1. 코드

```python
def solution(array):
    answer = []
    max_arr = max(array)
    max_index = array.index(max_arr)
    answer.append(max_arr)
    answer.append(max_index)
    return answer
```
## 2. 피드백

### 리스트 특정 원소의 index값 구하기
- if lst 안의 원소 'a'의 index 값이 궁금하다면
- `lst.index('a')


# 6. 🧩  중복된 숫자 개수 
- 문제: https://school.programmers.co.kr/learn/courses/30/lessons/120583?language=python3
- lv.0
- for문으로 카운팅하는 것 말고 counter를 써서 풀어 보려고 함

## 1.1 Counter 코드 (수정 전)


```python
from collections import Counter 

def solution(array, n):
    ch_n = chr(n)  # ❌ 불필요한 문자 변환
    counter = Counter(array)
    answer = counter['ch_n']  # ❌ 문자열 'ch_n'이라는 키를 찾고 있음
    return int(answer)

```

- ch_n = chr(n): 처음에 Counter가 `문자(열)`만 카운팅해 주는 줄 알아서, 변환하려고 했으나 정수도 카운팅해 준다고 하여서 삭제
- counter는 Counter를 이용해 array의 값들을 정리한 딕셔너리 구조 => `counter[n]` 이렇게  `[]`,를 써야 함

## 1.2 Counter 코드 (최종)

```python

from collections import Counter 

def solution(array, n):
    
    counter = Counter(array)
    answer = counter[n]
    return answer
```

## 2. for문 코드

```python
def solution(array, n):
    
    count_n = 0
    
    for i in array:
        if n == i:
            count_n += 1
            
    answer = count_n
    return answer
```

## 3. 피드백

### collections. Counter에 대한 정리
1. `collections.Counter`는 내부적으로 **`dict`을 상속한 자료구조**로, 각 요소의 등장 횟수를 저장하는 **딕셔너리 기반 클래스++
2. 따라서 함수처럼 호출 불가 => **딕셔너리처럼 `[]` 대괄호로 키에 접근**해야 함
3. 키(key): 문자열뿐만 아니라 정수, 문자열, 튜플 등 **불변(immutable) 객체** 사용 가능
4. 존재하지 않는 키 접근 `0` 반환 (keyError 발생 안 함)

#### 언제 쓸까?
- 리스트/문자열에서 **가장 많이 등장한 요소 찾기**
- 등장 횟수 기반 조건문(ex. 특정 원소가 2개 이상인지_
- 빠르고 깔끔한 **빈도 카운팅**


# 7. 🧩 완주하지 못한 선수 (06/07)

문제: https://school.programmers.co.kr/learn/courses/30/lessons/42576?language=python3

## 1. 초기 코드
### 아이디어
- `participant` 배열에서 이름을 하나씩 순회해서
- if `completion`에 있다면 => 제거하자
- 마지막에 남은 사람이 완주하지 못한 선수

### 실패

```python
def solution(participant, completion):
    for name in participant:
        participant.remove(name)
    return completion[0]
```
### 문제점
- `for name in participant`로 순회하면서 `participant.remove()`를 동시에 할 경우 리스트를 순회하는 동작 중에 수정하게 되어 예기치 못한 동작이 발생
- `completion`을 사용하는 것도 빠트림

## 2. 최종 코드
### 아이디어
- 애초에 Counter를 연습하는 문제로 선정한 것이기 때문에 Counter를 이용해 보기로 함
- "참가자 수와 완주자 수를 카운팅해서 빼면 되겠네?"
- `collections.Counter`를 써서 참가자와 완주자 각각의 요소를 카운팅하자
- 두 Counter 객체의 차를 구하면 남는 게 완주하지 못한 사람
```python
from collections import Counter

def solution(participant, completion):
    counter_p = Counter(participant)      # 참가자 수 세기
    counter_c = Counter(completion)       # 완주자 수 세기
    result = counter_p - counter_c        # 미완주자만 남는다
    answer = list(result.keys())[0]       # key만 뽑아 첫 번째 값 반환
    return answer

```
## 3. 피드백
### Counter
- `collections` 모듈의 `Counter`는 **딕셔너리처럼 작동**
- **값의 등장 횟수를 자동으로 세어 줌**
```python
Counter(["leo", "kiki", "eden"])
# => {'leo': 1, 'kiki': 1, 'eden': 1}

```
#### Counter 간 연산
- `Counter1 - Counter2` => **겹치는 키의 값을 빼 줌**

#### dict과 유사한 구조
- `Counter.keys()`: 등장한 **값**만 추출
- `Counter.values()`: 각 값의 **등장 횟수**만 추출
- `Counter.items()`: (값, 쌍) **쌍**

#### list(result.keys())[0]은 왜 해야 할까?
- `result = counter_p - counter_c`로 남는 값은 `Counter` 객체로 반환

```python

# participant = ["leo", "kiki", "eden"]
# completion = ["eden", "kiki"] 라고 가정했을 때

result = Counter({'leo': 1})
```
- `result.keys()` => `dict_keys(['leo']) 형태로 나오는데
	- **리스트 형태로 보이지만 리스트가 아님**
- 따라서 첫 번째 요소를 꺼내려면 `list()`로 감싸 변환 필요
```python
list(result.keys())         # ['leo']
list(result.keys())[0]      # 'leo'
```
- 최종 반환값을 정확하게 뽑기 위해 `.keys()` -> `list()` -> `[0]` 순서로 변환 필요
- `dict_keys`라는 특수 객체를 우리가 일반적으로 사용하는 리스트처럼 다루기 위한 파이썬 관용 표현

#### 왜 list를 쓰면 안 될까?
1. 리스트는 특정 요소의 개수를 세려면 `O(n)` 탐색 반복 필요
2. `Counter`는 내부적으로 딕셔너리(HashMap) 기반이라 탐색이 `O(1)`에 가까움
3. 따라서 `Counter`를 쓰는 것이 더 적합

# 8. 🧩 최댓값과 최솟값
- 문제: https://school.programmers.co.kr/learn/courses/30/lessons/12939

## 1. 최초 코드

```python
def solution(s):
    lst = list(map(int, s.split()))
    max_s = max(lst)
    min_s = min(lst)
    answer = []
    answer.append(min_s)
    answer.append(max_s)
    return " ".join(answer)
```

- `.join()` 함수 사용이 잘못된 것 같아서 수정 => `join()`은 **문자열**만 결합해 주기 때문에, map으로 answer을 str 타입으로 변환해 줘야 함

## 2. 최종 코드

```python
def solution(s):
    lst = list(map(int, s.split()))
    max_s = max(lst)
    min_s = min(lst)
    answer = []
    answer.append(min_s)
    answer.append(max_s)
    return " ".join(map(str, answer))
```
## 3. 피드백

### .join()
- `join()` 함수는 문자열 리스트만 바꿀 수 있음
- 따라서 정수 -> 문자열로 변환 필요
```python
return " ".join(map(str, answer))
```

- 전화번호 목록

# 9. 🧩 두 개 뽑아서 더하기

## 1. 최종 코드
#### 아이디어
- 두 수를 뽑아 더한 조합의 결과를 이용한다 => `combinations` 내장 함수 써야지
- 중복된 결과 제거 => `set` 이용
- 정렬 오름차순 출력 + 원본 없어도 됨 => sorted()
#### 사용 개념
| 개념                         | 설명                          |
| -------------------------- | --------------------------- |
| `combinations(numbers, 2)` | 리스트에서 두 개씩 뽑는 조합을 생성함       |
| `for a, b in comb:`        | 각 조합은 튜플 `(a, b)`이므로 언패킹 필요 |
| `set()`                    | 중복 제거                       |
| `sorted()`                 | 오름차순 정렬                     |

#### 코드

```python
from itertools import combinations

def solution(numbers):
    comb = list(combinations(numbers, 2))  # 2개씩 조합
    comb_sum = []

    for a, b in comb:
        ab_sum = a + b
        comb_sum.append(ab_sum)

    answer = sorted(set(comb_sum))  # 중복 제거 + 정렬
    return answer

```

## 2. 피드백
#### 리스트 컴프리헨션

```python
for a, b in comb:
  ab_sum = a + b
  comb_sum.append(ab_sum)
  
answer = sorted(set(comb_sum))  # 중복 제거 + 정렬
return answer

#리스트 컴프리헨션

return sorted(set([a+b for a, b in conbinations(numbers,2)]))

```
#### combinations(numbers, 2)
- 조합 결과는 **튜플 리스트**: `[(a, b), (a, c), ...]`
- 조합이므로 순서 X, 중복 X	


#### for a, b in comb:
- 조합 결과인 튜플`(a, b)`를 분해해서 a,b로 받는 것
#### set()과 sorted()


# 10. 🧩 예산
- 문제: https://school.programmers.co.kr/learn/courses/30/lessons/12982

# 1. 코드

```python
def solution(d, budget):
    
    count_num = 0 #가짓수 카운팅 변수
    
    d.sort()
    
    for i in d:
        
        if budget < i: #d[i]가 예산보다 커지면
            break

        budget -=i #d[i]의 값에 예산 부여 후 budget 예산 차감
        count_num += 1 #가짓수 카운팅

            
    return count_num
```
# 2. 피드백
- 딱히 없음?

# 11. 🧩 BOJ 2512 예산
- 문제: https://www.acmicpc.net/problem/2512
- 이진 탐색 문제라고 생각해서 선정

## 1. 초기 코드

```python
N = int(input()) # 예산 요청하는 지방 수
lst = list(map(int, input().split())) #지방의 예산 요청
M = int(input()) # 총 예산

#설계
#mid를 구해서
#mid보다 작은 예산은 걍 더하고
#mid부터 큰 값은 다 mid로 바꿔서 더해서
#총액을 M이랑 비교
#M보다 작으면 다음 mid 구하고
#M보다 크면 이전 mid가 최댓값

lst.sort() #오름차순 정렬
mid = lst[N // 2] #중앙값
total = 0 # 예산 총합

#여기 총합보다 작은 경우는 그냥 하자
sum_lst = sum(lst)
if sum_lst <= M:
  print(lst[-1])
else:
  #이 부분은 무조건 애초에 총합이 M보다 클 경우로 조건문 때리고
  
  while True:
    for i in lst: #리스트 순회
    
      # 만약 요청액이 mid보다 같거나 크면 -> mid값을 더하고
        if i >= mid:
            total += mid
        else:
      #만약 요청액이 mid보다 작으면 그냥 요청액을 더하고
            total += i
          
    #여기는 아직 while문 안에서 mid(상한값) 찾기 위한 조건이고
    if total <= M:
      mid = (mid + lst[-1]) // 2 #mid값을 조정
      #그러면 다음 mid값을 구해야 되는데 여기에서 mid값 조정해서 다시 리스트 순회부터 반복해도 될 거 같은데?
  
  #그러면 이제 while문 나오는 조건 어케 함? + 최댓값 설정해야 하는 코드 있어야 하는데
    else:
      break
  print(mid)
```
## 2. 수정 코드

```python
N = int(input()) # 예산 요청하는 지방 수
lst = list(map(int, input().split())) #지방의 예산 요청
M = int(input()) # 총 예산

#설계
#mid를 구해서
#mid보다 작은 예산은 걍 더하고
#mid부터 큰 값은 다 mid로 바꿔서 더해서
#총액을 M이랑 비교
#M보다 작으면 다음 mid 구하고
#M보다 크면 이전 mid가 최댓값

lst.sort() #오름차순 정렬
start = 0 
end = lst[-1]
answer = 0

#여기 총합보다 작은 경우는 그냥 하자
sum_lst = sum(lst)

if sum_lst <= M:
  answer = int(lst[-1])
  print(answer)
  
else:
  #이 부분은 무조건 애초에 총합이 M보다 클 경우로 조건문 때리고
  
  while start <= end:
    total = 0
    mid = (start + end) // 2
    for i in lst: #리스트 순회
    
      # 만약 요청액이 mid보다 같거나 크면 -> mid값을 더하고
        if i >= mid:
            total += mid
        else:
      #만약 요청액이 mid보다 작으면 그냥 요청액을 더하고
            total += i
          
    #여기는 아직 while문 안에서 mid(상한값) 찾기 위한 조건이고
    if total <= M:
      answer = mid
      start = mid + 1 #mid 값 조정
      #그러면 다음 mid값을 구해야 되는데 여기에서 mid값 조정해서 다시 리스트 순회부터 반복해도 될 거 같은데?
  
  #그러면 이제 while문 나오는 조건 어케 함? + 최댓값 설정해야 하는 코드 있어야 하는데
    else:
      end = mid - 1
  print(answer)
```
## 3. 피드백

### 3.1 오답노트
1. 초기 코드의 문제점
- `while True`  종료 조건이 없었음
- `total` 값을 루프 밖에서 설정해서, 루프 안에서 초기화를 해야 하는데 누적이 됨
2. 정렬한 뒤 `mid = lst[N//2]`로 설정
- 값 자체는 중앙값
- 하지만 **이진 탐색**의 **point**는 `start`와 `end` 범위 전체를 기준으로 `mid`를 **갱신해가며** 조건을 만족하는  **최댓값** 찾기
- 따라서 `start`와 `end`를 조정해서 **범위 조정**이 포인트
3. 최종 수정 코드의 개선점
- `start`, `end`, `mid` 값을 이진 탐색 원리에 따라 생신
- 조건을 만족할 때 `answer` 생신해서 **정석적 이진 탐색 구조** 만들었음
4. 조건 핵심 로직
- `total <= M`은 현재 상한값(mid)가 가능 => 가능한 더 큰 상한값을 찾기 위해 `start = mid + 1`
- `tosta > M`이면 현재 상한값(mid) 불가능 => 더 작은 값에서 상한값 찾기 위해 `end = mid - 1`

### 3.2 이진 탐색
- 이진 탐색(Binary Search): **정렬된 데이터에서 특정 조건을 만족하는 값을 효율적으로 찾는 알고리즘**
- 시간복잡도: **O(logN)**
- `조건을 만족하는 최대/최소값` 찾는 **Parametic Search**에서 자주 등장
- 중요 키워드: `start`, `end`, `mid`, `조건식` -> 조선을 만족하면 탐색 범위를 반으로 줄여서 반복
- 탐색 방향:
	- 조건 만족: `start = mid + 1`
    - 조건 불만족: `end = mid -1`
    - 정답 후보 저장: `answer = mid`

# 12. 🧩 BOJ 2805 나무 자르기
- 문제: https://www.acmicpc.net/problem/2805
- 2512 문제랑 거의 유사해서 내가 이진 탐색을 제대로 이해했는지 복습하고자 함

## 0. 설계
- 2512 문제를 기반으로 하여 문제 풀 설계부터 함
1. `start`, `end`, `mid` 이진 탐색 설정: 이진 탐색을 위한 기본 변수 설정 => 문제에서는 H가 가능한 범위 설정
2. `mid`를 기준으로 잘린 나무 양 계산: `if i > mid => total += (i - mid)`
3. 잘린 나무 총합(total) VS M 비교: `total >= M`라면 정답 후보
4. 조건 만족 시 `H = mid`, `start = m + 1` => 여기에서 answer에 해당하는 값 갱신
- 왜냐면 정답이 될 수 있는 조건이니까 그 조건문 안에서만 answer을 갱신하면 됨
- 계속 덮어쓰다가 마지막 값이 정답 후보 중 정답이 될 것
5. 조건 불만족 시 `end = mid - 1`
## 1. 코드

```python
import sys

N, M = map(int, sys.stdin.readline().split())
#나무의 수 N, 나무의 길이 M
tree_height = list(map(int, sys.stdin.readline().split()))
#나무 높이 리스트(N개겠지?)
start = 0
end = max(tree_height)
#이진 탐색을 위한 기본 변수 설정

#문제: M미터 이상의 나무를 집에 가져가기 위한 H의 최댓값
H = 0 #절단기에 설정할 높이 => 이진 탐색 mid의 최댓값이 H의 정답이 될 것

#지금 헷갈리는 게 M-H의 값을 상근이가 집에 가져가는 것

#예제에서 M=7이면 그냥 잘린 나무 총액이 7이상이면 되는 거니까
#자르는 값(이게 MID)될 거고 잘린 나무를 M=7이랑 비교하면 될 거 같은데?

#나무가 20, 15, 10, 17이니까
#여기에서 이진 탐색 결과가 15가 나와서
#잘려서 가져갈 수 있는 나무가 5, 0, 0, 2가 되니까 합치면 M=7 만족

#그러면 예제를 보고 계산을 생각해 보자
#mid (start + end) // 2 해서 설정하고 이게 정답 후보
#즉, 정답을 탐색해야 됨
# mid를 가지고 계산을 해 봐야 함
# for i in tree_height: #자른 값 비교하기 위해 for문
# total은 여기에서 초기화해
# if i > mid -> 그러면 i - mid를 한 걸 total 더해
# 여기에 해당하지 않으면 total 그대로 둬
# for문 다 돌면 -> total이랑 M이랑 비교해
# total이 M보다 작으면 start = mid + 1 해서 다시 돌리고
# total이 M보다 크면 end = mid - 1 해서 돌리고
# 이걸 만족하는 값을 그대로 정답으로 출력 

while start <= end:
  total = 0 #M이랑 비교할 잘린 나무 길이의 총합
  mid = (start + end) // 2 #이진 탐색 mid값이자 정답 후보

  for i in tree_height: #자른 값 비교하기 위해 for문
    if i > mid:
      total += i - mid

  if total >= M: #total이 M보다 작으면 start = mid + 1
    H = mid #일단 조건을 만족하므로 answer에 mid를 저장
    start = mid + 1
  else:
    end = mid - 1

sys.stdout.write(str(H))
```

## 2. 피드백

1. 시간 초과
- `input()` -> `sys.stdin.readline()` 
- `print()` -> `sys.stdout.write()
- `sys.stdout.write()는 문자열만 출력하기 때문에 정수인 H를 str(H)로 문자열 변환 필요
2. 조건 분기
- `if total < M` -> `if total >= M`으로 변경 
3. 조건 만족 시 정답 저장 누락 => 조건 만족 if문 안에 `H = mid`로 정답 후보 갱신

# 13. 🧩 BOJ 10809
## 1. 코드

```python
S = input()

alp = list(range(97, 123))

for i in alp:
  print(S.find(chr(i)))

```
# 14. 🧩 BOJ 2675
## 1. 코드

```python
T = int(input())

for i in range(T): 
  R, S = input().split()
  R = int(R)  
  S = list(S)

  lst = []
  
  for i in S:
    alp = i*R
    lst.append(alp)

  answer = ''.join(lst)
  print(answer)
```
# 15. 🧩 Pro 약수의 합
- 문제: https://school.programmers.co.kr/learn/courses/30/lessons/12928
- lv.1

## 1. 코드

```python
def solution(n):

    lst = [] #약수 담는 리스트
    
    for i in range(1, n+1):
        if n % i == 0:
            lst.append(i)
            
    return sum(lst)
```
# 16. 🧩 BOJ 1822
- 문제: https://www.acmicpc.net/problem/1822
- 인터넷에서 이진 탐색으로 풀라고 했는데, 파이썬에서는 set 쓰는 게 제일 효율적

## 1. 초기 코드 (시간 초과)

```python
nA, nB = map(int, input().split())
A = list(map(int, input().split()))
B = list(map(int, input().split()))

nBbA = []

for i in range(nA):
  if A[i] not in B:  # B가 리스트인 경우, in 연산이 O(N)
    nBbA.append(A[i])

nBbA.sort()

print(len(nBbA))
print(*nBbA)

```

### 문제점
1. `B`를 리스트로 설정 => `A[i] not in B`는 **B를 매번 순회**하여 검사 => 시간복잡도가 **O(N^2)** 
-> 문제를 계속 풀어보니까 리스트를 두 번 겹쳐서 쓰는 것부턴 시간 초과 때문에 무조건 안 되는 듯?

## 2. 최종 코드

```python
import sys

nA, nB = map(int, sys.stdin.readline().split())
A = list(map(int, sys.stdin.readline().split()))
B = set(map(int, sys.stdin.readline().split()))  # ✅ set으로 변경

nBbA = []

for a in A:
    if a not in B:   # ✅ set lookup은 평균 O(1)
        nBbA.append(a)

nBbA.sort()

print(len(nBbA))
print(*nBbA)

```
### 개선점
- `B`를 **set**으로 설정해서 시간복잡도 줄임

## 3. 피드백

### set VS list: 탐색 속도 비교

| 자료형    | `in` 연산 시간복잡도 |
| ------ | ------------- |
| `list` | O(N) (순차 탐색)  |
| `set`  | O(1) (해시 기반)  |

- `list`: 하나하나 비교
- `set`: 해시로 존재 여부를 빠르게 판별
- **존재 여부 검사**가 키워드라면 **set**을 쓰자

# 17. 🧩 BOJ 5622
- 문제: https://www.acmicpc.net/problem/5622
## 1. 코드

```python
alpha = list(input())

time_sum = 0

for i in alpha:
  if i == 'A' or i == 'B' or i == 'C':
    time_sum += 3
  elif i == 'D' or i == 'E' or i == 'F':
    time_sum += 4
  elif i == 'G' or i == 'H' or i == 'I':
    time_sum += 5
  elif i == 'J' or i == 'K' or i == 'L':
    time_sum += 6
  elif i == 'M' or i == 'N' or i == 'O':
    time_sum += 7
  elif i == 'P' or i == 'Q' or i == 'R' or i == 'S':
    time_sum += 8
  elif i == 'T' or i == 'U' or i == 'V':
    time_sum += 9
  elif i == 'W' or i == 'X' or i == 'Y' or i == 'Z':
    time_sum += 10

print(time_sum)
```
# 18. 🧩 BOJ 11718
- 문제: https://www.acmicpc.net/problem/11718
## 1. 코드

```python
while True:
  try:
    print(input())
  except EOFError:
    break
```
# 19. 🧩 BOJ 3003
- 문제: https://www.acmicpc.net/problem/3003

## 1. 코드

```python
mal = list(map(int, input().split()))
sol_mal = [1, 1, 2, 2, 2, 8]

answer = []

for i in range(6):
  answer.append(sol_mal[i] - mal[i])

print(*answer)

```
# 20. 🧩 Pro 입국 심사
- lv.3 이진 탐색 문제(풀었다기보단.. 참고해서 이해한 정도에 가까움)
- 문제: https://school.programmers.co.kr/learn/courses/30/lessons/43238
## 1. 초기 코드
### 1.1 초기 설계
#### 문제 이해
- `n`: 입국 심사 기다리는 사람 수
- `times`: 각 심사관이 1명 심사할 때 걸리는 시간
- 목표: `n`명이 **모두 심사를 마치기까지 걸리는 최소 시간**
#### 이진 탐색 방향 설정
- 탐색 범위: 시간 -> 왜냐면 목표가 시간 구하는 거였으니까
	- `start` = 1, `end` = `n * max(times)`
- 판별 기준: `mid` 시간 안에 **몇 명 처리**할 수 있을까?
- 조건 판단: 처리 인원이 `n`명 이상이면 충분한 것 -> 더 줄일 수 있는지 확인(`end = mid - 1`
### 1.2 코드

```python
def solution(n, times):
    start = 1
    end = n * max(times)
    answer = 0

    while start <= end:
        mid = (start + end) // 2
        total_time = 0

        for i in times:
            if i >= mid:
                total_time += mid
            else:
                total_time += i

        if total_time < n * mid:
            answer = total_time
            start = mid + 1
        else:
            end = mid - 1

    return answer

```
#### 문제점: total_time 계산 방식
- 오해: mid 시간 동안 **시간 자체**를 더함
- 목적: mid 시간 동안 **몇 명을 심사하는지**를 해야 함

#### 올바른 접근

```python
for time in times:
    total_people += mid // time

```
- 각 심사관이 mid 시간 동안 처리 가능한 사람 수

#### 정리

| 비교 항목        | 잘못된 버전          | 올바른 버전                |
| ------------ | --------------- | --------------------- |
| **기준**       | 시간 값을 더함        | 처리 인원을 더함             |
| **목표와의 연결성** | "시간을 얼마나 소모했는가" | "시간 안에 몇 명 처리 가능한가"   |
| **논리 구조**    | 잘못된 누적 시간 비교    | 이진 탐색 조건에 맞는 처리 인원 비교 |

## 2. 최종 코드

```python
def solution(n, times):
    start = 1
    end = n * max(times)
    answer = end

    while start <= end:
        mid = (start + end) // 2
        total_people = 0

        for time in times:
            total_people += mid // time

        if total_people >= n:
            answer = mid  # 가능한 경우, 줄여보기
            end = mid - 1
        else:
            start = mid + 1

    return answer

```
