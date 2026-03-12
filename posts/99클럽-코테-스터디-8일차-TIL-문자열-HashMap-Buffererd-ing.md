---
title: '99클럽 코테 스터디 8일차 TIL + 문자열, HashMap, Buffererd~ (ing)'
slug: 99클럽-코테-스터디-8일차-TIL-문자열-HashMap-Buffererd-ing
date: 2024-11-04T03:30:39.851Z
tags: []
---
## 진행 상황
- 아직 문제 못 풀었음
- HashMap을 이용하여 누적 시간을 체크하면 될 것 같은데, 코드를 뭔가 짜지를 못하겠음
- 일단 필요할 것 같은 개념 공부
- 문제 : https://www.acmicpc.net/problem/25593
## 설계
1주에 7일 동안 나가는 근무자들의 근무 시간 합이 서로 12시간 차이 이상이 나면 안 됨
=> 저번에 할리갈리 문제처럼 Hashmap을 이용해서 시간을 누적으로 채우고, 
누적으로 채운 걸 비교해서 12시간 차이가 더 나면 출력 no 아니면 yes

## 코드 공부 (챗 GPT 참고)
> import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
> 
public class Main {
    public static void main(String[] args) throws IOException {
        //scanner 대신 사용용
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
>         
>         // 주의 개수 입력
        int N = Integer.parseInt(br.readLine().trim());
>         
        // HashMap으로 근무 시간 카운팅
        Map<String, Integer> workTime = new HashMap<>();
>         
        int[] timeSlot = {4, 6, 4, 10};
>         
        for(int week = 0; week < N; week++){ //주 단위 체크
            for(int i = 0; i < 4; i++) // 근무 시간 부여
            String worker = br.readLine().trim();
            //worker를 입력 받음 + trim()으로 불필요한 공백 제거
>             
            if(!worker.equls("-")){ //worker가 -가 아닌 경우에 근무 시간 추가
                workTime.put(worker, workTime.getOrDefault(worker, 0) + timeSlot[i])
            //근무자의 근무 시간 누적하는 코드
            //getOrDefault(worker, 0) : worker가 worktime에 존재하면 현재의 
            //근무 시간을 가져오고 그렇지 않으면 0을 반환
            }
>             
            //최대 근무 시간과 최소 근무 시간을 구하기 위해 모든 값 순회
            int minTime = Integer.MAX_VALUE; //가장 큰 값이기 때문에 갱신됨
            int maxTime = Integer.MIN_VALUE; //가장 작은 값이기 때문에 갱신됨
>             
            for(int time : workTime.values()){ //workTime MAP의 모든 값을 순회한다는 코드 
                minTime = Math.min(minTime, time); //현재 time이 minTime보다 작으면 교체
                maxTime = Math.max(maxTime, time); //현재 time이 maxTime보다 크면 교체
                //최댓값 최소값 코드드
            }
        }
>                 
       // 출력
       if (maxTime - minTime <= 12) {
            System.out.println("Yes");
        } else {
            System.out.println("No");
>         }
> }

## 개념 정리
### 1. HashMap
- `HashMap`은 자바에서 **키-값 쌍으로 데이터를 저장**하는 자료구조
- 해시 함수를 통해 빠른 검색이 가능
- 다양한 데이터의 저장과 조회에 활용

- **구조**: 키는 중복이 불가하며, 각 키는 유일한 값을 가져야 함. 값은 중복될 수 있음.
- **성능**: 검색, 삽입, 삭제 연산이 매우 빠름.
- **사용 예**: 특정 사람의 근무 시간을 저장하거나, 데이터의 집합에서 빠르게 원하는 항목을 찾을 때 유용함.

#### 예제

> import java.util.HashMap;
> 
HashMap<String, Integer> workTime = new HashMap<>();
workTime.put("alice", 8);          // alice의 근무 시간 저장
workTime.put("bob", 10);           // bob의 근무 시간 저장
int time = workTime.get("alice");  // alice의 근무 시간 조회 (8 출력)


### 2. Integer.MAX_VALUE와 Integer.MIN_VALUE
- 자바에서는 int 타입이 가질 수 있는 최대/최소 값을 상수로 제공
- 이를 활용하면 최소값과 최대값 비교에서 초기 기준값으로 사용할 수 있음

- Integer.MAX_VALUE: int의 최댓값, 즉 2,147,483,647로 초기값 설정에 유용합니다.
- Integer.MIN_VALUE: int의 최솟값, 즉 -2,147,483,648로 초기값 설정에 유용합니다.

#### 예제

> int maxTime = Integer.MAX_VALUE;  // 최댓값 초기화
int minTime = Integer.MIN_VALUE;  // 최솟값 초기화

### 3. Math.min()와 Math.max()
- 자바의 Math 클래스에서 제공하는 min과 max 메서드는 두 숫자를 비교하여 작은 값과 큰 값을 반환함
- 이를 통해 데이터 집합의 최소/최대 값을 쉽게 찾을 수 있음

- Math.min(a, b): a와 b 중 작은 값을 반환
- Math.max(a, b): a와 b 중 큰 값을 반환

#### 예제

> int a = 10;
int b = 20;
int min = Math.min(a, b); // 10
int max = Math.max(a, b); // 20