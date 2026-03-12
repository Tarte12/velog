---
title: 'BaekJoon 4153 : 직각삼각형'
slug: BaekJoon-4153-직각삼각형
date: 2025-01-22T07:12:48.048Z
tags: ['TIL', '코테']
---
> 백준 그 세팅??? 거기에 감을 못 잡겠다...
백준 규칙에 좀 익숙해져야 할 것 같음

### 1. 코드
```
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        while (true) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int c = sc.nextInt();

            if (a == 0 && b == 0 && c == 0) {
                break;
            }

            int max = Math.max(a, Math.max(b, c));
            int sumOfSquares;

            if (max == a) {
                sumOfSquares = b * b + c * c;
            } else if (max == b) {
                sumOfSquares = a * a + c * c;
            } else {
                sumOfSquares = a * a + b * b;
            }

            int maxSquare = max * max;

            if (sumOfSquares == maxSquare) {
                System.out.println("right");
            } else {
                System.out.println("wrong");
            }
        }
    }
}
```
### 2. 백준 주의사항

1. 패키지 쓰지 말기 : 처음에 이걸로 컴파일 오류 뜸 (백준은 패키지 허용 안 한다고 함 ㅡㅡ)
2. 클래스 이름 규칙 : 클래스 이름 '무조건' Main
3. 불필요한 import 제거
