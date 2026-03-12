---
title: '99클럽 코테 스터디 9일차 TIL + 문자열, HashMap, List (ing)'
slug: 99클럽-코테-스터디-9일차-TIL-문자열-HashMap-List-ing
date: 2024-11-05T04:01:26.437Z
tags: []
---
문제 : https://www.acmicpc.net/problem/9933

> 문제 설계
1. 비밀번호 후보 배열 설정
2. 문자열을 뒤집어서 체크
3. 찾은 비밀번호를 바탕으로 길이와 가운데 글자 출력
문제점
1. 뒤집힌 문자열 체크의 어려움
-> HashMap을 이용해 각 단어와 뒤집힌 단어를 key-value 구조로 저장하기 if) key-yek로 저장
2. 배열의 고정된 크기라는 특성
-> list는 크기를 유동적으로 조정할 수 있기 때문에 ArrayList or LinkedList 사용

## 놓친 개념
### List
특징
1. 크기의 유동성 : 배열처럼 크기가 정해지지 않음
2. 인덱스를 통한 접근 : 각 단어를 list에 담아 놓고 list를 순회하기 쉬움
3. 중복 데이터 허용 

## List 사용
> import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
> 
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
>         
        int N = Integer.parseInt(br.readLine()); // 단어의 수
        List<String> words = new ArrayList<>();  // 단어 리스트
> 
        // 단어 입력받기
        for (int i = 0; i < N; i++) {
            words.add(br.readLine().trim());
        }
> 
        // 비밀번호 찾기
        for (String word : words) {
            String reversedWord = new StringBuilder(word).reverse().toString();
>             
            // 뒤집은 단어가 리스트에 포함되어 있으면 비밀번호
            if (words.contains(reversedWord)) {
                int length = word.length();
                char middleChar = word.charAt(length / 2);
>                 
>                 System.out.println(length + " " + middleChar);
>                 break;  // 답이 유일하므로 찾으면 종료
>             }
>         }
>     }
> }

  - for(String word : words) : 리스트 words의 각 단어 word를 순회
- String reversedWord = new StringBuilder(word).reverse().toString(); 
  -> StringBuilder() : 문자열을 조작하는 클래스로 반복적인 수정에 사용
  -> .reverse() : StringBuilder의 reverse() 메서드로 문자열을 뒤집는 메서드
  -> .toString() : StringBuilder의 내용을 String으로 변환하는 메서드
- if(words.contains(reversedWord)) : words 리스트에 reversedWord가 포함되어 있는지
  -char middleChar = word.charAt(length/2) : 문자열의 중간 위치의 문자를 가져옴
  
## HashMap 사용
> import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.HashMap;
> 
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
>         
        int N = Integer.parseInt(br.readLine());
        HashMap<String, String> wordMap = new HashMap<>();
> 
        // 단어 입력 및 HashMap으로 뒤집힌 단어 체크
        for (int i = 0; i < N; i++) {
            String word = br.readLine().trim();
            String reversedWord = new StringBuilder(word).reverse().toString();
>             
            // 이미 뒤집힌 단어가 있는지 확인
            if (wordMap.containsKey(reversedWord)) {
                int length = word.length();
                char middleChar = word.charAt(length / 2);
>                 
>                 System.out.println(length + " " + middleChar);
                return;  // 답이 유일하므로 찾으면 종료
            }
>             
            // 뒤집힌 단어가 없으면 현재 단어를 추가
            wordMap.put(word, word);
        }
    }
}
  
 - for문에서 word와 reversedword를 정의한 뒤, wordMap.put을 이용하여야 한다고 생각해서 코드가 이해되지 않음 -> 일단 if문을 false로 체크하고 넘긴 뒤 reversedword를 다시 뒤집은 값 (word랑 똑같은 문자열)이 있는지 확인하고 없으면 그때 wordMap.put을 이용해 wordMap을 채워나가는 흐름임을 이해
  
 - 그냥 도구만 달라졌을 뿐 StringBuilder를 사용하거나 charAt() 사용하거나 하는 논리 구성은 똑같음
- 리스트를 생성하여, 리스트의 내용물을 뒤집어서 리스트를 순회하면서 비교하는 논리와 해쉬맵을 이용하여 짝을 맞춰서 비교하는 논리를 이해하기

