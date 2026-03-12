---
title: 'BaekJoon 1546 : 평균'
slug: BaekJoon-1546-평균
date: 2025-01-23T06:31:18.580Z
tags: ['코테']
---
### [code]
```
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int N = sc.nextInt();
        int[] arr = new int[N]; //점수 N개를 넣을 배열 생성
        int M = 0; //max 값 저장 변수
        double sum = 0;

        //생성된 배열에 점수들 넣기
        for(int i = 0; i < N; i++) {

            arr[i] = sc.nextInt();

            if (arr[i] > M) {

                M = arr[i];
            }
        }
        for (int i = 0; i < N; i++) {
            sum += ((double) arr[i] / M) * 100;
        }
        System.out.printf("%.6f\n", sum / N);

        sc.close();

    }
}
```
### [오답 풀이]

#### 초기 시도 코드에서의 실수

```java
for (int i = 0; i < N; i++) {
    arr[i] = sc.nextInt();
    if (arr[i] > M) {
        M = arr[i];
    }
    sum += ((double) arr[i] / M) * 100; // 실수 발생
}
```
#### 틀린 이유

1. M 값이 고정되지 않은 상태에서 사용:

	최대값 M은 모든 점수를 비교한 후에야 정확히 결정되는데, 결정되지 않은 상태에서 sum을 계산하려고 함

2. 조정된 점수 계산 흐름이 문제 요구사항과 다름:

 문제에서는 점수를 모두 입력받고 M을 계산한 뒤에 조정된 점수를 구하는데 for문을 나누지 않고 동시에 처리하는 과정에서 오류 발생
 
#### 해결 방안 
 if문 분리 : 
 - 변수의 확정 시점을 생각해 볼 것
 - 반복문을 필요할 땐 분리할 생각을 해야 할 것 같음
