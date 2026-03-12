---
title: '99클럽 코테 스터디 2일차 TIL + 반복문 및 문자열 길이 접근 방식, Integer.parseInt, compareTo'
slug: 99클럽-코테-스터디-2일차-TIL-반복문-및-문자열-길이-접근-방식-Integer.parseInt-compareTo
date: 2024-10-29T03:37:22.861Z
tags: ['99클럽', 'TIL', '개발자취업', '코딩테스트준비', '항해99', '항해99_코테스터디']
---
## 문제
- 프로그래머스 : 연습 문제 - 크기가 다른 부분 문자열
https://school.programmers.co.kr/learn/courses/30/lessons/147355
## 오늘의 학습 키워드
- 반복문 및 문자열 길이 접근 방식
- 정수 변환 범위 제한 (Integer.parselnt)
- 문자열 비교 (CompareTo)

## 문제 분석 및 처음 설계한 논리 구조
1. 부문 문자열 추출 : t에서 p와 같은 길이의 부분 문자열 출력
2. 정수 변환 및 비교 : 추출한 부분 문자열과 p를 정수로 반환 -> 두 수를 비교하여 p보다 작거나 같은 경우 카운트
3. 결과 반환 : 조건을 만족한 문자열의 개수 반환
-> 문제 기본 논리 구조는 올바른 접근 방식이었다고 생각함
## 코드 작성
> class Solution {
>    public int solution(String t, String p) {
 >       
 >       int count = 0;
 >       
 >       for(int i = 0; i <= t.length() - p.length(); i++){
 >           
 >           String res = t.substring(i, i + p.length());
 >           //Integer.parseInt()로 정수로 변환하여 푸는 방법 정확>도 63.2%
>            //int num1 = Integer.parseInt(p);
>            //int num2 = Integer.parseInt(res);
>            
   >         //if(num2 <= num1) count++;
  >          
   >         //compareTo() 이용하는 방법
  >          if (res.compareTo(p) <= 0) {
   >             count++;
   >         }
  >      }
  >      
 >       return count;
 >   }

## 놓친 개념 및 수정 포인트
1. Integer.parseInt
- 놓친 개념 : Integer.parseInt가 int 범위 내에서만 변환이 가능하므로 정수 범위 제한 문제가 발생함
- 해결 방법 : 정수로 변환하는 과정을 거치지 않고 compareTo 메서드를 이용해 문자열을 다이렉트로 비교하는 방법 사용 -> 숫자로 이뤄진 문자열도 비교할 수 있음
2. 문법 실수
3. 예외 처리
- 놓친 개념 : Integer.parseInt로 문자열을 반환할 때, 숫자가 아닌 값이나 범위를 초과할 경우 예외가 발생할 수 있음 -> compareTo로 해결하였으나, 보통 try-catcg 구문으로 예외를 처리하므로 알아 놔야 함
## 코드 설계 강점과 약점 분석
강점 
- 알고리즘 설계 : 처음 설계한 논리 자체는 수정해야 할 부분이 없었던 것 같음

약점 
- 개념 부족 : 정수 범위와 문자열을 비교하는 과정에서 범위 체크라든가 예외 발생의 가능성을 생각하지 못함 -> Java에서 문자열 비교 방법을 활용하지 못하였음