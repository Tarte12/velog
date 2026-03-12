---
title: '[DB/JPA] 📦 Spring 프로젝트 REST API로 CRUD 기능 생성 (3) File – Inkpad 개발기 #4
'
slug: DBJPA-Spring-프로젝트-REST-API로-CRUD-기능-생성-2-File-Inkpad-개발기-4
date: 2025-06-20T05:55:38.222Z
tags: []
---
> File 도메인마저 만들기

## 문제 상황

## File 도메인: 파일 교체 및 파일 이름 수정 문제
> - `storedFilename`, `filePath`, `size`, `contentType`, `uploadedAt` 등은 88서버가 파일 업로드 시 자동으로 설정88함 <= 사용자가 조작하는 것이 아님
> - 사용자는 **직접 파일 이름**(`originalFilename`) 조작

### 설계 결론
#### 1. 파일 교체 = 파일 업로드(새로운 파일 등록)
- `update()` 쓰지 않고, `delete + create`로 처리
#### 2. 파일 이름 업데이트
- **업로드된 파일의 이름만 바꾸는 API** 작성

> => update 코드 싹 지우고, 2번 코드만 작성
> - `updateFilename`

# File.java
```java
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.query.sql.internal.ParameterRecognizerImpl;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class File {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    private String originalFilename; //업로드된 이름
    private String storedFilename; //UUID 등으로 변환된 이름
    private String filePath; //파일 저장 위치 경로
    private Long size; //크기
    private String contentType; //MIME 타입
    private LocalDateTime uploadedAt; //업로드 일시


    public File(String originalFilename, String storedFilename, String filePath, Long size, String contentType,LocalDateTime uploadedAt){
        this.id = id;

        this.originalFilename = originalFilename;
        this.storedFilename = storedFilename;
        this.filePath = filePath;
        this.size = size;
        this.contentType = contentType;
        this.uploadedAt = uploadedAt;
    }

    //파일 이름만 변경하는 메서드(사용자 직접 조작)
    public void updateFilename(String newFilename){
        this.originalFilename = newFilename;

    }
    //주의: 파일 교체는 '삭제 -> 새로 생성' 방식으로 처리

}
```
# FileRepository.java
```java
package org.example.demo3.repository;

import org.example.demo3.domain.file.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {
}
```
# FileService.java
```java
package org.example.demo3.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.demo3.domain.file.File;
import org.example.demo3.repository.FileRepository;
import org.springframework.stereotype.Service;
//실제 파일 업로드를 위해 추가

import java.util.List;
import java.util.Optional;
//파일 처리 예외를 위해 추가
//물리 파일 처리를 위해 추가


@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;

    //새 파일 생성(저장)
    public File create(File file){

        return  fileRepository.save(file);
    }

    //전체 조회
    public List<File> findAll(){

        return fileRepository.findAll();
    }

    //단건 조회
    public Optional<File> findById(Long id){

        return  fileRepository.findById((id));
    }

    //삭제
    public  void delete(Long id){

        fileRepository.deleteById(id);
    }

    //어떻게 호출할지 처리하는 메서드
    @Transactional
    public  void updateFilename(Long id, String newFilename) {
        File file = fileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일 없음"));
        file.updateFilename(newFilename);
    }

}
```
# FileController.java
> - `FileService`에서 CRUD만 만들어 놓고 
> - `Controller`에서 파일 교체 코드를 'delete + create' 조합으로 짠다

```java
package org.example.demo3.controller;

import lombok.RequiredArgsConstructor;
import org.example.demo3.domain.file.File;
import org.example.demo3.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private  final FileService fileService;

    //새 파일 생성 저장
    @PostMapping
    public ResponseEntity<File> create(@RequestBody File file){

        return  ResponseEntity.ok(fileService.create(file));
    }

    //모든 파일 조회
    @GetMapping
    public  ResponseEntity<List<File>> findAll() {

        return  ResponseEntity.ok(fileService.findAll());
    }

    //단건 파일 조회
    @GetMapping("/{id}")
    public ResponseEntity<File> findById(@PathVariable Long id){

        return  fileService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //파일 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){

        fileService.delete(id);
        return  ResponseEntity.noContent().build();
    }

    //파일 이름만 수정
    @PutMapping("/{id}/filename")
    public ResponseEntity<Void> updateFilename(@PathVariable Long id, @RequestBody Map<String, String> req) {
        String newFilename = req.get("filename");
        fileService.updateFilename(id, newFilename);
        return ResponseEntity.ok().build();
    }


    //파일 교체
    @PutMapping("{id}")
    public ResponseEntity<File> replace(@PathVariable Long id, @RequestBody File file){
        fileService.delete(id);
        File newFile = fileService.create(file);
        return  ResponseEntity.ok(newFile);
    }
}
```