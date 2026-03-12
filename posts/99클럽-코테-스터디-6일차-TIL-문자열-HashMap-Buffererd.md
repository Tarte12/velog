---
title: '99클럽 코테 스터디 6일차 TIL + 문자열, HashMap, Buffererd~'
slug: 99클럽-코테-스터디-6일차-TIL-문자열-HashMap-Buffererd
date: 2024-11-02T10:14:52.875Z
tags: []
---
1. 문제 설계
- 랜덤 숫자를 생성하여 각각의 카드에게 숫자를 부여하여, 무작위로 과일과 숫자를 처리하려고 함
-> 이미 주어진 데이터에서 특정 조건을 만족하는지를 확인하는 문제이므로, 랜덤은 이 문제에 적합하지 않은 도구
- 조건에 따라 데이터를 저장하고 업데이트해야 함 -> HashMap()을 활용하는 것이 포인트

2. 활용 X 개념 keyword
- HashMap(), Map() <- 문제 풀 때 키였음
- Buffered~ <- 백준에서 사용해야 함

3. 개념
- Map : [키-값] 쌍으로 데이터를 저장하는 자료구조
-> 특정 ㄱ키로 값을 빠르게 조회 or 수정 가능하여 데이터가 많을 때 유용
-> java에서 Map은 인터페이스로 HashMap, TreeMap 등이 Map 인터페이스를 구현함

- HashMap : java에서 가장 많이 사용되는 Map 구현체
 -> [Key-Value] 쌍으로 데이터를 저장하는 자료구조
 -> 해쉬 함수를 통한 빠른 데이터 검색
 -> 순서가 중요하지 않은 데이터를 빠르게 저장 및 검색할 때 유용
 -> 주요 메소드
 --> put(key, value): 새로운 키와 값을 저장하거나 기존 키에 대한 값을 업데이트
--> get(key): 키에 해당하는 값을 반환, 해당 키가 없으면 null을 반환
--> containsKey(key): 키가 존재하는지 확인합니다.

- BufferedReader와 BufferedWriter
-> 백준에서는 Buffered를 이용한 입출력이 필수 
-> BufferedReader는 일반 Scanner보다 속도가 빠르고, 대용량 데이터를 처리할 때 유리
-> BufferedWriter 역시 빠른 출력을 제공하여 코딩 테스트에서 자주 사용
- 코드 예시
> import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.io.IOException;
> 
> public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
> 
>         // 예제 입력 받기
        String input = br.readLine();
        int num = Integer.parseInt(input);
> 
>         // 예제 출력하기
        bw.write(String.valueOf(num));
        bw.newLine();
        bw.flush();
> 
        br.close();
        bw.close();
    }
}
5. 비슷한 문제 링크 (공부하고 풀어볼 것)
- 백준
1. 회사에 있는 사람 : https://www.acmicpc.net/problem/7785
2. 생태학 :
https://www.acmicpc.net/problem/4358
- 프로그래머스
1. 전화번호 목록 : https://school.programmers.co.kr/learn/courses/30/lessons/42577