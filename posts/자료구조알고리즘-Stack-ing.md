---
title: '[자료구조/알고리즘] Stack'
slug: 자료구조알고리즘-Stack-ing
date: 2024-11-19T09:46:39.946Z
tags: ['TIL', '알고리즘', '자료구조', '코테']
---
# Stack

## Stack? -> '쌓다', '더미'
- 정의 : 데이터를 쌓는 형태의 자료구조
- Last In First Out(LIFO) -> 후입선출
(Queue 같은 경우에는 선입선출, FIFO)
> 스택 선언
import java.util.Stack 
Stack stack = new Stack();

![](https://velog.velcdn.com/images/emprimula/post/cdb5c59c-f4eb-4cb0-940e-5265d621a38d/image.png)
#### - 특징
1. 가장 최근에 요청된 것을 가장 먼저 처리, 가장 처음에 들어온 요청을 마지막에 처리 -> 물병에 데이터를 차곡차곡 쌓는 이미지!
	- 같은 구조, 크기의 데이터를 정해진 방향으로만 쌓을 수 있음
	- top으로 정한 곳을 통해서만 접근 가능하며(물병의 입구 같은 느낌?), 데이터의 추가/삭제가 이뤄짐
2. 자로구조 중 stack에 들어간 프로그램의 작업 요청을 처리하는 방식
	- push : 삽입
	- pop : 삭제
3.1 stack underflow : 비어있는 stack에서 원소를 추출하는 상황
3.2 stack overflow : stack이 넘치는 상황
4. stack이 적합한 경우 (순차적, 후입선출의 특징을 가지고)
	- ArrayList 같은 배열 기반의 컬렉션 프레임워크
	- 인터럽트 처리, 수식의 계사느 서브루틴 복귀 번지 저장 등에 사용
	- DFS에서 사용
	- 재귀적 함수 호출할 때 사용
#### - stack 활용 예시
1. 웹 브라우저 앞/뒤로 가기
	- 가장 나중에 열린 페이지부터 보여 주기 때문
2. 수식 계산
3. 수식 괄호 검사
	- 연산자 우선순위를 표현한 괄호 검사
4. 워드 프로세스의 undo/redo
	- 가장 나중에 실행된 것부터 실행 취소
5. 역순 문자열 만들기
	- 가장 나중에 입력된 문자부터 출력
#### - 메소드 정리

| 메소드 | 설명 |
|:----------|:--------:|
|boolean empty()|stack이 비었는지 체크|
|Object peek()|stack의 맨 위에 저장된 객체 반환, <br/> pop()과 달리 stack에서 아예 객체를 꺼내는 것은 X,<br/> 비었다면 EmptyStackException 발생|
|Object pop()|stack의 맨 위에 저장된 객체를 꺼낸다, <br/> 비었다면
EmptyStackException 발생|
|Object push(Object item)| stack에 객체(item) 저장|
|int search(Object o)|stack에 주어진 객체(o)를 찾아서 그 위치를 반환, <br/> 못 찾으면 -1 반환, <br/> 배열과 달리 위치는 0이 아닌 1부터 시작|
#### - 사용법
```
import java.util.Stack; //stack 가져오기

public class Col1 {
	public static void main(String[] args) {
    	Stack<Integer> intStack = new Stack<Integer>(); 
        //선언 및 생성
        
        //스택 구조에 자료 추가
        intStack.push(1);
        intStack.push(2);
        intStack.push(3);
        
        while(!intStack.isEmpty()){
        	system.out.println(intStack.pop());
            //쌓은 자료를 3 -> 2 -> 1 순서로 꺼내서 출력
        }
        
        //스택 구조에 자료 추가
        intStack.push(1);
        intStack.push(2);
        intStack.push(3);
        
        //peek vs pop
        system.out.println(intStack.peek());
        system.out.ptintln(intStack.size());
        //출력만 해 주고 꺼내는 것이 아니라 size는 3
        
        system.out.println(intStack.pop());
        system.out.println(intStack.size());
        //꺼내고 출력하는 것이라 size는 2
    }
}
```
#### - 개념 공부용 문제 
- 쉬운 문제 (개념 학습용)
	- 프로그래머스: 같은 숫자는 싫어
	https://school.programmers.co.kr/learn/courses/30/lessons/12906
	- 백준: 10828번 스택
https://www.acmicpc.net/problem/10828

- 응용 문제 (개념 활용)
	- 프로그래머스: 기능개발
https://school.programmers.co.kr/learn/courses/30/lessons/42586
	- 백준: 9012번 괄호
https://www.acmicpc.net/problem/9012





