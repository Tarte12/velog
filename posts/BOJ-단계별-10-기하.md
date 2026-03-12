---
title: 'BOJ 단계별 (10): 기하'
slug: BOJ-단계별-10-기하
date: 2025-05-14T13:23:07.825Z
tags: []
---
## 1085

### 내 풀이
```python
x, y, w, h = map(int, input().split())

lst = [x, y, w - x, h - y]
res = x

for i in lst:
	if i < res:
		res = i

print(res)
```

### 정리
#### 문법
```
x, y, w, h = input().split()
띄쓰를 기준으로 쪼개서 입력받기 (기본형: 문자열)

x, y, w, h = map(int, input().split())
정수형으로 받는 방법
```
#### 다른 풀이
```
min 이용하기
print(min(x, y, w - x, h - y))
```

## 3009 (보류)

## 15894 (보류)

## 9063
### 내 풀이
```
N = int(input())

x_lst = []
y_lst = []

for i in range(N):
    x, y = map(int, input().split())
    x_lst.append(x)
    y_lst.append(y)

x_max = max(x_lst)
y_max = max(y_lst)
x_min = min(x_lst)
y_min = min(y_lst)

x_res = x_max - x_min
y_res = y_max - y_min

res = x_res * y_res
print(res)

```

## 10101

### 내 풀이
```
a = int(input())
b = int(input())
c = int(input())

if a + b + c != 180 :
 	print("Error")

elif a == b == c :
	print("Equilateral")

elif a == b or b == c or a == c :
	print("Isosceles")

else:
	print("Scalene")
```

## 5073 (보류)

## 14215

### 내 풀이
```
a, b, c = map(int, input().split())

lst = sorted([a, b, c]) 
#오름차순 정렬

if lst[2] < lst[0] + lst[1]:
	print(sum(lst))

else:
	lst[2] = lst[0] + lst[1] - 1
	print(sum(lst))
```
### 정리
#### 문법
```
sorted() <- 정렬 기능 있는데 자꾸 까먹음
```