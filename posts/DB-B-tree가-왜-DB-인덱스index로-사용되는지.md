---
title: 'DB) B tree가 왜 DB 인덱스(index)로 사용되는지'
slug: DB-B-tree가-왜-DB-인덱스index로-사용되는지
date: 2025-02-26T13:08:47.235Z
tags: []
---
> ** B tree 시간 복잡도
secondary storage의 특징
B tree가 DB index로 쓰이는 이유**

**왜 DB index로 B tree 계열이 사용되는가?**

![](https://velog.velcdn.com/images/emprimula/post/4ce316fe-f6e5-495c-8882-e489d8f32d4c/image.PNG)

** 시간복잡도가 다 동일하다면, 왜 B tree를 써야 할까? **

### computer system
![](https://velog.velcdn.com/images/emprimula/post/1f691414-a556-4e46-97ca-add12bc22437/image.PNG)
- database도 Secondary storage에 들어감

#### secondary storage
- 데이터 처리 속도가 가장 느림
- 데이터 저장 용량이 가장 큼
- block 단위로 데이터를 읽고 씀
> block 
>- file system이 데이터를 읽고 쓰는 논리적인 단위
>- block의 크기는 2의 승수로 표현, 대표적인 block size는 4KB, 8KB, 16KB 등이 있음
=> 불필요한 데이터까지 읽어올 가능성이 존재함

#### database 관점
- DB는 secondary storage에 저장됨
- DB에서 데이터를 조회할 때 secondary storage에 최대한 적게 접근하는 것이 성능면에서 좋음
- block 단위로 읽고 쓰기 때문에 연관된 데이터를 모아서 저장하면 더 효율적으로 읽고 쓸 수 있음

### B tree index VS AVL tree index
- 데이터를 찾을 때 탐색 범위를 빠르게 좁힐 수 있음
- block 단위에 대한 저장 공간 활용도가 더 좋음

### B tree의 강력함 with 101차 B tree
- 네 개의 level만으로 수 백만, 수 천만 개의 데이터를 저장할 수 있음
- root 노드에서 가장 멀리 있는 데이터도 세 번의 이동만으로 접근 가능

### B tree 계열을 DB 인덱스로 사용하는 이유
- DB는 secondary storage에 저장됨
- DB에서 데이터를 조회할 때 secondary storage에 최대한 적게 접근하는 것이 성능면에서 좋음
- B tree index는 self-balancing BST에 비해 secondary storage 접근을 적게 함
- B tree 노드는 block 단위의 저장 공간을 알차게 사용 가능
