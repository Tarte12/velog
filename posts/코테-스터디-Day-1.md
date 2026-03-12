---
title: '99클럽 코테 스터디 1일차 TIL + 문자열, 배열, 반복문, 조건문 '
slug: 코테-스터디-Day-1
date: 2024-10-27T08:36:40.206Z
tags: ['99클럽', 'TIL', '개발자취업', '코딩테스트준비', '항해99', '항해99_코테스터디']
---
## 오늘의 학습 키워드
- 문자열, 배열, 반복문, 조건문
## 공부한 내용 본인의 언어로 정리하기
1. 문제 읽고 설계
- 문자열을 주고, 문자열을 비교해야 함 => 문자열을 배열로 바꿔야겠다고 생각함
- 문자열 내의 문자의 개수를 비교 => 문자열을 하나씩 따져서 카운팅하면 된다고 생각하여, 반복문과 조건문을 이용해 개수를 카운팅해야겠다고 생각함
2. 작성
class Solution {
    
    boolean solution(String s) {
        
        char[] array = s.toCharArray();
        
        int count_p = 0;
        int count_y = 0;
        
        boolean answer = true;
        
        for(int i=0; i< array.length; i++){
            
            
            if(array[i] == 'p' || array[i] == 'P') count_p++;
            if(array[i] == 'y' || array[i] == 'Y') count_y++;

        }
        
        if(count_p == count_y){
            answer = true;
        }
        
        else {
            answer = false;
        }

        return answer;
    }
}
3. 수정
- 문자열을 배열로 치환하는 문법의 오류를 수정함
- 기초 문법 틀린 게 있어서 수정함
## 오늘의 회고
###   어떤 문제가 있었고, 나는 어떤 시도를 했는지
- 문제 1 : 문자열 -> 배열 변환
	- 변환하는 방법이 기억 안 나서 문법만 검색하였음
###   어떻게 해결했는지
- toCharArray() 검색 후 찾아서 이용
###   무엇을 새롭게 알았는지
- 문자열을 배열로 변환할 때 toCharArray() 사용하기
### 다른 사람 풀이 보고 배운 것은 무엇인지
- 람다식으로 푸는 방법
- 효율성은 안 좋다는데 개념은 함 보는 것도 괜찮을 듯
###   내일 학습할 것은 무엇인지예정 (태그 생성용)