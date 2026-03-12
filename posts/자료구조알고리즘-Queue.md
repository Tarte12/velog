---
title: '[자료구조/알고리즘] Queue'
slug: 자료구조알고리즘-Queue
date: 2024-11-25T04:54:53.070Z
tags: []
---
## Queue : 놀이공원의 줄 서기
![](https://velog.velcdn.com/images/emprimula/post/c5f8ab3f-85f9-4ac6-b28a-ff044dd40ccb/image.png)
- 입구와 출구가 따로 있는 원통 형태의 자료구조
- FIFO : First In First Out (선입선출)
- 데이터를 꺼낼 때, 첫 번째 저장된 데이터 삭제 
=> 따라서, 데이터의 추가/삭제가 쉬운 컬렉션 프레임워크가 적합 (LinkedList 등)

### 구조 비교
- Stack의 경우 : 정해진 입구(top)에서 삽입, 삭제가 둘 다 이뤄지지만,
- Queue의 경우 : rear(입구)에서 삽입, front(출구)에서 삭제 연산을 '각각' 수행

### 연산
- front(프론트) : 삭제 연산 수행
-> Dequeue(디큐) : 프론트에서 이뤄지는 삭제 연산
- rear(리어) : 삽입 연산 수행
-> Enqueue(인큐) : 리어에서 이뤄지는 삽입 연산

- 스택과 달리 생성자가 없는 인터페이스 (new Stack 같은 생성자 X)
- 생성자가 존재하는 클래스인 LinkedList를 사용해서 Queue를 생성해서 사용해야 함
- Queue 사용 위해 java.util.LinkedList; import.util.Queue; 추가해야 함

### 활용 예시
- 주로 데이터가 데이터가 입력된 시간 순서대로 처리해야 할 필요가 있는 상황에 쓰임
1. 최근 사용 문서 목록
2. 인쇄 작업 대기 목록
3. Buffer(버퍼)
4. 우선순위가 같은 작업 예약
5. 은행 업무
6. 콜센터 고객 대기 시간
7. 너비 우선 탐색(BFS, Breadth-First Search) 구현
8. 선착순 티켓 판매

### 예시

#### 예시 1
```
public class StackQueue {
	public static void main (String[] args) {
        Queue<String> q = new LinkedList<String>();		// LinkedList 클래스로 객체 생성
    
    	q.offer("0");
        q.offer("1");
        q.offer("2");
    
    	System.out.println("--- Queue ---")
		While(!q.isEmpty()) {
        	System.out.println(q.pop());
        }
    }
}

/* 출력 결과
0
1
2
*/
```
- java에서는 큐를 Queue 인터페이스로만 정의 -> 별도의 클래스 제공 X
-> 따라서, Queue 인터페이스를 구현한 클래스 중에 하나를 사용 (예시는 LinkedList 사용)

#### 예시2 : 메소드
```
import java.util.LinkedList;
import java.util.Queue;

public class Main {
	public static void main(String[] args) {
		Queue<Integer> intQueue = new LinkedList<>(); 		// 선언 및 생성

		intQueue.add(1);
		intQueue.add(2);
		intQueue.add(3);

		// 다 지워질때까지 출력
		while (!intQueue.isEmpty()) {
			System.out.println(intQueue.poll()); 		// 1,2,3 출력
		}

		// 다시 추가
		intQueue.add(1);
		intQueue.add(2);
		intQueue.add(3);

		// peek() vs pop()
		// 1. peek()
		System.out.println(intQueue.peek()); 	// 1 출력 (맨먼저 들어간값이 1 이라서)
		System.out.println(intQueue.size()); 	// 3 출력 (peek() 할때 삭제 안됬음)

		// 2. poll()
		System.out.println(intQueue.poll()); 	// 1 출력
		System.out.println(intQueue.size()); 	// 2 출력 (poll() 할때 삭제 됬음)

		System.out.println(intQueue.poll()); 	// 2 출력
		System.out.println(intQueue.size()); 	// 1 출력 (poll() 할때 삭제 됬음)

		// 다 지워질때까지 출력
		while (!intQueue.isEmpty()) { 
			System.out.println(intQueue.poll()); 		// 3 출력 (마지막 남은거 하나)
		}
	}
```
#### add()
- 지정된 객체를 큐에 추가
- 성공하면 true, 실패하면 false를 반환
- 저장 공간이 부족하면 IllegalStateException 발생

#### offer()
- 큐에 객체를 저장
- 성공하면 true, 실패하면 false를 반환

#### <add() VS offer()>
- add() : 큐에 요소 추가 + 꽉 찼을 때 예외 반환
- offer() : 큐에 요소 추가 + 꽉 찼을 때 false 반환
=> 데이터를 추가할 때 반드시 성공해야 하는 상황에 add()를 사용 
제한된 크기의 큐에서 빈번한 실패가 허용되지 않는 경우

#### remove()
- 큐에서 객체를 꺼내 반환
- 비어 있으면 NoSuchElementException 발생

#### poll()
- 큐에서 객체(맨 앞(front)가 가르키는 값) 을 꺼내서 반환
- 큐가 비어 있으면 null을 반환

#### <remove() VS poll()>
- remove() : 큐에서 요소 제거 및 반환 + 큐가 비었을 때 예외 반환
- poll() : 큐에서 요소 제거 및 반환 + 큐가 비었을 때 null 반환
=> 큐에서 요소를 제거할 때 큐가 비어 있는 상황이 비정상적인 경우 remove() 사용
오류를 명확하게 드러냄

#### element()
- 삭제 없이 저장된 요소 읽어오기
- peek()와 달리, 큐가 비었을 때 NoSuchElementException을 발생(peek()는 null을 반환)

#### peek()
- 삭제 없이 저장된 요소(맨 앞(front)가 가리키는 값)을 읽어옴
- 큐가 비었을 때 null을 반환

#### <element() VS peek()>
- element() : 첫 번째 요소를 반환 + 큐가 비었을 때 예외 반환
- peek() : 첫 번째 요소 반환 + 큐가 비었을 때 null 반환
=> 큐에서 요소를 조회할 때, 큐가 비어 있는 상황이 비정상일 때 element()를 사용
오류를 명확하게 드러냄

#### enqueue()
- 큐의 마지막 위치에 데이터를 추가하는 메서드

#### dequeue()
- 큐의 첫 번째 위치에 있는 데이터를 반환하고 삭제하는 메서드

#### <비공식 메서드 : enqueue(), dequeue()>
- 큐의 작동 원리를 설명하기 위한 비공식적인 이름
- 실제 java queue 인터페이스에는 존재하지 않음

#### clear()
- 큐에 저장된 데이터를 삭제하고 초기화

#### 차이점 결론

- add(), remove(), element()는 비정상적인 상황을 명확히 드러내고 싶을 때 사용
- 일반적인 큐 사용에서는 offer(), poll(), peek()이 더 적합하고 널리 사용
- 상황에 따라, 에러 처리가 필요하면 예외 발생 메서드를, 유연하게 동작하려면 반환값 기반 메서드를 선택