---
title: '99클럽 코테 스터디 3일차 TIL + 문자열 탐색, charAt() (추후 수정 예정)'
slug: 99클럽-코테-스터디-3일차-TIL-문자열-탐색-charAt
date: 2024-10-30T09:56:47.367Z
tags: []
---
## 문제
- 프로그래머스 : 연습 문제 - 문자열 나누기
https://school.programmers.co.kr/learn/courses/30/lessons/140108
## 오늘의 학습 키워드
- 문자열 탐색 : for문과 while루프를 통해 문자열 탐색
- 인덱스 조작
- 문자열 길이 메서드
- 문자 비교 및 조건 분기
- 코드 디버깅과 수정 방법

## 문제 분석 및 처음 설계한 논리 구조
1. 변수 정의 및 초기화 : 첫 글자를 x, 글자의 개수를 count_x와 count_not_x로 정의
2. 문자열 반복문 순회
3. 분리 조건 : 카운트가 같아지면 분리하여 cut의 값을 증가시키고, 다시 문자열 s를 순회
3. 결과 반환
## 코드 작성
>class Solution {
    public int solution(String s) {
        int cut = 0;
        int i = 0;
>        
>       while (i < s.length()) {
            char x = s.charAt(i);
            int count_x = 1;
            int count_not_x = 0;
            i++;
>
>          while (i < s.length()) {
                if (s.charAt(i) == x) {
                    count_x++;
                } else {
                    count_not_x++;
                }
 >               
 >               i++;
 >               
 >               if (count_x == count_not_x) {
                    cut++;
                    break;
                }
            }
        }
>
>        if (i == s.length()) {
            cut++;
        }
>        
>        return cut;
    }
}



## 놓친 개념 및 수정 포인트
1. 배열 접근 방식과 반복문 인덱스 오류
- 놓친 개념: Java에서는 문자열의 개별 문자를 s[i]로 접근할 수 없고, 접근 위해 s.charAt(i)를 사용해야 함
- 수정 방법: s[i]를 s.charAt(i)로 변경
2. 첫 글자 초기화 및 변수 재설정
- 놓친 개념: x와 count_x 및 count_not_x는 매번 문자열 조각을 분리할 때마다 초기화해야 하는 과정 누
- 수정 방법: count_x와 count_not_x를 분리 시점마다 0으로 초기화하고, 새 문자열 조각의 첫 글자를 x로 업데이트
3. 문자열 조각 추출 방법
- 놓친 개념: s.substring(0, i)는 단순히 조각을 가져올 뿐이고, 실제로 s에서 해당 부분을 제거하지 않음
- 수정 방법: s의 문자열을 제거하지 않아도 i를 기준으로 문자열 조각을 반복적으로 분리하여 처리할 수 있도록 코드 구조를 변경
4. 분리 완료 후 cut 누락 문제
- 놓친 개념: 문자열을 모두 순회한 후, 조건을 충족하지 못한 마지막 조각은 cut에 반영되지 않음
- 수정 방법: for 루프 이후 남은 부분이 있으면 추가로 cut을 증가시키도록 코드 추가
## 코드 설계 강점과 약점 분석
강점 
- 문제 접근 방식

약점 
- 문자열 접근 방식과 변수 초기화 미흡 : charAt()를 사용하지 않은 것과 문자열마다 변수 초기화가 되지 않은 것